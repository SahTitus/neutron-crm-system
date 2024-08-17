import validator from 'validator';

/**
 * Recursively sanitize all string properties in an object to avoid XSS attacks, except for specified keys.
 * @param {Object} obj - The object to be sanitized.
 * @param {Array} exemptedKeys - The keys to be exempted from sanitization.
 * @returns {Object} - The sanitized object.
 */
function sanitizeFormData(obj, exemptedKeys = []) {
  const sanitizedObj = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'string' && !exemptedKeys.includes(key)) {
        sanitizedObj[key] = validator.escape(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizedObj[key] = sanitizeFormData(obj[key], exemptedKeys);
      } else {
        sanitizedObj[key] = obj[key];
      }
    }
  }

  return sanitizedObj;
}

export default sanitizeFormData;