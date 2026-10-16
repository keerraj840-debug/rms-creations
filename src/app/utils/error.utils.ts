/**
 * Centralized, customer-friendly error formatting utility for RMS Creations.
 *
 * Rules:
 * 1. Never expose raw SQL errors, stack traces, database codes (e.g. PGRST116, 23505),
 *    table names, column names, server paths, or internal implementation details.
 * 2. Translate technical jargon into natural, professional, reassuring messages
 *    with clear next steps for customers and administrators.
 */

export function formatUserFriendlyError(
  error: any,
  fallbackMessage: string = 'We could not complete your request. Please try again shortly.'
): string {
  if (!error) return fallbackMessage;

  const rawMessage = typeof error === 'string' 
    ? error 
    : (error.message || error.error_description || error.statusText || '');

  if (!rawMessage || typeof rawMessage !== 'string') {
    return fallbackMessage;
  }

  const lower = rawMessage.toLowerCase();

  // 1. Authentication & Credentials
  if (
    lower.includes('invalid login credentials') ||
    lower.includes('invalid email or password') ||
    lower.includes('authentication failed') ||
    lower.includes('user not found')
  ) {
    return 'Your sign-in details could not be verified. Please check your email and password.';
  }

  if (
    lower.includes('user already registered') ||
    lower.includes('already exists') ||
    lower.includes('duplicate key value') ||
    lower.includes('users_email_key')
  ) {
    return 'An account with this email address already exists. Please sign in instead.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Please verify your email address to sign in, or click forgot password to reset.';
  }

  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. For your security, please wait a few moments before trying again.';
  }

  if (lower.includes('password') && (lower.includes('weak') || lower.includes('short') || lower.includes('least'))) {
    return 'Please choose a stronger password with at least 8 characters including letters, numbers, and symbols.';
  }

  // 2. Authorization & Permissions
  if (
    lower.includes('jwt expired') ||
    lower.includes('session expired') ||
    lower.includes('invalid token')
  ) {
    return 'Your session has timed out. Please sign in again to continue.';
  }

  if (
    lower.includes('unauthorized') ||
    lower.includes('status code 401')
  ) {
    return 'Please sign in to complete this action.';
  }

  if (
    lower.includes('forbidden') ||
    lower.includes('status code 403') ||
    lower.includes('row-level security') ||
    lower.includes('permission denied')
  ) {
    return 'You do not have permission to perform this action.';
  }

  // 3. Network & Connectivity
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network error') ||
    lower.includes('timeout') ||
    lower.includes('gateway') ||
    lower.includes('504') ||
    lower.includes('502') ||
    lower.includes('503')
  ) {
    return 'This is taking longer than expected. Please check your connection and try again.';
  }

  // 4. Server & Database Internal Errors
  if (
    lower.includes('pgrst') ||
    lower.includes('syntax error') ||
    lower.includes('violates') ||
    lower.includes('column') ||
    lower.includes('relation') ||
    lower.includes('database') ||
    lower.includes('postgres') ||
    lower.includes('internal server error') ||
    lower.includes('500')
  ) {
    return 'Something went wrong on our side. Please try again shortly.';
  }

  // 5. Missing / Not Found
  if (
    lower.includes('record not found') ||
    lower.includes('row not found') ||
    lower.includes('not found') ||
    lower.includes('404')
  ) {
    return 'We could not find the requested information.';
  }

  // 6. Validation & Payload Errors
  if (
    lower.includes('invalid payload') ||
    lower.includes('null value') ||
    lower.includes('bad request') ||
    lower.includes('400')
  ) {
    return 'Please check the information you entered and try again.';
  }

  // 7. File Upload Errors
  if (lower.includes('file size') || lower.includes('exceeds maximum')) {
    return 'The selected photo is too large. Please choose an image smaller than 1 MB.';
  }

  if (lower.includes('format') && lower.includes('not allowed')) {
    return 'Please choose a valid JPG or PNG photo.';
  }

  // If the message is already written in clean customer-friendly English (no technical symbols or stack trace)
  const hasTechnicalArtifacts = /[{}[\]<>;=_\/\\$@*#%^&`~]|pgrst|sql|postgres|database|exception|null pointer|undefined/i.test(rawMessage);
  if (!hasTechnicalArtifacts && rawMessage.length < 140 && !rawMessage.includes('at ') && !rawMessage.includes('http')) {
    return rawMessage;
  }

  return fallbackMessage;
}
