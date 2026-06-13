import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Calculate tax for an order via backend proxy to TaxJar.
 * @param {Object} order
 * @param {Array}  order.items           - [{ product_id, quantity, unit_price, product_tax_code }]
 * @param {Object} order.shipping_address - { street, city, state, zip, country }
 * @param {number} order.shipping         - Shipping amount in dollars
 * @returns {Promise<Object>} Tax breakdown
 */
export async function calculateTax(order) {
  try {
    const payload = {
      from_country: 'US',
      from_zip: '90210',
      from_state: 'CA',
      from_city: 'Beverly Hills',
      from_street: '123 HEX St',
      to_country: order.shipping_address.country || 'US',
      to_zip: order.shipping_address.zip,
      to_state: order.shipping_address.state,
      to_city: order.shipping_address.city,
      to_street: order.shipping_address.street,
      amount: order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
      shipping: order.shipping || 0,
      line_items: order.items.map((item) => ({
        id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        product_tax_code: item.product_tax_code || 'A_GEN_NOTAX',
        description: item.name || '',
      })),
    };

    const response = await axios.post(`${API_BASE}/tax/calculate`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TAXJAR_API_KEY}`,
      },
    });

    return {
      taxAmount: response.data.tax?.amount_to_collect || 0,
      rate: response.data.tax?.rate || 0,
      breakdown: response.data.tax?.breakdown || null,
      jurisdiction: response.data.tax?.jurisdictions || null,
      hasNexus: response.data.tax?.has_nexus || false,
      lineItems: response.data.tax?.breakdown?.line_items || [],
    };
  } catch (error) {
    console.warn('Tax service unavailable, using fallback rate:', error.message);
    // Fallback: estimate ~8.25% tax
    const subtotal = order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const estimatedRate = 0.0825;
    return {
      taxAmount: parseFloat((subtotal * estimatedRate).toFixed(2)),
      rate: estimatedRate,
      breakdown: null,
      jurisdiction: null,
      hasNexus: true,
      lineItems: [],
      estimated: true,
    };
  }
}

/**
 * Validate a tax-exempt certificate.
 * @param {string} exemptionNumber
 * @param {string} state
 */
export async function validateExemption(exemptionNumber, state) {
  try {
    const response = await axios.get(`${API_BASE}/tax/exemption`, {
      params: { exemption_number: exemptionNumber, state },
    });
    return response.data;
  } catch {
    return { valid: false };
  }
}
