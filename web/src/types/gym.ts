export type BodyPart =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'upper arms'
  | 'lower arms'
  | 'upper legs'
  | 'lower legs'
  | 'waist'
  | 'cardio'
  | 'neck'
  | string;

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'body weight'
  | 'cable'
  | 'machine'
  | 'kettlebell'
  | 'band'
  | 'medicine ball'
  | 'smith machine'
  | 'weighted'
  | 'leverage machine'
  | 'olympic barbell'
  | 'ez barbell'
  | 'assisted'
  | string;

export interface RawExercise {
  id: string;
  n: string; // English name
  zh?: string; // Chinese name
  b: string; // Body part
  eq: string; // Equipment
  t: string; // Target muscle
  s?: string[]; // Steps / Instructions
  g?: string; // Gif path relative to CDN
  img?: string; // Image path relative to CDN
}

export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  type: SetType;
  kg: number;
  reps: number;
  completed: boolean;
  rpe?: number;
  notes?: string;
  previousKg?: number;
  previousReps?: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  exerciseZh?: string;
  bodyPart: string;
  equipment?: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'maxWeight' | 'max1RM' | 'maxVolume';
  value: number;
  reps?: number;
  date: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  date: string; // ISO string e.g. 2026-10-18T12:00:00.000Z
  startTime: number; // Unix timestamp
  endTime?: number;
  duration: number; // in seconds
  exercises: WorkoutExercise[];
  totalVolume: number; // sum of (kg * reps) for completed sets
  completedSets: number;
  templateId?: string;
  notes?: string;
  newPrs?: PersonalRecord[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  targetDay?: number; // 0=Sun, 1=Mon, ..., 6=Sat
  exercises: {
    exerciseId: string;
    exerciseName: string;
    exerciseZh?: string;
    defaultSets?: number;
    targetReps?: number;
    targetKg?: number;
  }[];
}

export type WeekSchedule = Record<number, string | null>; // 0=Sun, 1=Mon, ..., 6=Sat -> templateId or null

export interface UserSettings {
  language: 'zh' | 'en';
  defaultRestSeconds: number;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  weightUnit: 'kg' | 'lbs';
  autoStartRest: boolean;
  timerVoiceCue: boolean;
}
