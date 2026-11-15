import { DoseEvent, TimeOfDay } from '../types';

export interface AdherenceStats {
  totalScheduled: number;
  takenCount: number;
  lateCount: number;
  missedCount: number;
  skippedCount: number;
  adherencePercentage: number;
}

/**
 * Calculate adherence statistics from a set of dose events.
 */
export function calculateAdherence(doses: DoseEvent[]): AdherenceStats {
  const totalScheduled = doses.length;
  if (totalScheduled === 0) {
    return {
      totalScheduled: 0,
      takenCount: 0,
      lateCount: 0,
      missedCount: 0,
      skippedCount: 0,
      adherencePercentage: 100,
    };
  }

  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const lateCount = doses.filter((d) => d.status === 'late').length;
  const missedCount = doses.filter((d) => d.status === 'missed').length;
  const skippedCount = doses.filter((d) => d.status === 'skipped').length;

  const successfulDoses = takenCount + lateCount;
  const adherencePercentage = Math.round((successfulDoses / totalScheduled) * 100);

  return {
    totalScheduled,
    takenCount,
    lateCount,
    missedCount,
    skippedCount,
    adherencePercentage,
  };
}

export interface PatternInsight {
  hasPattern: boolean;
  timeOfDay?: TimeOfDay;
  missCount?: number;
  recommendation?: string;
}

/**
 * Pattern detection engine (PRD ADH-3 & Innovation 4).
 * Detects time-of-day repeated misses (e.g. >= 3 misses for evening doses).
 */
export function detectMissPatterns(doses: DoseEvent[]): PatternInsight {
  const missesByTime: Record<TimeOfDay, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };

  doses.forEach((d) => {
    if (d.status === 'missed' || d.status === 'skipped') {
      missesByTime[d.timeOfDay] = (missesByTime[d.timeOfDay] || 0) + 1;
    }
  });

  const timeSlots: TimeOfDay[] = ['evening', 'night', 'morning', 'afternoon'];
  for (const slot of timeSlots) {
    if (missesByTime[slot] >= 3) {
      const recommendation =
        slot === 'evening'
          ? 'Evening doses are frequently delayed or missed. Suggest aligning medicine with dinner at 7:30 PM rather than 8:00 PM.'
          : slot === 'night'
          ? 'Night doses are frequently missed due to early sleep. Consider moving schedule 30 minutes earlier.'
          : `${slot.toUpperCase()} doses have high miss frequency. Review schedule with primary caretaker.`;

      return {
        hasPattern: true,
        timeOfDay: slot,
        missCount: missesByTime[slot],
        recommendation,
      };
    }
  }

  return { hasPattern: false };
}

/**
 * Calculates days of medication supply left and checks if refill is triggered.
 */
export function calculateRefillStatus(
  supplyCount: number,
  dailyDoseCount: number,
  thresholdDays = 7
): { daysRemaining: number; isRefillRequired: boolean } {
  const dosesPerDay = Math.max(1, dailyDoseCount);
  const daysRemaining = Math.ceil(supplyCount / dosesPerDay);
  return {
    daysRemaining,
    isRefillRequired: daysRemaining <= thresholdDays,
  };
}

