"use strict";

/**
 * Creator / Influencer Management
 *
 * Firestore structure:
 *   creators/{creatorId}                     — creator profile
 *   creators/{creatorId}/commissions/{commId}— per-order commission records
 *   creators/{creatorId}/payouts/{payoutId}  — payout history
 *
 * Exports (all HTTPS callables):
 *   trackCreatorSale      — log a commission for a creator-attributed order
 *   getCreatorDashboard   — earnings, clicks, conversions dashboard
 *   processCreatorPayout  — trigger payout via Stripe Connect
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

const db = admin.firestore();

// ── Helpers ────────────────────────────────────────────────────────────────

async function getCreatorOrThrow(creatorId) {
  const snap = await db.collection("creators").doc(creatorId).get();

  if (!snap.exists) {
    throw new functions.https.HttpsError("not-found", `Creator ${creatorId} not found.`);
  }

  return { id: snap.id, ...snap.data() };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ── trackCreatorSale ───────────────────────────────────────────────────────

/**
 * Log a commission for a creator when one of their attributed orders is paid.
 *
 * Input: { creatorId, orderId, orderTotal, commission? }
 *   commission — override the creator's default commissionRate if provided
 */
exports.trackCreatorSale = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
  }

  const { creatorId, orderId, orderTotal, commission } = data;

  if (!creatorId || !orderId || typeof orderTotal !== "number" || orderTotal <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "creatorId, orderId, and a positive orderTotal are required."
    );
  }

  const creator = await getCreatorOrThrow(creatorId);

  // Compute commission amount
  const rate = typeof commission === "number"
    ? commission
    : creator.commissionRate || 0.10; // default 10%

  const commissionAmount = Math.round(orderTotal * rate * 100) / 100;

  const creatorRef = db.collection("creators").doc(creatorId);
  const commissionRef = creatorRef.collection("commissions").doc(orderId);

  // Idempotency check
  const existing = await commissionRef.get();
  if (existing.exists) {
    functions.logger.info("Creator commission already logged, skipping", { creatorId, orderId });
    return { success: true, duplicate: true, commissionAmount: existing.data().amount };
  }

  const batch = db.batch();

  batch.set(commissionRef, {
    orderId,
    creatorId,
    orderTotal,
    rate,
    amount: commissionAmount,
    status: "pending", // becomes "paid" after payout
    date: todayKey(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.update(creatorRef, {
    pendingEarnings: admin.firestore.FieldValue.increment(commissionAmount),
    totalEarnings: admin.firestore.FieldValue.increment(commissionAmount),
    totalOrders: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  functions.logger.info("Creator commission tracked", { creatorId, orderId, commissionAmount, rate });

  return { success: true, commissionAmount, rate };
});

// ── getCreatorDashboard ────────────────────────────────────────────────────

/**
 * Return a full dashboard for the creator: earnings, recent commissions, stats.
 *
 * Input: { creatorId }
 */
exports.getCreatorDashboard = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
  }

  const { creatorId } = data;

  if (!creatorId) {
    throw new functions.https.HttpsError("invalid-argument", "creatorId is required.");
  }

  // Creators can only see their own dashboard; admins can see any
  if (!context.auth.token.admin && context.auth.uid !== creatorId) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You can only view your own dashboard."
    );
  }

  const creator = await getCreatorOrThrow(creatorId);

  // Recent commissions (last 30)
  const commissionsSnap = await db
    .collection("creators")
    .doc(creatorId)
    .collection("commissions")
    .orderBy("createdAt", "desc")
    .limit(30)
    .get();

  const recentCommissions = commissionsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Last 30 days totals
  const thirtyDaysAgo = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  const recentSnap = await db
    .collection("creators")
    .doc(creatorId)
    .collection("commissions")
    .where("createdAt", ">=", thirtyDaysAgo)
    .get();

  let last30Earnings = 0;
  let last30Orders = 0;

  recentSnap.docs.forEach((doc) => {
    const d = doc.data();
    last30Earnings += d.amount || 0;
    last30Orders++;
  });

  // Recent payouts
  const payoutsSnap = await db
    .collection("creators")
    .doc(creatorId)
    .collection("payouts")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  const recentPayouts = payoutsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const conversionRate =
    creator.totalClicks > 0
      ? Math.round((creator.totalOrders / creator.totalClicks) * 10000) / 100
      : 0;

  return {
    creatorId,
    displayName: creator.displayName || creatorId,
    email: creator.email || null,
    status: creator.status || "active",
    commissionRate: creator.commissionRate || 0.10,
    referralCode: creator.referralCode || null,
    lifetime: {
      totalEarnings: Math.round((creator.totalEarnings || 0) * 100) / 100,
      pendingEarnings: Math.round((creator.pendingEarnings || 0) * 100) / 100,
      paidEarnings: Math.round((creator.paidEarnings || 0) * 100) / 100,
      totalOrders: creator.totalOrders || 0,
      totalClicks: creator.totalClicks || 0,
      conversionRate,
    },
    last30Days: {
      earnings: Math.round(last30Earnings * 100) / 100,
      orders: last30Orders,
    },
    recentCommissions,
    recentPayouts,
    payoutAccountId: creator.payoutAccountId || null,
    generatedAt: new Date().toISOString(),
  };
});

// ── processCreatorPayout ───────────────────────────────────────────────────

/**
 * Trigger a Stripe Connect payout for a creator's pending earnings.
 *
 * Input: { creatorId, amount? } — if amount omitted, pays out all pending
 *
 * Requires the creator to have a Stripe Connect account ID stored in
 * creator.payoutAccountId.
 */
exports.processCreatorPayout = functions
  .runWith({ secrets: ["STRIPE_SECRET_KEY"] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
    }

    const { creatorId, amount } = data;

    if (!creatorId) {
      throw new functions.https.HttpsError("invalid-argument", "creatorId is required.");
    }

    // Only admins or the creator themselves can initiate a payout
    if (!context.auth.token.admin && context.auth.uid !== creatorId) {
      throw new functions.https.HttpsError("permission-denied", "Unauthorized.");
    }

    const creator = await getCreatorOrThrow(creatorId);

    if (!creator.payoutAccountId) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Creator does not have a connected Stripe account."
      );
    }

    const pendingEarnings = creator.pendingEarnings || 0;

    if (pendingEarnings <= 0) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "No pending earnings to pay out."
      );
    }

    const payoutAmount = typeof amount === "number"
      ? Math.min(amount, pendingEarnings)
      : pendingEarnings;

    const payoutAmountCents = Math.round(payoutAmount * 100);

    if (payoutAmountCents < 100) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Minimum payout amount is $1.00."
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    let transfer;

    try {
      transfer = await stripe.transfers.create({
        amount: payoutAmountCents,
        currency: "usd",
        destination: creator.payoutAccountId,
        description: `DiscoverHEX creator payout for ${creator.displayName || creatorId}`,
        metadata: { creatorId },
      });
    } catch (err) {
      functions.logger.error("Stripe transfer failed", {
        creatorId,
        error: err.message,
      });
      throw new functions.https.HttpsError("internal", `Stripe transfer failed: ${err.message}`);
    }

    const creatorRef = db.collection("creators").doc(creatorId);
    const payoutRef = creatorRef.collection("payouts").doc(transfer.id);

    const batch = db.batch();

    // Record the payout
    batch.set(payoutRef, {
      stripeTransferId: transfer.id,
      amount: payoutAmount,
      currency: "usd",
      status: "paid",
      payoutAccountId: creator.payoutAccountId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update creator earnings
    batch.update(creatorRef, {
      pendingEarnings: admin.firestore.FieldValue.increment(-payoutAmount),
      paidEarnings: admin.firestore.FieldValue.increment(payoutAmount),
      lastPayoutAt: admin.firestore.FieldValue.serverTimestamp(),
      lastPayoutAmount: payoutAmount,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Mark commissions as paid
    const pendingCommissionsSnap = await db
      .collection("creators")
      .doc(creatorId)
      .collection("commissions")
      .where("status", "==", "pending")
      .get();

    pendingCommissionsSnap.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "paid",
        payoutId: transfer.id,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    functions.logger.info("Creator payout processed", {
      creatorId,
      payoutAmount,
      transferId: transfer.id,
    });

    return {
      success: true,
      transferId: transfer.id,
      payoutAmount,
      currency: "usd",
    };
  });
