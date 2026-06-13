import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Singleton Stripe instance
let stripePromise = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
    );
  }
  return stripePromise;
}

/**
 * Create a PaymentIntent via the backend.
 * @param {number} amount - Amount in cents
 * @param {string} currency - e.g. 'usd'
 * @param {Object} metadata - Extra metadata (order_id, user_id, etc.)
 * @returns {Promise<{ clientSecret: string, paymentIntentId: string }>}
 */
export async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
  try {
    const response = await axios.post(`${API_BASE}/payments/create-intent`, {
      amount: Math.round(amount * 100), // convert dollars to cents
      currency,
      metadata: {
        app: 'discoverhex',
        ...metadata,
      },
    });

    return {
      clientSecret: response.data.client_secret,
      paymentIntentId: response.data.payment_intent_id,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create payment intent'
    );
  }
}

/**
 * Confirm a PaymentIntent (server-side confirmation).
 * @param {string} paymentIntentId
 * @returns {Promise<Object>}
 */
export async function confirmPayment(paymentIntentId) {
  try {
    const response = await axios.post(`${API_BASE}/payments/confirm`, {
      payment_intent_id: paymentIntentId,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to confirm payment'
    );
  }
}

/**
 * Create a Stripe checkout session for simple redirects.
 * @param {Array} lineItems
 * @param {string} successUrl
 * @param {string} cancelUrl
 * @returns {Promise<{ sessionId: string, url: string }>}
 */
export async function createCheckoutSession(lineItems, successUrl, cancelUrl) {
  try {
    const response = await axios.post(`${API_BASE}/payments/checkout-session`, {
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode: 'payment',
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create checkout session'
    );
  }
}

/**
 * Retrieve payment status.
 * @param {string} paymentIntentId
 * @returns {Promise<Object>}
 */
export async function getPaymentStatus(paymentIntentId) {
  try {
    const response = await axios.get(
      `${API_BASE}/payments/status/${paymentIntentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to retrieve payment status'
    );
  }
}
