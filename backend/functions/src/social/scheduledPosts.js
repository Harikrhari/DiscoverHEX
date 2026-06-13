"use strict";

/**
 * Scheduled Firebase Functions for social media posts.
 *
 * Exports:
 *   dailyHighlightPost    — Every day at 10:00 UTC: post best-selling product
 *   weeklyCharityUpdate   — Every Monday at 09:00 UTC: post charity impact update
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
  postToInstagram,
  postToFacebook,
  postToYouTube,
  generateCaption,
} = require("./autoPost");

const db = admin.firestore();

const RUNTIME_OPTS = {
  secrets: [
    "META_PAGE_ACCESS_TOKEN",
    "YOUTUBE_CLIENT_SECRET",
    "YOUTUBE_REFRESH_TOKEN",
  ],
  timeoutSeconds: 120,
  memory: "256MB",
};

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Retrieve the best-selling active product over the last 30 days.
 */
async function getBestSellingProduct() {
  const snap = await db
    .collection("products")
    .where("isActive", "==", true)
    .orderBy("salesCount", "desc")
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Fetch the total charity raised this week from the active campaign.
 */
async function getWeeklyCharityStats() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get active campaign
  const campaignSnap = await db
    .collection("charityFunds")
    .where("status", "==", "active")
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (campaignSnap.empty) {
    return { totalRaised: 0, campaignName: "our charity partners", transactionCount: 0 };
  }

  const campaign = { id: campaignSnap.docs[0].id, ...campaignSnap.docs[0].data() };

  // Sum transactions from the past week
  const txSnap = await db
    .collection("charityFunds")
    .doc(campaign.id)
    .collection("transactions")
    .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(oneWeekAgo))
    .where("status", "==", "allocated")
    .get();

  const totalRaised = txSnap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

  return {
    totalRaised,
    campaignName: campaign.name || "our charity partners",
    transactionCount: txSnap.size,
    campaignId: campaign.id,
    campaignGoal: campaign.goal || null,
    campaignTotal: campaign.totalAllocated || 0,
  };
}

/**
 * Log a scheduled post result to Firestore.
 */
async function logScheduledPost({ type, caption, results, errors, metadata }) {
  await db.collection("socialPosts").add({
    type,
    caption,
    scheduled: true,
    platforms: results.map((r) => r.platform),
    platformPostIds: Object.fromEntries(results.map((r) => [r.platform, r.postId])),
    errors,
    status: results.length > 0 ? "published" : "failed",
    metadata: metadata || {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Attempt to post to all three platforms, collecting results and errors.
 */
async function broadcastPost({ caption, imageUrl, link }) {
  const results = [];
  const errors = [];

  const attempts = [
    {
      name: "instagram",
      fn: async () => {
        if (!imageUrl) throw new Error("No imageUrl for Instagram post.");
        return postToInstagram({ caption, imageUrl });
      },
    },
    {
      name: "facebook",
      fn: () => postToFacebook({ caption, imageUrl: imageUrl || null, link }),
    },
    {
      name: "youtube",
      fn: () => postToYouTube({ caption, imageUrl }),
    },
  ];

  for (const { name, fn } of attempts) {
    try {
      const result = await fn();
      results.push(result);
    } catch (err) {
      functions.logger.warn(`Scheduled post failed on ${name}`, { error: err.message });
      errors.push({ platform: name, error: err.message });
    }
  }

  return { results, errors };
}

// ── Daily Highlight Post ───────────────────────────────────────────────────

/**
 * Runs every day at 10:00 AM UTC.
 * Finds the best-selling product and posts it across all platforms.
 */
exports.dailyHighlightPost = functions
  .runWith(RUNTIME_OPTS)
  .pubsub.schedule("0 10 * * *")
  .timeZone("UTC")
  .onRun(async (context) => {
    functions.logger.info("Daily highlight post job started");

    let product;

    try {
      product = await getBestSellingProduct();
    } catch (err) {
      functions.logger.error("Failed to fetch best-selling product", { error: err.message });
      return;
    }

    if (!product) {
      functions.logger.warn("No active products found for daily highlight post.");
      return;
    }

    const caption = generateCaption(product, "highlight");
    const imageUrl = product.primaryImageUrl || product.imageUrl || null;
    const link = `${process.env.APP_URL || "https://discoverhex.com"}/products/${product.id}`;

    const { results, errors } = await broadcastPost({ caption, imageUrl, link });

    await logScheduledPost({
      type: "daily_highlight",
      caption,
      results,
      errors,
      metadata: {
        productId: product.id,
        productTitle: product.title,
        salesCount: product.salesCount || 0,
      },
    });

    functions.logger.info("Daily highlight post complete", {
      productId: product.id,
      postedTo: results.map((r) => r.platform),
      errors,
    });
  });

// ── Weekly Charity Update ──────────────────────────────────────────────────

/**
 * Runs every Monday at 09:00 AM UTC.
 * Fetches the weekly charity stats and posts an impact update.
 */
exports.weeklyCharityUpdate = functions
  .runWith(RUNTIME_OPTS)
  .pubsub.schedule("0 9 * * 1")
  .timeZone("UTC")
  .onRun(async (context) => {
    functions.logger.info("Weekly charity update post job started");

    let stats;

    try {
      stats = await getWeeklyCharityStats();
    } catch (err) {
      functions.logger.error("Failed to fetch weekly charity stats", { error: err.message });
      return;
    }

    if (stats.transactionCount === 0) {
      functions.logger.info("No charity transactions this week, skipping post.");
      return;
    }

    const caption = generateCaption({}, "charity", {
      totalRaised: stats.totalRaised,
      campaignName: stats.campaignName,
    });

    const appUrl = process.env.APP_URL || "https://discoverhex.com";
    const link = `${appUrl}/impact`;

    const { results, errors } = await broadcastPost({ caption, imageUrl: null, link });

    await logScheduledPost({
      type: "weekly_charity_update",
      caption,
      results,
      errors,
      metadata: {
        campaignId: stats.campaignId,
        campaignName: stats.campaignName,
        totalRaisedThisWeek: stats.totalRaised,
        transactionCount: stats.transactionCount,
        campaignTotal: stats.campaignTotal,
      },
    });

    // Also update the campaign doc with last social post date
    if (stats.campaignId) {
      await db.collection("charityFunds").doc(stats.campaignId).update({
        lastSocialPostAt: admin.firestore.FieldValue.serverTimestamp(),
        lastWeeklyRaised: stats.totalRaised,
      });
    }

    functions.logger.info("Weekly charity update post complete", {
      totalRaised: stats.totalRaised,
      postedTo: results.map((r) => r.platform),
      errors,
    });
  });
