/**
 * Utility functions for Kalaivani Sainik RIMC Coaching Centre
 */

/**
 * Normalizes Indian phone numbers into a standard 10-digit string
 * Handles +91, leading 0, spaces, dashes, parentheses
 */
export function normalizeIndianPhoneNumber(input: string): {
  isValid: boolean;
  normalized: string;
  formattedDisplay: string;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return { isValid: false, normalized: '', formattedDisplay: '', error: 'Phone number is required' };
  }

  // Remove whitespace, dashes, parentheses
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');

  let digits = '';
  if (cleaned.startsWith('+91')) {
    digits = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    digits = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    digits = cleaned.slice(1);
  } else {
    digits = cleaned;
  }

  // Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9
  if (!/^\d{10}$/.test(digits)) {
    return {
      isValid: false,
      normalized: digits,
      formattedDisplay: input,
      error: 'Please enter a valid 10-digit Indian mobile number',
    };
  }

  if (!/^[6-9]/.test(digits)) {
    return {
      isValid: false,
      normalized: digits,
      formattedDisplay: input,
      error: 'Indian mobile numbers must begin with 6, 7, 8, or 9',
    };
  }

  const formattedDisplay = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return {
    isValid: true,
    normalized: digits,
    formattedDisplay,
  };
}

/**
 * Defense against CSV Formula Injection (CWE-1236)
 * Prepends a single quote to any text starting with =, +, -, @, tab, or carriage return
 */
export function sanitizeForCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=\+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  // If contains commas or quotes, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts UTC timestamp to Asia/Kolkata formatted string
 */
export function formatToKolkata(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats date only in Asia/Kolkata
 */
export function formatDateOnlyKolkata(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Generates secure random ID
 */
export function generateId(prefix = 'id'): string {
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now().toString(36);
  return `${prefix}_${time}_${rand}`;
}

/**
 * Tracks click-to-call intent asynchronously without blocking navigation
 */
export async function trackCallIntent(sourceContext: string, phone: string = '+91 94437 18847'): Promise<void> {
  try {
    await fetch('/api/call-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceContext,
        destinationNumber: phone,
      }),
    });
  } catch (err) {
    console.debug('Call intent tracking failed (non-blocking):', err);
  }
}

