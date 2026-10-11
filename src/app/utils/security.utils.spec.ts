import { describe, it, expect } from 'vitest';
import { sanitizeReturnUrl } from './security.utils';

describe('SecurityUtils - sanitizeReturnUrl (OWASP CWE-601 Open Redirect Protection)', () => {
  it('should allow valid relative internal application paths', () => {
    expect(sanitizeReturnUrl('/checkout')).toBe('/checkout');
    expect(sanitizeReturnUrl('/my-account')).toBe('/my-account');
    expect(sanitizeReturnUrl('/my-orders?filter=recent')).toBe('/my-orders?filter=recent');
    expect(sanitizeReturnUrl('/shop/15')).toBe('/shop/15');
    expect(sanitizeReturnUrl('/build-hamper')).toBe('/build-hamper');
  });

  it('should reject external absolute URLs with protocols', () => {
    expect(sanitizeReturnUrl('https://evil.com/phishing')).toBe('');
    expect(sanitizeReturnUrl('http://attacker.org')).toBe('');
    expect(sanitizeReturnUrl('ftp://malicious.net/file')).toBe('');
  });

  it('should reject protocol-relative URLs (e.g. //evil.com)', () => {
    expect(sanitizeReturnUrl('//evil.com')).toBe('');
    expect(sanitizeReturnUrl('//evil.com/steal-creds')).toBe('');
  });

  it('should reject javascript: and data: pseudo-protocols', () => {
    expect(sanitizeReturnUrl('javascript:alert(document.cookie)')).toBe('');
    expect(sanitizeReturnUrl('/javascript:alert(1)')).toBe('');
    expect(sanitizeReturnUrl('/data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('should reject URLs with CRLF injection characters', () => {
    expect(sanitizeReturnUrl('/checkout\r\nSet-Cookie:malicious=true')).toBe('');
    expect(sanitizeReturnUrl('/checkout\nLocation:evil.com')).toBe('');
  });

  it('should return fallback if input is null, undefined, or empty', () => {
    expect(sanitizeReturnUrl(null)).toBe('');
    expect(sanitizeReturnUrl(undefined)).toBe('');
    expect(sanitizeReturnUrl('')).toBe('');
    expect(sanitizeReturnUrl('   ')).toBe('');
    expect(sanitizeReturnUrl(null, '/')).toBe('/');
  });
});
