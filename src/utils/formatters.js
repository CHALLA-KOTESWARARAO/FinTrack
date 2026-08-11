export const CURRENCY_CONFIG = {
  INR: { symbol: '₹', code: 'INR', locale: 'en-IN' },
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' }
};

/**
 * Format a number into currency representation
 * @param {number} amount
 * @param {string} currencyCode 'INR' | 'USD' | 'EUR' | 'GBP'
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'INR') => {
  const num = Number(amount) || 0;
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR;

  try {
    const formattedNum = new Intl.NumberFormat(config.locale, {
      maximumFractionDigits: 0
    }).format(num);

    return `${config.symbol}${formattedNum}`;
  } catch {
    return `${config.symbol}${num.toLocaleString()}`;
  }
};

/**
 * Format percentage
 * @param {number} value
 * @returns {string} e.g. "+15.2%" or "-5.0%"
 */
export const formatPercentage = (value) => {
  const num = Number(value) || 0;
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

/**
 * Format date string into human readable format
 * @param {string} dateString 'YYYY-MM-DD'
 * @returns {string} e.g. "15 Jan 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};
