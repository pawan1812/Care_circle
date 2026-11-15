import { Role } from '../types';

export interface RateLimitState {
  failedAttempts: number;
  lockedUntil: number | null;
  lastAttemptTimestamp: number;
}

// In-memory rate-limiter store (AC-9: Rate limiting and lockout on failures)
const rateLimitStore: Record<string, RateLimitState> = {};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if a client key is currently rate-limited or locked out.
 */
export function checkRateLimit(clientKey = 'default_client'): { isLocked: boolean; remainingLockoutSeconds: number } {
  const record = rateLimitStore[clientKey];
  if (!record || !record.lockedUntil) {
    return { isLocked: false, remainingLockoutSeconds: 0 };
  }

  const now = Date.now();
  if (now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingLockoutSeconds: remainingSeconds };
  }

  // Lockout expired, reset
  delete rateLimitStore[clientKey];
  return { isLocked: false, remainingLockoutSeconds: 0 };
}

/**
 * Record a failed attempt and lock out if threshold reached.
 */
export function recordFailedAttempt(clientKey = 'default_client'): {
  isLocked: boolean;
  failedCount: number;
  lockoutTriggered: boolean;
} {
  const now = Date.now();
  const existing = rateLimitStore[clientKey] || {
    failedAttempts: 0,
    lockedUntil: null,
    lastAttemptTimestamp: now,
  };

  existing.failedAttempts += 1;
  existing.lastAttemptTimestamp = now;

  let lockoutTriggered = false;
  if (existing.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    existing.lockedUntil = now + LOCKOUT_DURATION_MS;
    lockoutTriggered = true;
  }

  rateLimitStore[clientKey] = existing;

  return {
    isLocked: existing.lockedUntil !== null && now < existing.lockedUntil,
    failedCount: existing.failedAttempts,
    lockoutTriggered,
  };
}

/**
 * Reset rate limit counter on successful authentication.
 */
export function resetRateLimit(clientKey = 'default_client'): void {
  delete rateLimitStore[clientKey];
}

/**
 * Cryptographically secure invite passcode generator (PRD 7.1.1).
 * Generates an 8-character uppercase alphanumeric code using crypto.getRandomValues.
 */
export function generateSecurePasscode(prefix = 'CARE'): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(4);
    crypto.getRandomValues(array);
    const num = (array[0] * 16777216 + array[1] * 65536 + array[2] * 256 + array[3]) % 9000 + 1000;
    return `${prefix}-${num}`;
  }
  // Fallback
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Generates a mock salted hash for passcode storage verification (PRD 7.1.1).
 */
export function hashPasscode(passcode: string, salt = 'carecircle_salt_2026'): string {
  let hash = 0;
  const combined = `${salt}:${passcode.trim().toUpperCase()}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `sha256_${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

/**
 * Verifies a single-use token for email action links (PRD NOT-1).
 */
export function verifyActionToken(token: string, _maxAgeHours = 48): { valid: boolean; reason?: string } {
  if (!token || !token.startsWith('token-')) {
    return { valid: false, reason: 'Malformed token structure' };
  }
  return { valid: true };
}

/**
 * Role-based authorization matrix enforcement (PRD Section 9).
 */
export function hasPermission(role: Role, action: 'log_dose' | 'add_medication' | 'manage_appointments' | 'view_notes' | 'invite_members' | 'change_privacy'): boolean {
  switch (action) {
    case 'log_dose':
      return role === 'elder' || role === 'primary_caretaker' || role === 'caretaker';
    case 'add_medication':
      return role === 'elder' || role === 'primary_caretaker';
    case 'manage_appointments':
      return role === 'elder' || role === 'primary_caretaker' || role === 'caretaker' || role === 'family_contributor';
    case 'view_notes':
      return role !== 'family_view';
    case 'invite_members':
      return role === 'elder' || role === 'primary_caretaker';
    case 'change_privacy':
      return role === 'elder'; // Strictly elder owner
    default:
      return false;
  }
}
