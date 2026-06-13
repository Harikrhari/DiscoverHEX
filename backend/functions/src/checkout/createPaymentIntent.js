"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");
const { calculateTaxForOrder } = require("../tax/calculateTax");

const db = admin.firestore();

/**
 * Creates a Stripe PaymentIntent with:
 *  - Cart validation against live Firestore product data
 *  - TaxJar tax calculation
 *  - 5-10% charity allocation pre-computed
 *
 * Callable: functions.httpsCallable('createPaymentIntent')
 *
 * Input:
 *   {
 *     items: [{ productId, variantId?, quantity, price }],
 *     shippingAddress: { line1, line2?, city, state, zip, country },
 *     storeAddress: { line1, city, state, zip, country },  // optional, defaults to env
 *     promoCode?: string
 *   }
 *
 * Returns:
 *   { clientSecret, taxAmount, charityAmount, subtotal, total, breakdown }
 */
exports.createPaymentIntent = functions
  .runWith({ secrets: ["STRIPE_SECRET_KEY", "TAXJAR_API_KEY"] })
  .https.onCall(async (data, context) => {
    // ── Auth guard ────────────────────────────────────────────────────────────
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in to check out."
      );
    }

    const uid = context.auth.uid;

    // ── Input validation ──────────────────────────────────────────────────────
    const { items, shippingAddress, promoCode } = data;

    if (!Array.isArray(items) || items.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Cart must contain at least one item."
      );
    }

    if (!shippingAddress || !shippingAddress.zip || !shippingAddress.state) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "A valid shipping address with state and zip is required."
      );
    }

    // ── Validate items against Firestore and compute subtotal ─────────────────
    const validatedItems = [];
    let subtotal = 0;

    await Promise.all(
      items.map(async (item) => {
        if (
          !item.productId ||
          typeof item.quantity !== "number" ||
          item.quantity < 1
        ) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            `Invalid item: ${JSON.stringify(item)}`
          );
        }

        const productRef = db.collection("products").doc(item.productId);
        const productSnap = await productRef.get();

        if (!productSnap.exists) {
          throw new functions.https.HttpsError(
            "not-found",
            `Product ${item.productId} not found.`
          );
        }

        const product = productSnap.data();

        if (!product.isActive) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            `Product "${product.title}" is no longer available.`
          );
        }

        // Use server-side price — never trust client price
        let unitPrice = product.price;

        // Variant check
        if (item.variantId) {
          const variantSnap = await productRef
            .collection("variants")
            .doc(item.variantId)
            .get();

          if (!variantSnap.exists) {
            throw new functions.https.HttpsError(
              "not-found",
              `Variant ${item.variantId} not found.`
            );
          }

          const variant = variantSnap.data();

          if (variant.stock < item.quantity) {
            throw new functions.https.HttpsError(
              "failed-precondition",
              `Insufficient stock for "${product.title}" (${variant.name}).`
            );
          }

          if (typeof variant.priceAdjustment === "number") {
            unitPrice += variant.priceAdjustment;
          }
        } else if (typeof product.stock === "number" && product.stock < item.quantity) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            `Insufficient stock for "${product.title}".`
          );
        }

        const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;
        subtotal += lineTotal;

        validatedItems.push({
          productId: item.productId,
          variantId: item.variantId || null,
          title: product.title,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
          taxCode: product.taxCode || "P0000000", // TaxJar general tangible goods
        });
      })
    );

    // ── Promo / discount ──────────────────────────────────────────────────────
    let discountAmount = 0;
    let promoData = null;

    if (promoCode) {
      const promoSnap = await db
        .collection("promoCodes")
        .where("code", "==", promoCode.toUpperCase())
        .where("isActive", "==", true)
        .limit(1)
        .get();

      if (!promoSnap.empty) {
        promoData = promoSnap.docs[0].data();

        if (promoData.type === "percent") {
          discountAmount = Math.round(subtotal * (promoData.value / 100) * 100) / 100;
        } else if (promoData.type === "fixed") {
          discountAmount = Math.min(promoData.value, subtotal);
        }
      }
    }

    const discountedSubtotal = subtotal - discountAmount;

    // ── Tax calculation ───────────────────────────────────────────────────────
    const storeAddress = data.storeAddress || {
      line1: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "US",
    };

    let taxAmount = 0;
    let taxBreakdown = null;

    try {
      const taxResult = await calculateTaxForOrder({
        lineItems: validatedItems,
        fromAddress: storeAddress,
        toAddress: shippingAddress,
      });

      taxAmount = taxResult.totalTax;
      taxBreakdown = taxResult.breakdown;
    } catch (taxErr) {
      functions.logger.warn("Tax calculation failed, proceeding without tax", {
        error: taxErr.message,
        uid,
      });
      // Non-fatal: continue with $0 tax and flag for manual review
      taxAmount = 0;
      taxBreakdown = { error: "Tax calculation unavailable" };
    }

    // ── Charity allocation ────────────────────────────────────────────────────
    const charityPercent =
      parseInt(process.env.CHARITY_ALLOCATION_PERCENT || "5", 10) / 100;
    // Scale: orders > $100 get 7.5%, orders > $250 get 10%
    const effectivePercent =
      discountedSubtotal > 250
        ? 0.1
        : discountedSubtotal > 100
          ? 0.075
          : charityPercent;

    const charityAmount = Math.round(discountedSubtotal * effectivePercent * 100) / 100;

    // ── Compute grand total ───────────────────────────────────────────────────
    const total = Math.round((discountedSubtotal + taxAmount) * 100) / 100;

    // ── Create Stripe PaymentIntent ───────────────────────────────────────────
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const amountInCents = Math.round(total * 100);

    if (amountInCents < 50) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Order total is too low (minimum $0.50)."
      );
    }

    // Store a pending order doc first so we have an orderId
    const pendingOrderRef = db.collection("orders").doc();
    const pendingOrderId = pendingOrderRef.id;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: pendingOrderId,
        uid,
        charityAmount: charityAmount.toFixed(2),
        charityPercent: (effectivePercent * 100).toFixed(1),
        itemCount: validatedItems.length.toString(),
        promoCode: promoCode || "",
      },
      description: `DiscoverHEX order for user ${uid}`,
      receipt_email: context.auth.token.email || undefined,
    });

    // ── Persist pending order ─────────────────────────────────────────────────
    await pendingOrderRef.set({
      userId: uid,
      status: "pending",
      items: validatedItems,
      subtotal,
      discountAmount,
      promoCode: promoCode || null,
      taxAmount,
      taxBreakdown,
      charityAmount,
      charityPercent: effectivePercent,
      total,
      shippingAddress,
      paymentIntentId: paymentIntent.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info("PaymentIntent created", {
      orderId: pendingOrderId,
      uid,
      total,
      charityAmount,
      paymentIntentId: paymentIntent.id,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: pendingOrderId,
      subtotal,
      discountAmount,
      taxAmount,
      taxBreakdown,
      charityAmount,
      charityPercent: effectivePercent * 100,
      total,
    };
  });
