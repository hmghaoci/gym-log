import { PersonalRecord, WorkoutSession } from '../types/gym';

/**
 * Calculate estimated One Rep Max (1RM) using Brzycki & Epley formulas
 */
export function calculate1RM(weightKg: number, reps: number): {
  brzycki: number;
  epley: number;
  average: number;
} {
  if (reps <= 0 || weightKg <= 0) return { brzycki: 0, epley: 0, average: 0 };
  if (reps === 1) return { brzycki: weightKg, epley: weightKg, average: weightKg };

  // Brzycki: weight * (36 / (37 - reps)) for reps < 37
  const brzycki = reps < 37 ? weightKg * (36 / (37 - reps)) : weightKg * (1 + reps / 30);
  // Epley: weight * (1 + reps / 30)
  const epley = weightKg * (1 + reps / 30);

  const avg = (brzycki + epley) / 2;
  return {
    brzycki: Math.round(brzycki * 10) / 10,
    epley: Math.round(epley * 10) / 10,
    average: Math.round(avg * 10) / 10,
  };
}

/**
 * Generate 1RM percentage rep matrix for progressive overload planning
 */
export function get1RMPercentages(oneRepMax: number): {
  percentage: number;
  weight: number;
  targetReps: string;
}[] {
  const table = [
    { percentage: 100, targetReps: '1' },
    { percentage: 95, targetReps: '2' },
    { percentage: 90, targetReps: '3-4' },
    { percentage: 85, targetReps: '5-6' },
    { percentage: 80, targetReps: '7-8' },
    { percentage: 75, targetReps: '9-10' },
    { percentage: 70, targetReps: '11-12' },
    { percentage: 65, targetReps: '15+' },
  ];

  return table.map((item) => ({
    percentage: item.percentage,
    weight: Math.round((oneRepMax * (item.percentage / 100)) * 2) / 2, // round to nearest 0.5kg
    targetReps: item.targetReps,
  }));
}

/**
 * Barbell Plate Loading Calculator
 * Calculates plates required on each side
 */
export interface PlateCalculationResult {
  targetWeight: number;
  barWeight: number;
  weightPerSide: number;
  platesPerSide: { weight: number; count: number; colorHex: string }[];
  achievedWeight: number;
  difference: number;
}

export const STANDARD_PLATES = [
  { weight: 25, colorHex: '#dc2626' }, // Red (Olympic standard)
  { weight: 20, colorHex: '#2563eb' }, // Blue
  { weight: 15, colorHex: '#eab308' }, // Yellow
  { weight: 10, colorHex: '#16a34a' }, // Green
  { weight: 5, colorHex: '#ffffff' },  // White
  { weight: 2.5, colorHex: '#9ca3af' },// Silver / Grey
  { weight: 1.25, colorHex: '#6b7280' },
];

export function calculateBarbellPlates(
  targetWeightKg: number,
  barWeightKg = 20,
  availablePlates = STANDARD_PLATES
): PlateCalculationResult {
  const result: PlateCalculationResult = {
    targetWeight: targetWeightKg,
    barWeight: barWeightKg,
    weightPerSide: 0,
    platesPerSide: [],
    achievedWeight: barWeightKg,
    difference: 0,
  };

  if (targetWeightKg <= barWeightKg) {
    result.difference = targetWeightKg - barWeightKg;
    return result;
  }

  const remainingPerSide = (targetWeightKg - barWeightKg) / 2;
  result.weightPerSide = remainingPerSide;

  let currentPerSide = remainingPerSide;
  let totalLoadedPerSide = 0;

  for (const plate of availablePlates) {
    const count = Math.floor(currentPerSide / plate.weight);
    if (count > 0) {
      result.platesPerSide.push({
        weight: plate.weight,
        count,
        colorHex: plate.colorHex,
      });
      currentPerSide -= count * plate.weight;
      totalLoadedPerSide += count * plate.weight;
    }
  }

  result.achievedWeight = barWeightKg + totalLoadedPerSide * 2;
  result.difference = Math.round((targetWeightKg - result.achievedWeight) * 10) / 10;

  return result;
}

/**
 * Format volume number into localized string (e.g. 12,450 kg)
 */
export function formatVolume(volume: number): string {
  const v = Math.round(volume || 0);
  try {
    return v.toLocaleString();
  } catch {
    return String(v);
  }
}

/**
 * Format duration in seconds to "1h 15m" or "45m"
 */
export function formatDurationHuman(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins || 1}m`;
}

/**
 * Format duration into digital clock format: MM:SS or HH:MM:SS
 */
export function formatDurationTimer(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Detect new PRs achieved in the current workout compared with past sessions
 */
export function detectWorkoutPRs(
  currentSession: WorkoutSession,
  pastSessions: WorkoutSession[]
): PersonalRecord[] {
  const newPrs: PersonalRecord[] = [];

  // Group past exercises and find historical maximums
  const historyBest: Record<string, { maxWeight: number; max1RM: number }> = {};

  for (const session of pastSessions) {
    if (session.id === currentSession.id) continue;
    for (const ex of session.exercises) {
      if (!historyBest[ex.exerciseId]) {
        historyBest[ex.exerciseId] = { maxWeight: 0, max1RM: 0 };
      }
      for (const set of ex.sets) {
        if (!set.completed) continue;
        if (set.kg > historyBest[ex.exerciseId].maxWeight) {
          historyBest[ex.exerciseId].maxWeight = set.kg;
        }
        const est1RM = calculate1RM(set.kg, set.reps).average;
        if (est1RM > historyBest[ex.exerciseId].max1RM) {
          historyBest[ex.exerciseId].max1RM = est1RM;
        }
      }
    }
  }

  // Compare current session
  for (const ex of currentSession.exercises) {
    const past = historyBest[ex.exerciseId];
    if (!past || past.maxWeight === 0) continue; // First time performing this exercise, not counted as PR break

    let sessionMaxWeight = 0;
    let sessionBestReps = 0;
    let sessionMax1RM = 0;

    for (const set of ex.sets) {
      if (!set.completed) continue;
      if (set.kg > sessionMaxWeight) {
        sessionMaxWeight = set.kg;
        sessionBestReps = set.reps;
      }
      const est1RM = calculate1RM(set.kg, set.reps).average;
      if (est1RM > sessionMax1RM) {
        sessionMax1RM = est1RM;
      }
    }

    if (sessionMaxWeight > past.maxWeight) {
      newPrs.push({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseZh || ex.exerciseName,
        type: 'maxWeight',
        value: sessionMaxWeight,
        reps: sessionBestReps,
        date: currentSession.date,
      });
    } else if (sessionMax1RM > past.max1RM + 1) {
      newPrs.push({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseZh || ex.exerciseName,
        type: 'max1RM',
        value: Math.round(sessionMax1RM),
        date: currentSession.date,
      });
    }
  }

  return newPrs;
}
