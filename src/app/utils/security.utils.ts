/**
 * Security utilities for RMS Creations.
 * Implements defenses against OWASP Top 10 vulnerabilities (CWE-601 Open Redirect, XSS, etc.).
 */

/**
 * Validates and sanitizes a return URL from query parameters or user input.
 * Ensures that the destination is strictly an internal, relative application route.
 *
 * @param url The raw candidate return URL
 * @param fallback The fallback URL if invalid (default: '')
 * @returns A safe relative path or the fallback
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
