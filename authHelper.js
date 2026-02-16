/**
 * authHelper.js
 *
 * ⛔ DO NOT MODIFY THIS FILE
 *
 * This is a pre-built helper provided as part of the machine test.
 * It simulates a real authentication API call — complete with network
 * delay, random failures, and a structurally valid (fake) JWT token.
 *
 * Usage:
 *   import { fakeLogin } from './authHelper';
 *   const result = await fakeLogin(email, password);
 *
 * Returns:
 *   { success: true,  token: "eyJ..." }          — on success
 *   { success: false, error: "Some message" }    — on failure
 */

// ---------------------------------------------------------------------------
// Internal: fake JWT builder
// ---------------------------------------------------------------------------

/**
 * Base64-url encode a string (browser + RN compatible).
 * @param {string} str
 * @returns {string}
 */
function base64UrlEncode(str) {
  // btoa works on web; for RN we fall back to a manual implementation
  let encoded;
  try {
    encoded = btoa(str);
  } catch {
    // Simple fallback (covers basic ASCII payloads used here)
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = Array.from(str).map((c) => c.charCodeAt(0));
    let result = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const b0 = bytes[i] ?? 0;
      const b1 = bytes[i + 1] ?? 0;
      const b2 = bytes[i + 2] ?? 0;
      result +=
        chars[b0 >> 2] +
        chars[((b0 & 3) << 4) | (b1 >> 4)] +
        (i + 1 < bytes.length ? chars[((b1 & 15) << 2) | (b2 >> 6)] : '=') +
        (i + 2 < bytes.length ? chars[b2 & 63] : '=');
    }
    encoded = result;
  }
  // Convert to base64url format
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Build a fake-but-structurally-valid JWT token.
 * The token is NOT cryptographically signed — the signature is a random string.
 * The payload CAN be decoded with atob / Buffer.from.
 *
 * @param {string} email
 * @returns {string} fake JWT
 */
function buildFakeJWT(email) {
  const header = base64UrlEncode(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  );

  // Derive a display name from the email address
  const namePart = email.split('@')[0] ?? 'user';
  const displayName = namePart
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: `user_${Math.random().toString(36).slice(2, 10)}`,
      name: displayName,
      email: email.toLowerCase(),
      iat: now,
      exp: now + 60 * 60 * 24, // expires in 24 hours
    })
  );

  // Fake signature — random hex string, not a real HMAC
  const fakeSignature = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return `${header}.${payload}.${fakeSignature}`;
}

// ---------------------------------------------------------------------------
// Internal: simulate network latency
// ---------------------------------------------------------------------------

/**
 * Returns a promise that resolves after a random delay between min and max ms.
 * @param {number} min
 * @param {number} max
 * @returns {Promise<void>}
 */
function delay(min = 1000, max = 2000) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Simulates an async login API call.
 *
 * Failure conditions:
 *  - Password shorter than 4 characters → always fails (use this to test error UI)
 *  - ~30% random failure rate to simulate real-world flakiness
 *
 * @param {string} email     — any non-empty string treated as a valid email
 * @param {string} password  — must be 4+ characters for a chance of success
 * @returns {Promise<{ success: true, token: string } | { success: false, error: string }>}
 */
export async function fakeLogin(email, password) {
  // Simulate network delay
  await delay(1200, 2200);

  // Hard fail: password too short (useful for controlled error testing)
  if (!password || password.length < 4) {
    return {
      success: false,
      error: 'Password must be at least 4 characters.',
    };
  }

  // Hard fail: missing email
  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: 'A valid email address is required.',
    };
  }

  // Random ~30% failure rate to simulate server errors
  if (Math.random() < 0.3) {
    const serverErrors = [
      'Server error. Please try again.',
      'Authentication service unavailable.',
      'Request timed out. Check your connection.',
      'Too many attempts. Please wait a moment.',
    ];
    const randomError =
      serverErrors[Math.floor(Math.random() * serverErrors.length)];
    return { success: false, error: randomError };
  }

  // Success — return a fake JWT
  return {
    success: true,
    token: buildFakeJWT(email),
  };
}

// ---------------------------------------------------------------------------
// Bonus utility — decode the JWT payload (no verification)
// ---------------------------------------------------------------------------

/**
 * Decodes the payload of a JWT token without verifying the signature.
 * Useful for extracting user info (name, email, exp) from the stored token.
 *
 * @param {string} token
 * @returns {{ sub: string, name: string, email: string, iat: number, exp: number } | null}
 */
export function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Pad base64url back to standard base64
    const padded = payload + '=='.slice((payload.length % 4 === 0) ? 0 : 4 - (payload.length % 4));
    const standard = padded.replace(/-/g, '+').replace(/_/g, '/');

    let decoded;
    try {
      decoded = atob(standard);
    } catch {
      // RN fallback
      decoded = Buffer.from(standard, 'base64').toString('utf8');
    }

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Returns true if the token exists and has not passed its `exp` timestamp.
 *
 * @param {string | null | undefined} token
 * @returns {boolean}
 */
export function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return false;
  return payload.exp > Math.floor(Date.now() / 1000);
}
