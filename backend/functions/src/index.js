"use strict";

/**
 * DiscoverHEX — Firebase Cloud Functions Entry Point
 *
 * All functions are lazy-loaded using dynamic requires so cold starts are
 * minimized: only the code needed for the invoked function is loaded.
 *
 * Exports:
 *
 *   Checkout
 *     createPaymentIntent   HTTPS Callable
 *     stripeWebhook         HTTPS Request (Stripe webhook endpoint)
 *
 *   Tax
 *     calculateTax          HTTPS Callable
 *
 *   Social Media
 *     postNewProductFn      HTTPS Callable (admin)
 *     postOrderMilestoneFn  HTTPS Callable (admin)
 *     onProductCreated      Firestore Trigger
 *     dailyHighlightPost    Scheduled (daily 10:00 UTC)
 *     weeklyCharityUpdate   Scheduled (Monday 09:00 UTC)
 *
 *   Charity
 *     allocateToCharityFn   HTTPS Callable (admin)
 *     getCampaignProgressFn HTTPS Callable (public)
 *     updateCampaignStatusFn HTTPS Callable (admin)
 *     getImpactReportFn     HTTPS Callable (public)
 *
 *   Sponsors
 *     trackSponsorImpression HTTPS Callable
 *     trackSponsorSale       HTTPS Callable
 *     calculateSponsorROI    HTTPS Callable
 *     getSponsorDashboard    HTTPS Callable
 *
 *   Creators
 *     trackCreatorSale       HTTPS Callable
 *     getCreatorDashboard    HTTPS Callable
 *     processCreatorPayout   HTTPS Callable
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK once (singleton)
if (!admin.apps.length) {
  admin.initializeApp();
}

// ── Checkout ───────────────────────────────────────────────────────────────

Object.assign(exports, require("./checkout/createPaymentIntent"));
Object.assign(exports, require("./checkout/handleStripeWebhook"));

// ── Tax ────────────────────────────────────────────────────────────────────

const tax = require("./tax/calculateTax");
exports.calculateTax = tax.calculateTax;

// ── Social Media ───────────────────────────────────────────────────────────

const social = require("./social/autoPost");
exports.postNewProductFn = social.postNewProductFn;
exports.postOrderMilestoneFn = social.postOrderMilestoneFn;
exports.onProductCreated = social.onProductCreated;

const scheduled = require("./social/scheduledPosts");
exports.dailyHighlightPost = scheduled.dailyHighlightPost;
exports.weeklyCharityUpdate = scheduled.weeklyCharityUpdate;

// ── Charity ────────────────────────────────────────────────────────────────

const charity = require("./charity/charityManager");
exports.allocateToCharity = charity.allocateToCharityFn;
exports.getCampaignProgress = charity.getCampaignProgressFn;
exports.updateCampaignStatus = charity.updateCampaignStatusFn;
exports.getImpactReport = charity.getImpactReportFn;

// ── Sponsors ───────────────────────────────────────────────────────────────

const sponsors = require("./sponsors/sponsorManager");
exports.trackSponsorImpression = sponsors.trackSponsorImpression;
exports.trackSponsorSale = sponsors.trackSponsorSale;
exports.calculateSponsorROI = sponsors.calculateSponsorROI;
exports.getSponsorDashboard = sponsors.getSponsorDashboard;

// ── Creators ───────────────────────────────────────────────────────────────

const creators = require("./creators/creatorManager");
exports.trackCreatorSale = creators.trackCreatorSale;
exports.getCreatorDashboard = creators.getCreatorDashboard;
exports.processCreatorPayout = creators.processCreatorPayout;
