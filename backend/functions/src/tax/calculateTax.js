"use strict";

/**
 * Tax calculation via TaxJar API
 *
 * Exports:
 *   calculateTax          — HTTPS callable Firebase Function
 *   calculateTaxForOrder  — internal helper (used by createPaymentIntent)
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");

const db = admin.firestore();

const TAXJAR_API_BASE = "https://api.taxjar.com/v2";
const CACHE_TTL_HOURS = 24;

// ── Internal helper ────────────────────────────────────────────────────────

/**
 * Build a deterministic cache key from address pair + item codes.
 */
function buildCacheKey(fromAddress, toAddress, lineItems) {
  const payload = JSON.stringify({
    from: `${fromAddress.zip}-${fromAddress.state}`,
    to: `${toAddress.zip}-${toAddress.state}`,
    codes: lineItems.map((i) => `${i.taxCode}:${i.lineTotal}`).sort(),
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * Check Firestore cache for a previously computed tax result.
 */
async function getCachedTax(cacheKey) {
  const doc = await db.collection("taxCache").doc(cacheKey).get();

  if (!doc.exists) return null;

  const data = doc.data();
  const ageMs = Date.now() - data.cachedAt.toMillis();
  const maxAgeMs = CACHE_TTL_HOURS * 60 * 60 * 1000;

  if (ageMs > maxAgeMs) {
    // Stale — delete and return null
    await doc.ref.delete().catch(() => {});
    return null;
  }

  return data.result;
}

/**
 * Persist a tax result to Firestore.
 */
async function cacheTaxResult(cacheKey, result) {
  await db.collection("taxCache").doc(cacheKey).set({
    result,
    cachedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Call the TaxJar /taxes endpoint and return a normalized result.
 *
 * @param {object} params
 * @param {Array}  params.lineItems  — validated cart items with taxCode, lineTotal, quantity
 * @param {object} params.fromAddress — { line1, city, state, zip, country }
 * @param {object} params.toAddress   — { line1?, city, state, zip, country }
 * @returns {{ totalTax: number, taxableAmount: number, rate: number, breakdown: object }}
 */
async function calculateTaxForOrder({ lineItems, fromAddress, toAddress }) {
  const apiKey = process.env.TAXJAR_API_KEY;

  if (!apiKey) {
    throw new Error("TAXJAR_API_KEY is not configured.");
  }

  const cacheKey = buildCacheKey(fromAddress, toAddress, lineItems);
  const cached = await getCachedTax(cacheKey);

  if (cached) {
    functions.logger.debug("Tax result served from cache", { cacheKey });
    return cached;
  }

  // Build TaxJar line_items array
  const taxjarLineItems = lineItems.map((item, idx) => ({
    id: String(idx),
    quantity: item.quantity,
    unit_price: item.unitPrice,
    product_tax_code: item.taxCode || "P0000000",
  }));

  const requestBody = {
    from_country: fromAddress.country || "US",
    from_zip: fromAddress.zip,
    from_state: fromAddress.state,
    from_city: fromAddress.city || "",
    from_street: fromAddress.line1 || "",
    to_country: toAddress.country || "US",
    to_zip: toAddress.zip,
    to_state: toAddress.state,
    to_city: toAddress.city || "",
    to_street: toAddress.line1 || "",
    amount: lineItems.reduce((sum, i) => sum + i.lineTotal, 0),
    shipping: 0, // Shipping tax handled separately if needed
    line_items: taxjarLineItems,
  };

  let response;

  try {
    response = await axios.post(`${TAXJAR_API_BASE}/taxes`, requestBody, {
      headers: {
        Authorization: `Token token="${apiKey}"`,
        "Content-Type": "application/json",
      },
      timeout: 8000,
    });
  } catch (err) {
    if (err.response) {
      throw new Error(
        `TaxJar API error ${err.response.status}: ${JSON.stringify(err.response.data)}`
      );
    }
    throw new Error(`TaxJar request failed: ${err.message}`);
  }

  const tax = response.data.tax;

  const result = {
    totalTax: tax.amount_to_collect || 0,
    taxableAmount: tax.taxable_amount || 0,
    rate: tax.rate || 0,
    hasNexus: tax.has_nexus || false,
    freightTaxable: tax.freight_taxable || false,
    breakdown: {
      stateTax: tax.breakdown?.state_tax_collectable || 0,
      countyTax: tax.breakdown?.county_tax_collectable || 0,
      cityTax: tax.breakdown?.city_tax_collectable || 0,
      specialTax: tax.breakdown?.special_district_tax_collectable || 0,
      stateTaxRate: tax.breakdown?.state_tax_rate || 0,
      countyTaxRate: tax.breakdown?.county_tax_rate || 0,
      cityTaxRate: tax.breakdown?.city_tax_rate || 0,
      lineItems: (tax.breakdown?.line_items || []).map((li) => ({
        id: li.id,
        taxableAmount: li.taxable_amount || 0,
        taxCollectable: li.tax_collectable || 0,
        combinedTaxRate: li.combined_tax_rate || 0,
        stateTaxRate: li.state_tax_rate || 0,
        countyTaxRate: li.county_tax_rate || 0,
        cityTaxRate: li.city_tax_rate || 0,
      })),
    },
  };

  // Cache the result
  try {
    await cacheTaxResult(cacheKey, result);
  } catch (err) {
    functions.logger.warn("Failed to cache tax result", { error: err.message });
  }

  return result;
}

// ── Firebase Callable Function ─────────────────────────────────────────────

/**
 * HTTPS Callable: calculateTax
 *
 * Input:
 *   {
 *     line_items: [{ productId, quantity, unitPrice, taxCode? }],
 *     from_address: { line1?, city, state, zip, country? },
 *     to_address: { line1?, city, state, zip, country? }
 *   }
 *
 * Returns the full tax breakdown.
 */
const calculateTax = functions
  .runWith({ secrets: ["TAXJAR_API_KEY"] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Must be authenticated to calculate tax."
      );
    }

    const { line_items, from_address, to_address } = data;

    if (!Array.isArray(line_items) || line_items.length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "line_items must be a non-empty array."
      );
    }

    if (!to_address || !to_address.zip || !to_address.state) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "to_address must include state and zip."
      );
    }

    const fromAddress = from_address || {
      city: process.env.STORE_ADDRESS_CITY || "Austin",
      state: process.env.STORE_ADDRESS_STATE || "TX",
      zip: process.env.STORE_ADDRESS_ZIP || "78701",
      country: process.env.STORE_ADDRESS_COUNTRY || "US",
    };

    // Map caller's line_items to our internal shape
    const mappedItems = line_items.map((item) => ({
      productId: item.productId || "unknown",
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || item.unit_price || 0,
      lineTotal: (item.unitPrice || item.unit_price || 0) * (item.quantity || 1),
      taxCode: item.taxCode || item.product_tax_code || "P0000000",
    }));

    try {
      const result = await calculateTaxForOrder({
        lineItems: mappedItems,
        fromAddress,
        toAddress: to_address,
      });

      return result;
    } catch (err) {
      functions.logger.error("Tax calculation failed", {
        uid: context.auth.uid,
        error: err.message,
      });

      throw new functions.https.HttpsError(
        "internal",
        "Tax calculation failed. Please try again."
      );
    }
  });

module.exports = { calculateTax, calculateTaxForOrder };
