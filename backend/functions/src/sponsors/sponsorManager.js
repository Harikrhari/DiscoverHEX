"use strict";

/**
 * Sponsor Management
 *
 * Firestore structure:
 *   sponsors/{sponsorId}                      — sponsor document
 *   sponsors/{sponsorId}/impressions/{impId}  — per-view impression logs
 *   sponsors/{sponsorId}/analytics/{date}     — daily aggregated analytics
 *
 * Exports (all HTTPS callables):
 *   trackSponsorImpression  — log a product page view attributed to sponsor
 *   trackSponsorSale        — log a sale attributed to sponsor
 *   calculateSponsorROI     — compute ROI metrics for a date range
 *   getSponsorDashboard     — full analytics dashboard for a sponsor
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

// ── Helpers ────────────────────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function dateKey(date) {
  return date instanceof Date
    ? date.toISOString().slice(0, 10)
    : new Date(date).toISOString().slice(0, 10);
}

async function assertSponsorExists(sponsorId) {
  const snap = await db.collection("sponsors").doc(sponsorId).get();
  if (!snap.exists) {
    throw new functions.https.HttpsError("not-found", `Sponsor ${sponsorId} not found.`);
  }
  return snap;
}

// ── trackSponsorImpression ─────────────────────────────────────────────────

/**
 * Log an impression (product page view) attributed to a sponsor.
 *
 * Input: { sponsorId, productId, userId? }
 */
exports.trackSponsorImpression = functions.https.onCall(async (data, context) => {
  const { sponsorId, productId, userId } = data;

  if (!sponsorId || !productId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "sponsorId and productId are required."
    );
  }

  await assertSponsorExists(sponsorId);

  const day = todayKey();
  const sponsorRef = db.collection("sponsors").doc(sponsorId);
  const dailyRef = sponsorRef.collection("analytics").doc(day);

  const batch = db.batch();

  // Log individual impression
  const impressionRef = sponsorRef.collection("impressions").doc();
  batch.set(impressionRef, {
    sponsorId,
    productId,
    userId: userId || context.auth?.uid || null,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    date: day,
  });

  // Increment daily aggregates
  batch.set(
    dailyRef,
    {
      sponsorId,
      date: day,
      impressions: admin.firestore.FieldValue.increment(1),
      [`productImpressions.${productId}`]: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Increment sponsor-level lifetime counter
  batch.update(sponsorRef, {
    totalImpressions: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  functions.logger.debug("Sponsor impression tracked", { sponsorId, productId });

  return { success: true };
});

// ── trackSponsorSale ───────────────────────────────────────────────────────

/**
 * Record a sale attributed to a sponsor.
 *
 * Input: { sponsorId, orderId, amount, productId? }
 */
exports.trackSponsorSale = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
  }

  const { sponsorId, orderId, amount, productId } = data;

  if (!sponsorId || !orderId || typeof amount !== "number" || amount <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "sponsorId, orderId, and a positive amount are required."
    );
  }

  await assertSponsorExists(sponsorId);

  const day = todayKey();
  const sponsorRef = db.collection("sponsors").doc(sponsorId);
  const dailyRef = sponsorRef.collection("analytics").doc(day);
  const saleRef = sponsorRef.collection("analytics").doc(`sale_${orderId}`);

  // Idempotency: don't double-count the same order
  const existing = await saleRef.get();
  if (existing.exists) {
    functions.logger.info("Sponsor sale already tracked, skipping", { sponsorId, orderId });
    return { success: true, duplicate: true };
  }

  const batch = db.batch();

  batch.set(saleRef, {
    type: "sale",
    sponsorId,
    orderId,
    amount,
    productId: productId || null,
    userId: context.auth.uid,
    date: day,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.set(
    dailyRef,
    {
      sponsorId,
      date: day,
      sales: admin.firestore.FieldValue.increment(1),
      revenue: admin.firestore.FieldValue.increment(amount),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  batch.update(sponsorRef, {
    totalSales: admin.firestore.FieldValue.increment(1),
    totalRevenue: admin.firestore.FieldValue.increment(amount),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  functions.logger.info("Sponsor sale tracked", { sponsorId, orderId, amount });

  return { success: true };
});

// ── calculateSponsorROI ────────────────────────────────────────────────────

/**
 * Calculate ROI metrics for a sponsor over a date range.
 *
 * Input: { sponsorId, startDate: "YYYY-MM-DD", endDate: "YYYY-MM-DD" }
 * Returns: { impressions, sales, revenue, spend, roi, conversionRate, cpm, cps }
 */
exports.calculateSponsorROI = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
  }

  const { sponsorId, startDate, endDate } = data;

  if (!sponsorId || !startDate || !endDate) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "sponsorId, startDate, and endDate are required."
    );
  }

  // Admins can see any sponsor; sponsors can only see themselves
  const sponsorSnap = await assertSponsorExists(sponsorId);
  const sponsorData = sponsorSnap.data();

  if (!context.auth.token.admin && context.auth.uid !== sponsorId) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You can only view your own sponsor analytics."
    );
  }

  // Fetch daily analytics docs within the range
  const analyticsSnap = await db
    .collection("sponsors")
    .doc(sponsorId)
    .collection("analytics")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .get();

  let totalImpressions = 0;
  let totalSales = 0;
  let totalRevenue = 0;

  analyticsSnap.docs.forEach((doc) => {
    const d = doc.data();
    // Exclude sale_* documents
    if (doc.id.startsWith("sale_")) return;
    totalImpressions += d.impressions || 0;
    totalSales += d.sales || 0;
    totalRevenue += d.revenue || 0;
  });

  const spend = sponsorData.monthlySpend || sponsorData.spend || 0;
  const roi = spend > 0 ? ((totalRevenue - spend) / spend) * 100 : null;
  const conversionRate = totalImpressions > 0 ? (totalSales / totalImpressions) * 100 : 0;
  const cpm = totalImpressions > 0 ? (spend / totalImpressions) * 1000 : null; // cost per 1000 impressions
  const cps = totalSales > 0 ? spend / totalSales : null; // cost per sale

  return {
    sponsorId,
    dateRange: { startDate, endDate },
    impressions: totalImpressions,
    sales: totalSales,
    revenue: Math.round(totalRevenue * 100) / 100,
    spend,
    roi: roi !== null ? Math.round(roi * 100) / 100 : null,
    conversionRate: Math.round(conversionRate * 10000) / 10000,
    cpm: cpm !== null ? Math.round(cpm * 100) / 100 : null,
    cps: cps !== null ? Math.round(cps * 100) / 100 : null,
    generatedAt: new Date().toISOString(),
  };
});

// ── getSponsorDashboard ────────────────────────────────────────────────────

/**
 * Full analytics dashboard for a sponsor.
 *
 * Input: { sponsorId }
 * Returns: lifetime stats + last 30 days breakdown + top products
 */
exports.getSponsorDashboard = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be signed in.");
  }

  const { sponsorId } = data;

  if (!sponsorId) {
    throw new functions.https.HttpsError("invalid-argument", "sponsorId is required.");
  }

  if (!context.auth.token.admin && context.auth.uid !== sponsorId) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You can only view your own dashboard."
    );
  }

  const sponsorSnap = await assertSponsorExists(sponsorId);
  const sponsorData = sponsorSnap.data();

  // Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = dateKey(thirtyDaysAgo);
  const endDate = todayKey();

  const analyticsSnap = await db
    .collection("sponsors")
    .doc(sponsorId)
    .collection("analytics")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "asc")
    .get();

  const dailyBreakdown = [];
  const productImpressionsMap = {};
  let period30Impressions = 0;
  let period30Sales = 0;
  let period30Revenue = 0;

  analyticsSnap.docs.forEach((doc) => {
    if (doc.id.startsWith("sale_")) return;

    const d = doc.data();
    dailyBreakdown.push({
      date: d.date,
      impressions: d.impressions || 0,
      sales: d.sales || 0,
      revenue: d.revenue || 0,
    });

    period30Impressions += d.impressions || 0;
    period30Sales += d.sales || 0;
    period30Revenue += d.revenue || 0;

    // Aggregate product impressions
    if (d.productImpressions) {
      for (const [productId, count] of Object.entries(d.productImpressions)) {
        productImpressionsMap[productId] = (productImpressionsMap[productId] || 0) + count;
      }
    }
  });

  // Top 5 products by impressions
  const topProducts = Object.entries(productImpressionsMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId, impressions]) => ({ productId, impressions }));

  const spend = sponsorData.monthlySpend || sponsorData.spend || 0;
  const roi30 = spend > 0 ? ((period30Revenue - spend) / spend) * 100 : null;

  return {
    sponsorId,
    sponsorName: sponsorData.name || sponsorId,
    tier: sponsorData.tier || "standard",
    status: sponsorData.status || "active",
    lifetime: {
      impressions: sponsorData.totalImpressions || 0,
      sales: sponsorData.totalSales || 0,
      revenue: Math.round((sponsorData.totalRevenue || 0) * 100) / 100,
    },
    last30Days: {
      impressions: period30Impressions,
      sales: period30Sales,
      revenue: Math.round(period30Revenue * 100) / 100,
      roi: roi30 !== null ? Math.round(roi30 * 100) / 100 : null,
      conversionRate:
        period30Impressions > 0
          ? Math.round((period30Sales / period30Impressions) * 10000) / 100
          : 0,
    },
    dailyBreakdown,
    topProducts,
    generatedAt: new Date().toISOString(),
  };
});
