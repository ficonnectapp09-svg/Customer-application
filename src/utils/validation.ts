/**
 * Centralized Validation Utilities for Customer Mobile Application
 * Enforces Indian mobile number standards and form validations.
 */

/**
 * Strips non-digit characters and removes country code (+91 / 91 / 0) if present,
 * returning the 10-digit base number.
 */
export const cleanIndianMobile = (phone: string | number | null | undefined): string => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length > 10) {
    if (digits.startsWith('91') && digits.length === 12) {
      return digits.slice(2);
    }
    return digits.slice(-10);
  }
  return digits;
};

/**
 * Validates whether the given phone number is a valid 10-digit Indian mobile number.
 * Must start with 6, 7, 8, or 9.
 */
export const isValidIndianMobile = (phone: string | number | null | undefined): boolean => {
  const cleaned = cleanIndianMobile(phone);
  return /^[6-9]\d{9}$/.test(cleaned);
};

export const INDIAN_MOBILE_ERROR_MESSAGE =
  'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';

