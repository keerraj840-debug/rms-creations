import { describe, it, expect } from 'vitest';
import { formatUserFriendlyError } from './error.utils';

describe('formatUserFriendlyError', () => {
  it('should return fallback for null or empty errors', () => {
    expect(formatUserFriendlyError(null)).toBe('We could not complete your request. Please try again shortly.');
    expect(formatUserFriendlyError(undefined, 'Custom fallback')).toBe('Custom fallback');
  });

  it('should map invalid credentials to user-friendly text', () => {
    const error = { message: 'Invalid login credentials' };
    expect(formatUserFriendlyError(error)).toBe(
      'Your sign-in details could not be verified. Please check your email and password.'
    );
  });

  it('should map duplicate email error without exposing database constraint', () => {
    const error = { message: 'duplicate key value violates unique constraint "users_email_key"' };
    expect(formatUserFriendlyError(error)).toBe(
      'An account with this email address already exists. Please sign in instead.'
    );
  });

  it('should map network timeout and fetch errors', () => {
    expect(formatUserFriendlyError({ message: 'Failed to fetch' })).toBe(
      'This is taking longer than expected. Please check your connection and try again.'
    );
    expect(formatUserFriendlyError('Server timeout 504')).toBe(
      'This is taking longer than expected. Please check your connection and try again.'
    );
  });

  it('should sanitize raw Postgres/PGRST internal errors', () => {
    const error = { message: 'PGRST116: JSON object requested, multiple (or no) rows returned' };
    expect(formatUserFriendlyError(error)).toBe(
      'Something went wrong on our side. Please try again shortly.'
    );
  });

  it('should map permission and RLS denied errors', () => {
    const error = { message: 'new row violates row-level security policy for table "orders"' };
    expect(formatUserFriendlyError(error)).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('should pass through already clean, natural user messages', () => {
    const cleanMsg = 'Please enter a valid 10-digit mobile number.';
    expect(formatUserFriendlyError(cleanMsg)).toBe(cleanMsg);
  });
});
