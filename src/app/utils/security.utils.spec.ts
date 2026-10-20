import { describe, it, expect } from 'vitest';
import {
  sanitizeReturnUrl,
  sanitizeUrl,
  serializeSafeJsonLd,
  sanitizeCsvCell,
  stripHtml
} from './security.utils';

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

describe('SecurityUtils - sanitizeUrl (OWASP CWE-79 Protocol-based XSS Protection)', () => {
  it('should allow valid http and https URLs', () => {
    expect(sanitizeUrl('https://rmsgifthampers.com')).toBe('https://rmsgifthampers.com');
    expect(sanitizeUrl('http://example.com/item/1')).toBe('http://example.com/item/1');
  });

  it('should allow legitimate mailto and tel links', () => {
    expect(sanitizeUrl('mailto:support@rmsgifthampers.com')).toBe('mailto:support@rmsgifthampers.com');
    expect(sanitizeUrl('tel:+919284905118')).toBe('tel:+919284905118');
  });

  it('should allow safe internal relative routes', () => {
    expect(sanitizeUrl('/shop')).toBe('/shop');
    expect(sanitizeUrl('/product/dry-fruit-box')).toBe('/product/dry-fruit-box');
  });

  it('should reject javascript: execution payloads', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    expect(sanitizeUrl('JAVASCRIPT:alert(document.cookie)')).toBe('');
    expect(sanitizeUrl('javascript:/*--></title></style></textarea><em><script>alert(1)</script>')).toBe('');
  });

  it('should reject data: URLs and dangerous URI schemes', () => {
    expect(sanitizeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe('');
    expect(sanitizeUrl('vbscript:msgbox("XSS")')).toBe('');
    expect(sanitizeUrl('file:///etc/passwd')).toBe('');
  });

  it('should reject URLs containing control characters or CRLF', () => {
    expect(sanitizeUrl('https://example.com/\u0000xss')).toBe('');
    expect(sanitizeUrl('https://example.com/\r\nxss')).toBe('');
  });

  it('should return fallback when invalid', () => {
    expect(sanitizeUrl(null, '/default')).toBe('/default');
    expect(sanitizeUrl(undefined, '/default')).toBe('/default');
    expect(sanitizeUrl('', '/default')).toBe('/default');
  });
});

describe('SecurityUtils - serializeSafeJsonLd (OWASP CWE-79 Script Tag Breakout Protection)', () => {
  it('should escape closing script tags to prevent DOM execution breakout', () => {
    const maliciousPayload = {
      name: 'Festive Hamper </script><script>alert(1)</script>',
      description: 'Luxury sweets'
    };
    const serialized = serializeSafeJsonLd(maliciousPayload);

    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('\\u003c/script\\u003e');
    expect(serialized).toContain('\\u003cscript\\u003ealert(1)\\u003c/script\\u003e');
  });

  it('should escape HTML tags and event handler payloads', () => {
    const maliciousPayload = {
      name: '<img src=x onerror=alert(1)>',
      tag: '<svg onload=alert(1)>'
    };
    const serialized = serializeSafeJsonLd(maliciousPayload);

    expect(serialized).not.toContain('<img');
    expect(serialized).not.toContain('<svg');
    expect(serialized).toContain('\\u003cimg');
    expect(serialized).toContain('\\u003csvg');
  });

  it('should escape ampersands to avoid entity decoding tricks', () => {
    const payload = { query: 'category=gifts&promo=diwali' };
    const serialized = serializeSafeJsonLd(payload);

    expect(serialized).toContain('\\u0026');
  });
});

describe('SecurityUtils - sanitizeCsvCell (OWASP CWE-1236 CSV Formula Injection Protection)', () => {
  it('should neutralize formula prefixes (=, +, -, @) by prepending a single quote', () => {
    expect(sanitizeCsvCell('=cmd|\' /C calc\'!A0')).toBe('"\'=cmd|\' /C calc\'!A0"');
    expect(sanitizeCsvCell('+1+2+3')).toBe('"\'+1+2+3"');
    expect(sanitizeCsvCell('-5+5')).toBe('"\'-5+5"');
    expect(sanitizeCsvCell('@SUM(1,2)')).toBe('"\'@SUM(1,2)"');
    expect(sanitizeCsvCell('\t=2+2')).toBe('"\'\t=2+2"');
  });

  it('should properly escape double quotes according to RFC 4180', () => {
    expect(sanitizeCsvCell('Special "Handcrafted" Hamper')).toBe('"Special ""Handcrafted"" Hamper"');
  });

  it('should handle standard benign text safely', () => {
    expect(sanitizeCsvCell('Order #RMS-10294')).toBe('"Order #RMS-10294"');
    expect(sanitizeCsvCell('Customer Name: Anita Sharma')).toBe('"Customer Name: Anita Sharma"');
  });

  it('should handle null, undefined, and numbers gracefully', () => {
    expect(sanitizeCsvCell(null)).toBe('""');
    expect(sanitizeCsvCell(undefined)).toBe('""');
    expect(sanitizeCsvCell(1499)).toBe('"1499"');
  });
});

describe('SecurityUtils - stripHtml (Text Sanitization)', () => {
  it('should strip HTML tags while preserving text content', () => {
    expect(stripHtml('<b>Bold Text</b>')).toBe('Bold Text');
    expect(stripHtml('<script>alert("XSS")</script>Hello')).toBe('Hello');
    expect(stripHtml('<a href="javascript:alert(1)">Click Me</a>')).toBe('Click Me');
  });

  it('should eliminate residual angular brackets from escaped entities and strip executable scripts', () => {
    expect(stripHtml('&lt;b&gt;Bold Notice&lt;/b&gt;')).toBe('Bold Notice');
    expect(stripHtml('&lt;script&gt;alert(1)&lt;/script&gt;Safe After')).toBe('Safe After');
  });

  it('should return empty string on null, undefined or empty input', () => {
    expect(stripHtml(null)).toBe('');
    expect(stripHtml(undefined)).toBe('');
    expect(stripHtml('')).toBe('');
  });
});
