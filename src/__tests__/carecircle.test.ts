import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  generateSecurePasscode,
  hashPasscode,
  verifyActionToken,
  hasPermission,
} from '../utils/security';
import {
  calculateAdherence,
  detectMissPatterns,
  calculateRefillStatus,
} from '../utils/adherence';
import { translations } from '../i18n/translations';
import { DoseEvent } from '../types';
import {
  generateSignedActionToken,
  verifyAndExecuteActionToken,
  buildMedicationReminderEmail,
} from '../services/email/emailEngine';

describe('Security & Access Control (PRD AC-2, AC-3, AC-9, 7.1.1)', () => {
  beforeEach(() => {
    resetRateLimit('test_user');
  });

  it('generates secure 8-character invite passcodes with prefix', () => {
    const code = generateSecurePasscode('CARE');
    expect(code).toMatch(/^CARE-\d{4}$/);
    expect(code.length).toBe(9);
  });

  it('consistently hashes passcodes with salt', () => {
    const hash1 = hashPasscode('CARE-1234', 'salt_a');
    const hash2 = hashPasscode('CARE-1234', 'salt_a');
    const hashDiff = hashPasscode('CARE-1234', 'salt_b');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hashDiff);
    expect(hash1.startsWith('sha256_')).toBe(true);
  });

  it('implements rate-limiting and locks out after 5 consecutive failed attempts (AC-9)', () => {
    const client = 'test_user';

    // 1-4 attempts: not locked
    for (let i = 1; i <= 4; i++) {
      const res = recordFailedAttempt(client);
      expect(res.isLocked).toBe(false);
      expect(res.lockoutTriggered).toBe(false);
      expect(res.failedCount).toBe(i);
    }

    // 5th attempt: lockout triggered
    const lockRes = recordFailedAttempt(client);
    expect(lockRes.isLocked).toBe(true);
    expect(lockRes.lockoutTriggered).toBe(true);

    const check = checkRateLimit(client);
    expect(check.isLocked).toBe(true);
    expect(check.remainingLockoutSeconds).toBeGreaterThan(0);
  });

  it('resets rate limit on successful authentication', () => {
    const client = 'test_user';
    recordFailedAttempt(client);
    recordFailedAttempt(client);

    resetRateLimit(client);
    const check = checkRateLimit(client);
    expect(check.isLocked).toBe(false);
  });

  it('validates single-use signed action tokens from email links (NOT-1)', () => {
    expect(verifyActionToken('token-dose-123').valid).toBe(true);
    expect(verifyActionToken('invalid-token').valid).toBe(false);
    expect(verifyActionToken('').valid).toBe(false);
  });
});

describe('Role-Based Permissions Matrix (PRD Section 9)', () => {
  it('enforces elder owner permissions', () => {
    expect(hasPermission('elder', 'log_dose')).toBe(true);
    expect(hasPermission('elder', 'add_medication')).toBe(true);
    expect(hasPermission('elder', 'manage_appointments')).toBe(true);
    expect(hasPermission('elder', 'change_privacy')).toBe(true);
    expect(hasPermission('elder', 'invite_members')).toBe(true);
  });

  it('enforces primary caretaker permissions', () => {
    expect(hasPermission('primary_caretaker', 'log_dose')).toBe(true);
    expect(hasPermission('primary_caretaker', 'add_medication')).toBe(true);
    expect(hasPermission('primary_caretaker', 'manage_appointments')).toBe(true);
    expect(hasPermission('primary_caretaker', 'invite_members')).toBe(true);
    // Primary caretaker cannot alter elder privacy settings
    expect(hasPermission('primary_caretaker', 'change_privacy')).toBe(false);
  });

  it('enforces family contributor permissions', () => {
    expect(hasPermission('family_contributor', 'manage_appointments')).toBe(true);
    expect(hasPermission('family_contributor', 'view_notes')).toBe(true);
    // Family contributor cannot directly log doses or alter prescriptions
    expect(hasPermission('family_contributor', 'log_dose')).toBe(false);
    expect(hasPermission('family_contributor', 'add_medication')).toBe(false);
  });

  it('enforces family view only restrictions', () => {
    expect(hasPermission('family_view', 'view_notes')).toBe(false);
    expect(hasPermission('family_view', 'log_dose')).toBe(false);
    expect(hasPermission('family_view', 'change_privacy')).toBe(false);
  });
});

describe('Adherence Calculation & Insights Engine (PRD 7.3, ADH-1, ADH-3)', () => {
  const sampleDoses: DoseEvent[] = [
    {
      id: 'd1',
      medicationId: 'm1',
      medicationName: 'Metformin',
      strength: '500 mg',
      form: 'tablet',
      colorTag: '#3b82f6',
      scheduledDate: '2026-11-15',
      scheduledTime: '08:00',
      timeOfDay: 'morning',
      foodInstruction: 'after_food',
      doctorMissedInstruction: 'Take after food',
      status: 'taken',
    },
    {
      id: 'd2',
      medicationId: 'm2',
      medicationName: 'Amlodipine',
      strength: '5 mg',
      form: 'tablet',
      colorTag: '#10b981',
      scheduledDate: '2026-11-15',
      scheduledTime: '08:00',
      timeOfDay: 'morning',
      foodInstruction: 'with_food',
      doctorMissedInstruction: 'Take with food',
      status: 'late',
    },
    {
      id: 'd3',
      medicationId: 'm1',
      medicationName: 'Metformin',
      strength: '500 mg',
      form: 'tablet',
      colorTag: '#3b82f6',
      scheduledDate: '2026-11-15',
      scheduledTime: '20:00',
      timeOfDay: 'evening',
      foodInstruction: 'after_food',
      doctorMissedInstruction: 'Take after food',
      status: 'missed',
    },
  ];

  it('accurately computes total, taken, late, and adherence percentage', () => {
    const stats = calculateAdherence(sampleDoses);
    expect(stats.totalScheduled).toBe(3);
    expect(stats.takenCount).toBe(1);
    expect(stats.lateCount).toBe(1);
    expect(stats.missedCount).toBe(1);
    // (1 taken + 1 late) / 3 = 66.6% -> rounds to 67%
    expect(stats.adherencePercentage).toBe(67);
  });

  it('detects time-of-day repeated miss patterns (PRD Innovation 4)', () => {
    const eveningMisses: DoseEvent[] = [
      ...sampleDoses,
      { ...sampleDoses[2], id: 'd4' },
      { ...sampleDoses[2], id: 'd5' },
    ];

    const pattern = detectMissPatterns(eveningMisses);
    expect(pattern.hasPattern).toBe(true);
    expect(pattern.timeOfDay).toBe('evening');
    expect(pattern.missCount).toBe(3);
    expect(pattern.recommendation).toContain('dinner at 7:30 PM');
  });
});

describe('Medication Supply & Refill Prediction (PRD MED-8)', () => {
  it('correctly predicts days remaining and triggers refill alert when at or below threshold', () => {
    // 14 pills, 2 daily = 7 days remaining -> triggers alert (threshold 7)
    const res1 = calculateRefillStatus(14, 2, 7);
    expect(res1.daysRemaining).toBe(7);
    expect(res1.isRefillRequired).toBe(true);

    // 5 pills, 1 daily = 5 days remaining -> triggers alert
    const res2 = calculateRefillStatus(5, 1, 7);
    expect(res2.daysRemaining).toBe(5);
    expect(res2.isRefillRequired).toBe(true);

    // 30 pills, 1 daily = 30 days remaining -> no alert
    const res3 = calculateRefillStatus(30, 1, 7);
    expect(res3.daysRemaining).toBe(30);
    expect(res3.isRefillRequired).toBe(false);
  });
});

describe('Internationalization Completeness (PRD ELD-4)', () => {
  it('contains matching keys across English, Hindi, and Marathi', () => {
    const enKeys = Object.keys(translations.en);
    const hiKeys = Object.keys(translations.hi);
    const mrKeys = Object.keys(translations.mr);

    expect(hiKeys.length).toBe(enKeys.length);
    expect(mrKeys.length).toBe(enKeys.length);

    enKeys.forEach((key) => {
      expect(translations.hi).toHaveProperty(key);
      expect(translations.mr).toHaveProperty(key);
    });
  });
});

describe('Production Email Reminder Engine (PRD NOT-1, NOT-2)', () => {
  it('generates tamper-resistant signed action tokens with signature', () => {
    const token = generateSignedActionToken('prof_savitri', 'dose_metformin_0800', 'taken', 12);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const jsonStr = atob(token);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.p).toBe('prof_savitri');
    expect(parsed.d).toBe('dose_metformin_0800');
    expect(parsed.a).toBe('taken');
    expect(parsed.s).toBeDefined();
    expect(parsed.e).toBeGreaterThan(Date.now());
  });

  it('rejects tampered action tokens', async () => {
    const validToken = generateSignedActionToken('prof_savitri', 'dose_01', 'taken');
    const parsed = JSON.parse(atob(validToken));
    parsed.a = 'skip'; // Tamper with action
    const tamperedToken = btoa(JSON.stringify(parsed));

    const result = await verifyAndExecuteActionToken(tamperedToken);
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid or tampered');
  });

  it('generates accessible HTML email templates with 1-tap action links', () => {
    const token = generateSignedActionToken('prof_savitri', 'dose_01', 'taken');
    const html = buildMedicationReminderEmail(
      'Savitri Sharma',
      [{ name: 'Metformin', strength: '500 mg', instruction: '1 tablet after breakfast' }],
      token
    );

    expect(html).toContain('Good Morning, Savitri Sharma');
    expect(html).toContain('Metformin 500 mg');
    expect(html).toContain('1 tablet after breakfast');
    expect(html).toContain('✓ I Have Taken My Tablets');
    expect(html).toContain(`token=${token}`);
  });
});

