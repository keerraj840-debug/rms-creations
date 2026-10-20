/**
 * Security utilities for RMS Creations.
 * Comprehensive defenses against XSS (CWE-79), Open Redirects (CWE-601), and CSV Injection (CWE-1236).
 */

/**
 * Validates and sanitizes a return URL from query parameters or user input.
 * Ensures that the destination is strictly an internal, relative application route.
 */
export function sanitizeReturnUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();

  // Must begin with a single slash (relative internal route)
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return fallback;
  }

  // Reject URLs containing protocol specifiers (e.g., http://, https://, javascript:, data:)
  if (trimmed.includes('://')) {
    return fallback;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.includes('javascript:') ||
    lower.includes('data:') ||
    lower.includes('vbscript:') ||
    lower.includes('\n') ||
    lower.includes('\r')
  ) {
    return fallback;
  }

  return trimmed;
}

/**
 * Validates and sanitizes external or internal URLs.
 * Rejects dangerous URI schemes such as javascript:, vbscript:, and data:.
 * Only permits http:, https:, mailto:, tel:, or relative internal paths (/...).
 */
export function sanitizeUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Relative internal paths
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return sanitizeReturnUrl(trimmed, fallback);
  }

  // Disallow control characters
  if (/[\u0000-\u001F\u007F-\u009F\n\r\t]/.test(trimmed)) {
    return fallback;
  }

  // Check for dangerous protocol prefixes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:')
  ) {
    return fallback;
  }

  // Allow standard safe protocols
  if (
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:')
  ) {
    return trimmed;
  }

  return fallback;
}

/**
 * Serializes any JSON-LD schema into a string that is safe from HTML parser script-breakout.
 * Replaces all '<' with '\u003c' and '>' with '\u003e', preventing </script> injection.
 */
export function serializeSafeJsonLd(schema: unknown): string {
  return JSON.stringify(schema, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Sanitizes values for CSV export to prevent Formula Injection (CWE-1236).
 * Prepend a single quote if the value begins with '=', '+', '-', '@', tab, or carriage return.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // If the cell begins with formula characters, neutralize by prefixing with a single quote
  const trimmed = str.trimStart();
  if (['=', '+', '-', '@', '\t', '\r'].includes(trimmed.charAt(0))) {
    str = `'${str}`;
  }

  // Escape double quotes as per RFC 4180
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Strips HTML tags and normalizes dangerous characters from user-submitted text.
 */
export function stripHtml(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';
  let str = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Normalize entity-encoded angle brackets to catch obfuscated tags
  str = str.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
  str = str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '');

  return str.replace(/[<>]/g, '').trim();
}
