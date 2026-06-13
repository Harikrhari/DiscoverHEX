/**
 * Format a number as USD currency string: "$XX.XX"
 * @param {number} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return `$${amount.toFixed(2)}`;
};

/**
 * Format a date string or Date object as "Month DD, YYYY"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format a number with commas: 12847 → "12,847"
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return Math.round(num).toLocaleString('en-US');
};

/**
 * Format a large currency amount with $ and commas: 12847.5 → "$12,847.50"
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Get initials from a full name: "John Doe" → "JD"
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Calculate tax amount
 * @param {number} amount - Pre-tax amount
 * @param {number} rate - Tax rate as decimal (default 8.5%)
 * @returns {number}
 */
export const calculateTax = (amount, rate = 0.085) => {
  if (typeof amount !== 'number' || isNaN(amount)) return 0;
  return amount * rate;
};

/**
 * Calculate charity contribution
 * @param {number} amount - Purchase amount
 * @param {number} percent - Charity percentage (default 5%)
 * @returns {number}
 */
export const calculateCharity = (amount, percent = 5) => {
  if (typeof amount !== 'number' || isNaN(amount)) return 0;
  return amount * (percent / 100);
};

/**
 * Truncate long text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
};

/**
 * Generate star rating display string
 * @param {number} rating - Rating 0–5
 * @returns {string}
 */
export const formatRating = (rating) => {
  const filled = Math.round(rating);
  const stars = '★'.repeat(filled) + '☆'.repeat(5 - filled);
  return `${stars} ${rating.toFixed(1)}`;
};
