"use strict";

/**
 * Stripe Webhook Handler
 *
 * Handles:
 *   - payment_intent.succeeded  → finalize order, update inventory,
 *                                  write charity allocation, trigger social post
 *   - payment_intent.payment_failed → mark order as failed
 *
 * Registered as an HTTPS (non-callable) function so Stripe can POST to it.
 * Endpoint: /stripeWebhook
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

const db = admin.firestore();

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Atomically decrement inventory for each line item.
 * Uses a Firestore transaction so concurrent checkouts stay consistent.
 */
async function decrementInventory(items) {
  await db.runTransaction(async (txn) => {
    for (const item of items) {
      const productRef = db.collection("products").doc(item.productId);

      if (item.variantId) {
        const variantRef = productRef.collection("variants").doc(item.variantId);
        const variantSnap = await txn.get(variantRef);

        if (!variantSnap.exists) continue;

        const currentStock = variantSnap.data().stock || 0;
        txn.update(variantRef, {
          stock: Math.max(0, currentStock - item.quantity),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        const productSnap = await txn.get(productRef);

        if (!productSnap.exists) continue;

        const currentStock = productSnap.data().stock || 0;
        txn.update(productRef, {
          stock: Math.max(0, currentStock - item.quantity),
          salesCount: admin.firestore.FieldValue.increment(item.quantity),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
  });
}

/**
 * Write the charity allocation document for this order.
 */
async function writeCharityAllocation(orderId, orderData, paymentIntentId) {
  const charityAmount = parseFloat(
    paymentIntentId.metadata?.charityAmount || orderData.charityAmount || 0
  );

  if (charityAmount <= 0) return;

  // Find the active charity campaign to credit
  const campaignSnap = await db
    .collection("charityFunds")
    .where("status", "==", "active")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  const campaignId = campaignSnap.empty
    ? "general"
    : campaignSnap.docs[0].id;

  const campaignRef = db.collection("charityFunds").doc(campaignId);
  const txRef = campaignRef.collection("transactions").doc(orderId);

  await db.runTransaction(async (txn) => {
    txn.set(txRef, {
      orderId,
      amount: charityAmount,
      currency: "usd",
      campaignId,
      userId: orderData.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "allocated",
    });

    txn.update(campaignRef, {
      totalAllocated: admin.firestore.FieldValue.increment(charityAmount),
      transactionCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  functions.logger.info("Charity allocation written", {
    orderId,
    campaignId,
    charityAmount,
  });
}

/**
 * Trigger social auto-post for a completed order milestone.
 * We check if this order crossed a sales milestone (every 100 orders).
 */
async function maybeTriggerMilestonePost(orderId) {
  try {
    const ordersCount = await db.collection("orders")
      .where("status", "==", "paid")
      .count()
      .get();

    const count = ordersCount.data().count;

    if (count > 0 && count % 100 === 0) {
      // Queue a milestone social post
      await db.collection("socialPosts").add({
        type: "order_milestone",
        milestone: count,
        orderId,
        status: "queued",
        platform: ["instagram", "facebook"],
        scheduledAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info("Milestone social post queued", {
        milestone: count,
        orderId,
      });
    }
  } catch (err) {
    // Non-fatal
    functions.logger.warn("Failed to check milestone for social post", {
      error: err.message,
    });
  }
}

// ── Main webhook handler ──────────────────────────────────────────────────

exports.stripeWebhook = functions
  .runWith({ secrets: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] })
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      functions.logger.error("Stripe webhook signature verification failed", {
        error: err.message,
      });
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    functions.logger.info("Stripe webhook received", {
      type: event.type,
      id: event.id,
    });

    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          await handlePaymentSucceeded(event.data.object);
          break;
        }
        case "payment_intent.payment_failed": {
          await handlePaymentFailed(event.data.object);
          break;
        }
        case "payment_intent.canceled": {
          await handlePaymentCanceled(event.data.object);
          break;
        }
        default:
          functions.logger.debug("Unhandled Stripe event type", {
            type: event.type,
          });
      }

      // Idempotent acknowledgement
      res.status(200).json({ received: true });
    } catch (err) {
      functions.logger.error("Error processing Stripe webhook", {
        eventType: event.type,
        eventId: event.id,
        error: err.message,
        stack: err.stack,
      });
      // Return 200 anyway to prevent Stripe retries for logic errors;
      // use 500 only for transient failures where retry makes sense.
      res.status(500).json({ error: "Internal processing error" });
    }
  });

// ── Event handlers ─────────────────────────────────────────────────────────

async function handlePaymentSucceeded(paymentIntent) {
  const { orderId, uid } = paymentIntent.metadata || {};

  if (!orderId) {
    functions.logger.warn("payment_intent.succeeded missing orderId metadata", {
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) {
    functions.logger.error("Order not found for succeeded PaymentIntent", {
      orderId,
      paymentIntentId: paymentIntent.id,
    });
    return;
  }

  const orderData = orderSnap.data();

  // Idempotency guard — already processed
  if (orderData.status === "paid") {
    functions.logger.info("Order already marked paid, skipping", { orderId });
    return;
  }

  // 1. Update order status
  await orderRef.update({
    status: "paid",
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    stripePaymentIntentId: paymentIntent.id,
    stripeChargeId: paymentIntent.latest_charge || null,
  });

  // Log order event
  await orderRef.collection("events").add({
    type: "payment_succeeded",
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 2. Decrement inventory
  try {
    await decrementInventory(orderData.items || []);
  } catch (err) {
    functions.logger.error("Inventory decrement failed", {
      orderId,
      error: err.message,
    });
    // Non-fatal — log for manual reconciliation
    await orderRef.collection("events").add({
      type: "inventory_decrement_failed",
      error: err.message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // 3. Write charity allocation
  try {
    await writeCharityAllocation(orderId, orderData, paymentIntent);
  } catch (err) {
    functions.logger.error("Charity allocation failed", {
      orderId,
      error: err.message,
    });
  }

  // 4. Maybe trigger a milestone social post
  await maybeTriggerMilestonePost(orderId);

  // 5. Placeholder: fire email confirmation
  // The Firebase Trigger Email extension picks up docs in `mail` collection.
  await db.collection("mail").add({
    to: paymentIntent.receipt_email || orderData.email,
    template: {
      name: "order-confirmation",
      data: {
        orderId,
        total: (paymentIntent.amount / 100).toFixed(2),
        charityAmount: orderData.charityAmount?.toFixed(2) || "0.00",
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
      },
    },
  });

  functions.logger.info("Order successfully processed", {
    orderId,
    uid,
    amount: paymentIntent.amount / 100,
  });
}

async function handlePaymentFailed(paymentIntent) {
  const { orderId } = paymentIntent.metadata || {};

  if (!orderId) return;

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) return;

  const lastError = paymentIntent.last_payment_error;

  await orderRef.update({
    status: "payment_failed",
    failureReason: lastError?.message || "Unknown error",
    failureCode: lastError?.code || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await orderRef.collection("events").add({
    type: "payment_failed",
    paymentIntentId: paymentIntent.id,
    errorMessage: lastError?.message || null,
    errorCode: lastError?.code || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.warn("Payment failed for order", {
    orderId,
    paymentIntentId: paymentIntent.id,
    reason: lastError?.message,
  });
}

async function handlePaymentCanceled(paymentIntent) {
  const { orderId } = paymentIntent.metadata || {};

  if (!orderId) return;

  const orderRef = db.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) return;

  await orderRef.update({
    status: "canceled",
    canceledAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    cancellationReason: paymentIntent.cancellation_reason || null,
  });

  functions.logger.info("Payment intent canceled", {
    orderId,
    paymentIntentId: paymentIntent.id,
  });
}
