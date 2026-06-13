"use strict";

/**
 * Social Media Auto-Posting
 *
 * Exports:
 *   postNewProduct       — HTTPS callable: post when a new product is added
 *   postOrderMilestone   — HTTPS callable: post when a sales milestone is hit
 *   onProductCreated     — Firestore trigger: auto-post on new product doc
 *
 * Platforms: Instagram, Facebook (via Meta Graph API), YouTube (Community Posts)
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

const db = admin.firestore();

// ── Caption generators ────────────────────────────────────────────────────

/**
 * Generate platform-specific captions with hashtags.
 *
 * @param {object} product  — Firestore product document
 * @param {"new_product"|"milestone"|"charity"|"highlight"} type
 * @param {object} [extra]  — Additional context (e.g. milestone count)
 */
function generateCaption(product, type, extra = {}) {
  const productName = product.title || "our latest product";
  const price = product.price ? `$${product.price.toFixed(2)}` : "";
  const category = product.category || "fashion";
  const appUrl = process.env.APP_URL || "https://discoverhex.com";

  const baseHashtags = [
    "#DiscoverHEX",
    "#ShopNow",
    `#${category.replace(/\s+/g, "")}`,
    "#SustainableFashion",
    "#GiveBack",
    "#CharityFirst",
  ];

  switch (type) {
    case "new_product": {
      const caption = [
        `✨ NEW DROP: ${productName} ${price}`,
        "",
        product.description
          ? product.description.slice(0, 150) + (product.description.length > 150 ? "…" : "")
          : "Drop everything — this one's special.",
        "",
        `🌱 Every purchase donates ${product.charityPercent || 5}% to a cause that matters.`,
        "",
        `Shop now → ${appUrl}/products/${product.id || ""}`,
        "",
        [...baseHashtags, "#NewArrivals", "#MustHave"].join(" "),
      ].join("\n");
      return caption;
    }

    case "milestone": {
      const count = extra.count || 100;
      const caption = [
        `🎉 WOW — ${count} orders and counting! Thank you for believing in DiscoverHEX.`,
        "",
        "Together we're proving that great style and doing good aren't mutually exclusive.",
        "",
        `Every order so far has contributed to our charity fund. Let's keep growing! 💚`,
        "",
        `${appUrl}`,
        "",
        [...baseHashtags, "#Milestone", "#Community", "#ThankYou"].join(" "),
      ].join("\n");
      return caption;
    }

    case "charity": {
      const raised = extra.totalRaised || 0;
      const caption = [
        `💚 Weekly Charity Update`,
        "",
        `This week DiscoverHEX raised $${raised.toFixed(2)} for ${extra.campaignName || "our charity partners"}.`,
        "",
        "Each purchase you make goes further than your wardrobe.",
        "",
        `See our full impact report → ${appUrl}/impact`,
        "",
        [...baseHashtags, "#CharityUpdate", "#Impact", "#Transparency"].join(" "),
      ].join("\n");
      return caption;
    }

    case "highlight": {
      const caption = [
        `🔥 Today's Pick: ${productName} ${price}`,
        "",
        product.description
          ? product.description.slice(0, 120) + "…"
          : "Our community can't stop talking about this one.",
        "",
        `🌱 ${product.charityPercent || 5}% of every sale supports a great cause.`,
        "",
        `→ ${appUrl}/products/${product.id || ""}`,
        "",
        [...baseHashtags, "#DailyDrop", "#Featured"].join(" "),
      ].join("\n");
      return caption;
    }

    default:
      return `Check out DiscoverHEX! ${appUrl}\n${baseHashtags.join(" ")}`;
  }
}

// ── Meta Graph API helpers ────────────────────────────────────────────────

/**
 * Post a photo to Instagram via the Content Publishing API.
 *
 * Flow:
 *   1. Create a container (media object)
 *   2. Publish the container
 */
async function postToInstagram({ caption, imageUrl }) {
  const accountId = process.env.META_INSTAGRAM_ACCOUNT_ID || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

  if (!accountId || !accessToken) {
    throw new Error("Missing META_INSTAGRAM_ACCOUNT_ID or META_PAGE_ACCESS_TOKEN.");
  }

  const base = `https://graph.facebook.com/v19.0/${accountId}`;

  // Step 1: create media container
  const containerRes = await axios.post(`${base}/media`, null, {
    params: {
      image_url: imageUrl,
      caption,
      access_token: accessToken,
    },
    timeout: 15000,
  });

  const creationId = containerRes.data.id;

  if (!creationId) {
    throw new Error("Instagram container creation returned no ID.");
  }

  // Short wait for the container to finish processing
  await new Promise((r) => setTimeout(r, 3000));

  // Step 2: publish
  const publishRes = await axios.post(`${base}/media_publish`, null, {
    params: {
      creation_id: creationId,
      access_token: accessToken,
    },
    timeout: 15000,
  });

  return { platform: "instagram", postId: publishRes.data.id };
}

/**
 * Post a photo + caption to a Facebook Page.
 */
async function postToFacebook({ caption, imageUrl, link }) {
  const pageId = process.env.META_FACEBOOK_PAGE_ID || process.env.META_PAGE_ID;
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    throw new Error("Missing META_FACEBOOK_PAGE_ID or META_PAGE_ACCESS_TOKEN.");
  }

  const base = `https://graph.facebook.com/v19.0/${pageId}`;

  let endpoint, params;

  if (imageUrl) {
    endpoint = `${base}/photos`;
    params = { caption, url: imageUrl, access_token: accessToken };
  } else {
    endpoint = `${base}/feed`;
    params = { message: caption, link: link || "", access_token: accessToken };
  }

  const res = await axios.post(endpoint, null, {
    params,
    timeout: 15000,
  });

  return { platform: "facebook", postId: res.data.id };
}

/**
 * Post a YouTube Community Post (text + optional image).
 * Requires an OAuth2 access token obtained via the YouTube Data API v3.
 */
async function postToYouTube({ caption, imageUrl }) {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;

  if (!channelId || !refreshToken || !clientId || !clientSecret) {
    throw new Error("Missing YouTube OAuth credentials.");
  }

  // Refresh the access token
  const tokenRes = await axios.post("https://oauth2.googleapis.com/token", null, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    },
    timeout: 10000,
  });

  const accessToken = tokenRes.data.access_token;

  // Build community post body
  const body = {
    snippet: {
      type: "textOriginal",
      textOriginal: {
        text: caption,
      },
    },
  };

  const res = await axios.post(
    "https://www.googleapis.com/youtube/v3/communityPosts",
    body,
    {
      params: { part: "snippet" },
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 15000,
    }
  );

  return { platform: "youtube", postId: res.data.id };
}

// ── Core posting logic ─────────────────────────────────────────────────────

/**
 * Post a new product to all enabled platforms.
 * Logs results to Firestore socialPosts collection.
 */
async function postNewProduct(product) {
  const caption = generateCaption(product, "new_product");
  const imageUrl = product.imageUrl || product.primaryImageUrl || null;
  const results = [];
  const errors = [];

  const platforms = [
    {
      name: "instagram",
      fn: () => imageUrl
        ? postToInstagram({ caption, imageUrl })
        : Promise.reject(new Error("Instagram requires an imageUrl")),
    },
    {
      name: "facebook",
      fn: () => postToFacebook({ caption, imageUrl, link: `${process.env.APP_URL}/products/${product.id}` }),
    },
    {
      name: "youtube",
      fn: () => postToYouTube({ caption, imageUrl }),
    },
  ];

  for (const platform of platforms) {
    try {
      const result = await platform.fn();
      results.push(result);
    } catch (err) {
      functions.logger.warn(`Failed to post to ${platform.name}`, {
        productId: product.id,
        error: err.message,
      });
      errors.push({ platform: platform.name, error: err.message });
    }
  }

  // Record in Firestore
  await db.collection("socialPosts").add({
    type: "new_product",
    productId: product.id,
    caption,
    imageUrl: imageUrl || null,
    platforms: results.map((r) => r.platform),
    platformPostIds: Object.fromEntries(results.map((r) => [r.platform, r.postId])),
    errors,
    status: errors.length < platforms.length ? "published" : "failed",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info("Product social post complete", {
    productId: product.id,
    results,
    errors,
  });

  return { results, errors };
}

/**
 * Post a sales milestone announcement.
 */
async function postOrderMilestone(milestone) {
  const caption = generateCaption({}, "milestone", { count: milestone });
  const results = [];
  const errors = [];

  const fns = [
    { name: "instagram", fn: () => postToInstagram({ caption, imageUrl: null }).catch(() => postToFacebook({ caption })) },
    { name: "facebook", fn: () => postToFacebook({ caption }) },
  ];

  for (const { name, fn } of fns) {
    try {
      results.push(await fn());
    } catch (err) {
      errors.push({ platform: name, error: err.message });
    }
  }

  await db.collection("socialPosts").add({
    type: "order_milestone",
    milestone,
    caption,
    platforms: results.map((r) => r.platform),
    platformPostIds: Object.fromEntries(results.map((r) => [r.platform, r.postId])),
    errors,
    status: results.length > 0 ? "published" : "failed",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { results, errors };
}

// ── Firebase Callable Functions ────────────────────────────────────────────

const postNewProductFn = functions
  .runWith({
    secrets: [
      "META_PAGE_ACCESS_TOKEN",
      "YOUTUBE_CLIENT_SECRET",
      "YOUTUBE_REFRESH_TOKEN",
    ],
  })
  .https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can trigger social posts."
      );
    }

    const { productId } = data;

    if (!productId) {
      throw new functions.https.HttpsError("invalid-argument", "productId is required.");
    }

    const productSnap = await db.collection("products").doc(productId).get();

    if (!productSnap.exists) {
      throw new functions.https.HttpsError("not-found", `Product ${productId} not found.`);
    }

    const product = { id: productId, ...productSnap.data() };

    return postNewProduct(product);
  });

const postOrderMilestoneFn = functions
  .runWith({
    secrets: [
      "META_PAGE_ACCESS_TOKEN",
      "YOUTUBE_CLIENT_SECRET",
      "YOUTUBE_REFRESH_TOKEN",
    ],
  })
  .https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can trigger milestone posts."
      );
    }

    const { milestone } = data;

    if (typeof milestone !== "number" || milestone <= 0) {
      throw new functions.https.HttpsError("invalid-argument", "milestone must be a positive number.");
    }

    return postOrderMilestone(milestone);
  });

// ── Firestore Trigger: auto-post when a new product is created ─────────────

const onProductCreated = functions
  .runWith({
    secrets: [
      "META_PAGE_ACCESS_TOKEN",
      "YOUTUBE_CLIENT_SECRET",
      "YOUTUBE_REFRESH_TOKEN",
    ],
  })
  .firestore.document("products/{productId}")
  .onCreate(async (snap, context) => {
    const product = { id: context.params.productId, ...snap.data() };

    // Only auto-post if the product is marked for auto-posting
    if (!product.autoPost) {
      functions.logger.debug("Product not flagged for auto-post, skipping", {
        productId: product.id,
      });
      return;
    }

    try {
      await postNewProduct(product);
    } catch (err) {
      functions.logger.error("onProductCreated auto-post failed", {
        productId: product.id,
        error: err.message,
      });
    }
  });

module.exports = {
  postNewProduct,
  postOrderMilestone,
  generateCaption,
  postToInstagram,
  postToFacebook,
  postToYouTube,
  postNewProductFn,
  postOrderMilestoneFn,
  onProductCreated,
};
