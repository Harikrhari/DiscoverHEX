"use strict";

/**
 * Charity Fund Management
 *
 * Firestore structure:
 *   charityFunds/{campaignId}              — campaign document
 *   charityFunds/{campaignId}/transactions/{txId}  — individual allocations
 *
 * Exports (all HTTPS callables unless noted):
 *   allocateToCharity      — allocate a percentage of an order
 *   getCampaignProgress    — return all campaigns with progress %
 *   updateCampaignStatus   — admin: update campaign with received amount
 *   getImpactReport        — public transparency report data
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

// ── Default allocation rate ────────────────────────────────────────────────

function getCharityPercent(orderTotal) {
  if (orderTotal > 250) return 0.10;
  if (orderTotal > 100) return 0.075;
  return parseFloat(process.env.CHARITY_ALLOCATION_PERCENT || "5") / 100;
}

// ── Core: allocateToCharity ───────────────────────────────────────────────

/**
 * Allocate a percentage of an order's total to the active charity campaign.
 *
 * Called internally by the Stripe webhook handler, but also exposed as a
 * callable so admins can manually trigger re-allocation if needed.
 *
 * @param {string} orderId
 * @param {number} orderTotal — order total in USD
 * @param {string} [campaignId] — if omitted, finds the active campaign
 * @returns {{ campaignId, charityAmount, transactionId }}
 */
async function allocateToCharity(orderId, orderTotal, campaignId) {
  if (!orderId || typeof orderTotal !== "number" || orderTotal <= 0) {
    throw new Error("allocateToCharity: valid orderId and positive orderTotal are required.");
  }

  // Find active campaign if not specified
  let resolvedCampaignId = campaignId;

  if (!resolvedCampaignId) {
    const snap = await db
      .collection("charityFunds")
      .where("status", "==", "active")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    resolvedCampaignId = snap.empty ? "general" : snap.docs[0].id;
  }

  const percent = getCharityPercent(orderTotal);
  const charityAmount = Math.round(orderTotal * percent * 100) / 100;

  if (charityAmount <= 0) {
    throw new Error("Calculated charity amount is zero — check order total.");
  }

  const campaignRef = db.collection("charityFunds").doc(resolvedCampaignId);
  const txRef = campaignRef.collection("transactions").doc(orderId);

  await db.runTransaction(async (txn) => {
    // Idempotency: skip if transaction already exists
    const existingTx = await txn.get(txRef);

    if (existingTx.exists) {
      functions.logger.info("Charity transaction already exists, skipping", {
        orderId,
        resolvedCampaignId,
      });
      return;
    }

    // Ensure campaign doc exists
    const campaignSnap = await txn.get(campaignRef);

    txn.set(
      campaignRef,
      {
        totalAllocated: admin.firestore.FieldValue.increment(charityAmount),
        transactionCount: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...(campaignSnap.exists ? {} : {
          name: "General Fund",
          status: "active",
          goal: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }),
      },
      { merge: true }
    );

    txn.set(txRef, {
      orderId,
      campaignId: resolvedCampaignId,
      amount: charityAmount,
      percent,
      orderTotal,
      currency: "usd",
      status: "allocated",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  functions.logger.info("Charity allocated", {
    orderId,
    campaignId: resolvedCampaignId,
    charityAmount,
    percent,
  });

  return {
    campaignId: resolvedCampaignId,
    charityAmount,
    transactionId: orderId,
    percent,
  };
}

// ── getCampaignProgress ────────────────────────────────────────────────────

/**
 * Returns all charity campaigns with their progress towards their goals.
 */
async function getCampaignProgress() {
  const snap = await db
    .collection("charityFunds")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    const totalAllocated = data.totalAllocated || 0;
    const goal = data.goal || null;
    const progressPercent = goal ? Math.min(100, (totalAllocated / goal) * 100) : null;

    return {
      id: doc.id,
      name: data.name || "Unnamed Campaign",
      description: data.description || null,
      status: data.status || "unknown",
      goal,
      totalAllocated,
      totalDisbursed: data.totalDisbursed || 0,
      transactionCount: data.transactionCount || 0,
      progressPercent,
      lastUpdated: data.updatedAt || data.createdAt || null,
      imageUrl: data.imageUrl || null,
      charityPartner: data.charityPartner || null,
    };
  });
}

// ── updateCampaignStatus ───────────────────────────────────────────────────

/**
 * Admin function: update a campaign's received/disbursed amounts and status.
 *
 * @param {string} campaignId
 * @param {number} amountReceived — amount actually received by charity partner
 * @param {object} [opts]
 * @param {"active"|"completed"|"paused"} [opts.status]
 * @param {string} [opts.proofUrl] — URL to receipt/proof document
 */
async function updateCampaignStatus(campaignId, amountReceived, opts = {}) {
  if (!campaignId) throw new Error("campaignId is required.");

  const campaignRef = db.collection("charityFunds").doc(campaignId);
  const snap = await campaignRef.get();

  if (!snap.exists) {
    throw new Error(`Campaign ${campaignId} not found.`);
  }

  const updates = {
    totalDisbursed: admin.firestore.FieldValue.increment(amountReceived || 0),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (opts.status) {
    updates.status = opts.status;
  }

  if (opts.proofUrl) {
    updates.proofUrl = opts.proofUrl;
    updates.lastDisbursementProofUrl = opts.proofUrl;
  }

  if (typeof amountReceived === "number" && amountReceived > 0) {
    updates.lastDisbursedAt = admin.firestore.FieldValue.serverTimestamp();
    updates.lastDisbursedAmount = amountReceived;
  }

  await campaignRef.update(updates);

  functions.logger.info("Campaign status updated", {
    campaignId,
    amountReceived,
    status: opts.status,
  });

  return { campaignId, amountReceived };
}

// ── getImpactReport ────────────────────────────────────────────────────────

/**
 * Generate a public transparency / impact report.
 *
 * Returns:
 *   {
 *     totalAllocatedAllTime,
 *     totalDisbursedAllTime,
 *     activeCampaigns,
 *     completedCampaigns,
 *     totalTransactions,
 *     campaigns: [...],
 *     generatedAt: ISO string
 *   }
 */
async function getImpactReport() {
  const allCampaigns = await getCampaignProgress();

  let totalAllocatedAllTime = 0;
  let totalDisbursedAllTime = 0;
  let totalTransactions = 0;
  let activeCampaigns = 0;
  let completedCampaigns = 0;

  for (const c of allCampaigns) {
    totalAllocatedAllTime += c.totalAllocated;
    totalDisbursedAllTime += c.totalDisbursed;
    totalTransactions += c.transactionCount;

    if (c.status === "active") activeCampaigns++;
    if (c.status === "completed") completedCampaigns++;
  }

  return {
    totalAllocatedAllTime: Math.round(totalAllocatedAllTime * 100) / 100,
    totalDisbursedAllTime: Math.round(totalDisbursedAllTime * 100) / 100,
    activeCampaigns,
    completedCampaigns,
    totalTransactions,
    campaigns: allCampaigns,
    generatedAt: new Date().toISOString(),
  };
}

// ── Firebase Callable Functions ────────────────────────────────────────────

const allocateToCharityFn = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can manually trigger charity allocation."
    );
  }

  const { orderId, orderTotal, campaignId } = data;

  if (!orderId || typeof orderTotal !== "number") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "orderId (string) and orderTotal (number) are required."
    );
  }

  try {
    return await allocateToCharity(orderId, orderTotal, campaignId);
  } catch (err) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});

const getCampaignProgressFn = functions.https.onCall(async (_data, _context) => {
  // Public — no auth required
  try {
    return await getCampaignProgress();
  } catch (err) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});

const updateCampaignStatusFn = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can update campaign status."
    );
  }

  const { campaignId, amountReceived, status, proofUrl } = data;

  if (!campaignId) {
    throw new functions.https.HttpsError("invalid-argument", "campaignId is required.");
  }

  try {
    return await updateCampaignStatus(campaignId, amountReceived, { status, proofUrl });
  } catch (err) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});

const getImpactReportFn = functions.https.onCall(async (_data, _context) => {
  // Public transparency — no auth required
  try {
    return await getImpactReport();
  } catch (err) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});

module.exports = {
  allocateToCharity,
  getCampaignProgress,
  updateCampaignStatus,
  getImpactReport,
  allocateToCharityFn,
  getCampaignProgressFn,
  updateCampaignStatusFn,
  getImpactReportFn,
};
