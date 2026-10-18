import { RawExercise, UserSettings, WeekSchedule, WorkoutExercise, WorkoutSession, WorkoutTemplate } from '../types/gym';
import rawExercisesData from '../data/exercises.json';

export const RAW_EXERCISES: RawExercise[] = rawExercisesData as RawExercise[];

// Exercise Map by ID for quick O(1) lookups
export const EXERCISE_MAP = new Map<string, RawExercise>();
for (const ex of RAW_EXERCISES) {
  EXERCISE_MAP.set(ex.id, ex);
}

const STORAGE_KEYS = {
  SESSIONS: 'gymlog.v1.sessions',
  TEMPLATES: 'gymlog.v1.templates',
  SCHEDULE: 'gymlog.v1.schedule',
  SETTINGS: 'gymlog.v1.settings',
  ACTIVE_WORKOUT: 'gymlog.v1.active_workout',
  REST_CONFIG: 'gymlog.v1.rest_config',
  REST_SOUND: 'gymlog.restSound',
};

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'zh',
  defaultRestSeconds: 90,
  soundEnabled: true,
  vibrateEnabled: true,
  weightUnit: 'kg',
  autoStartRest: true,
  timerVoiceCue: false,
};

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tpl-push',
    name: '推日 (Push Day)',
    description: '胸大肌、三角肌前束/中束、肱三头肌高强度泵感组合',
    targetDay: 1, // Monday
    exercises: [
      { exerciseId: '0025', exerciseName: 'barbell bench press', exerciseZh: '杠铃卧推', defaultSets: 4, targetReps: 8, targetKg: 70 },
      { exerciseId: '0047', exerciseName: 'incline dumbbell press', exerciseZh: '上斜哑铃卧推', defaultSets: 4, targetReps: 10, targetKg: 24 },
      { exerciseId: '0379', exerciseName: 'dumbbell shoulder press', exerciseZh: '哑铃推肩', defaultSets: 3, targetReps: 10, targetKg: 18 },
      { exerciseId: '0283', exerciseName: 'cable lateral raise', exerciseZh: '绳索侧平举', defaultSets: 4, targetReps: 15, targetKg: 7.5 },
      { exerciseId: '0860', exerciseName: 'triceps pushdown', exerciseZh: '绳索下压', defaultSets: 4, targetReps: 12, targetKg: 25 },
    ],
  },
  {
    id: 'tpl-pull',
    name: '拉日 (Pull Day)',
    description: '背阔肌、上背斜方肌、肱二头肌立体打造',
    targetDay: 3, // Wednesday
    exercises: [
      { exerciseId: '0032', exerciseName: 'barbell deadlift', exerciseZh: '传统硬拉', defaultSets: 4, targetReps: 6, targetKg: 100 },
      { exerciseId: '0150', exerciseName: 'pull-up', exerciseZh: '引体向上', defaultSets: 4, targetReps: 8, targetKg: 0 },
      { exerciseId: '0027', exerciseName: 'barbell bent over row', exerciseZh: '俯身杠铃划船', defaultSets: 4, targetReps: 10, targetKg: 60 },
      { exerciseId: '0031', exerciseName: 'barbell curl', exerciseZh: '杠铃弯举', defaultSets: 4, targetReps: 10, targetKg: 30 },
      { exerciseId: '0434', exerciseName: 'face pull', exerciseZh: '面拉', defaultSets: 3, targetReps: 15, targetKg: 17.5 },
    ],
  },
  {
    id: 'tpl-legs',
    name: '腿日 (Leg Day)',
    description: '深蹲主导，股四头肌、腘绳肌与臀部核心力量强化',
    targetDay: 5, // Friday
    exercises: [
      { exerciseId: '0043', exerciseName: 'barbell squat', exerciseZh: '杠铃深蹲', defaultSets: 4, targetReps: 8, targetKg: 85 },
      { exerciseId: '0085', exerciseName: 'romanian deadlift', exerciseZh: '罗马尼亚硬拉', defaultSets: 4, targetReps: 10, targetKg: 75 },
      { exerciseId: '0599', exerciseName: 'leg press', exerciseZh: '倒蹬机腿举', defaultSets: 4, targetReps: 12, targetKg: 160 },
      { exerciseId: '0585', exerciseName: 'standing calf raise', exerciseZh: '站姿提踵', defaultSets: 4, targetReps: 15, targetKg: 50 },
    ],
  },
  {
    id: 'tpl-upper',
    name: '上肢综合 (Upper Focus)',
    description: '上下胸、背部厚度与手臂弱点全面补强',
    targetDay: 6, // Saturday
    exercises: [
      { exerciseId: '0025', exerciseName: 'barbell bench press', exerciseZh: '杠铃卧推', defaultSets: 3, targetReps: 8, targetKg: 65 },
      { exerciseId: '0027', exerciseName: 'barbell bent over row', exerciseZh: '俯身杠铃划船', defaultSets: 3, targetReps: 10, targetKg: 55 },
      { exerciseId: '0379', exerciseName: 'dumbbell shoulder press', exerciseZh: '哑铃推肩', defaultSets: 3, targetReps: 10, targetKg: 16 },
      { exerciseId: '0031', exerciseName: 'barbell curl', exerciseZh: '杠铃弯举', defaultSets: 3, targetReps: 12, targetKg: 25 },
    ],
  },
];

export const DEFAULT_SCHEDULE: WeekSchedule = {
  0: null, // Sunday: Rest
  1: 'tpl-push', // Monday
  2: null, // Tuesday: Rest
  3: 'tpl-pull', // Wednesday
  4: null, // Thursday: Rest
  5: 'tpl-legs', // Friday
  6: 'tpl-upper', // Saturday
};

const LEGACY_STORE_KEY = 'gymlog.v1';
const MIGRATED_FLAG = 'gymlog.v1.migrated';

function asNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function convertLegacyWorkout(raw: any): WorkoutSession {
  const started = asNumber(raw?.started || raw?.startTime) || Date.now();
  const ended = raw?.ended || raw?.endTime;
  const exercises: WorkoutExercise[] = (raw?.exercises || []).map((ex: any, exIndex: number) => ({
    exerciseId: String(ex.id || ex.exerciseId || `ex-${exIndex}`),
    exerciseName: ex.name || ex.exerciseName || ex.n || '',
    exerciseZh: ex.zh || ex.exerciseZh || '',
    bodyPart: ex.b || ex.bodyPart || '',
    equipment: ex.eq || ex.equipment || '',
    sets: (ex.sets || []).map((set: any, setIndex: number) => ({
      id: String(set.id || `set-${raw?.id || started}-${exIndex}-${setIndex}`),
      setNumber: setIndex + 1,
      type: 'normal' as const,
      kg: asNumber(set.kg),
      reps: asNumber(set.reps),
      completed: Boolean(set.completed || set.done),
    })),
  }));
  let totalVolume = 0;
  let completedSets = 0;
  exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      if (!set.completed) return;
      completedSets += 1;
      totalVolume += set.kg * set.reps;
    });
  });
  return {
    id: String(raw?.id || `session-${started}`),
    title: raw?.title || '训练',
    date: new Date(started).toISOString(),
    startTime: started,
    endTime: ended ? asNumber(ended) : undefined,
    duration: asNumber(raw?.duration) || (ended ? Math.max(0, Math.round((asNumber(ended) - started) / 1000)) : 0),
    exercises,
    totalVolume: raw?.totalVolume != null ? asNumber(raw.totalVolume) : totalVolume,
    completedSets: raw?.completedSets != null ? asNumber(raw.completedSets) : completedSets,
    templateId: raw?.templateId,
  };
}

export function convertLegacyTemplate(raw: any): WorkoutTemplate {
  return {
    id: String(raw?.id || `tpl-${Date.now()}`),
    name: raw?.name || '模板',
    description: raw?.description || '',
    exercises: (raw?.exercises || []).map((ex: any) => ({
      exerciseId: String(ex.id || ex.exerciseId || ''),
      exerciseName: ex.name || ex.exerciseName || ex.n || '',
      exerciseZh: ex.zh || ex.exerciseZh || '',
      defaultSets: asNumber(ex.defaultSets) || 3,
      targetReps: asNumber(ex.targetReps) || 8,
      targetKg: asNumber(ex.targetKg),
    })),
  };
}

export function convertLegacySchedule(raw: unknown): WeekSchedule | null {
  if (!Array.isArray(raw) || raw.length !== 7) return null;
  const schedule: WeekSchedule = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
  raw.forEach((id, day) => {
    schedule[day] = id ? String(id) : null;
  });
  return schedule;
}

function migrateLegacyStore() {
  try {
    if (localStorage.getItem(MIGRATED_FLAG)) return;
    const raw = localStorage.getItem(LEGACY_STORE_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATED_FLAG, '1');
      return;
    }
    const data = JSON.parse(raw);
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS) && Array.isArray(data.workouts)) {
      saveSessions(data.workouts.map(convertLegacyWorkout));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEMPLATES)) {
      const templates = Array.isArray(data.templates) ? data.templates.map(convertLegacyTemplate) : [];
      saveTemplates(templates);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
      saveSchedule(convertLegacySchedule(data.schedule) || { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null });
    }
    const settings = loadSettings();
    const rest = Number(localStorage.getItem('gymlog.rest'));
    if (rest) settings.defaultRestSeconds = rest;
    const lang = localStorage.getItem('gymlog.lang');
    if (lang === 'en' || lang === 'zh') settings.language = lang;
    const sound = localStorage.getItem('gymlog.restSound');
    if (sound === '0' || sound === '1') settings.soundEnabled = sound === '1';
    saveSettings(settings);
    localStorage.setItem(MIGRATED_FLAG, '1');
  } catch (err) {
    console.error('Failed to migrate gymlog.v1', err);
  }
}

// Storage Helpers
export function loadSessions(): WorkoutSession[] {
  migrateLegacyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSessions(sessions: WorkoutSession[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
}

export function loadTemplates(): WorkoutTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) {
      saveTemplates(DEFAULT_TEMPLATES);
      return DEFAULT_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_TEMPLATES;
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

export function saveTemplates(templates: WorkoutTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save templates:', e);
  }
}

export function loadSchedule(): WeekSchedule {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (!raw) {
      saveSchedule(DEFAULT_SCHEDULE);
      return DEFAULT_SCHEDULE;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

export function saveSchedule(schedule: WeekSchedule) {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  } catch (e) {
    console.error('Failed to save schedule:', e);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadActiveWorkout(): WorkoutSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveWorkout(workout: WorkoutSession | null) {
  try {
    if (workout) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(workout));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    }
  } catch (e) {
    console.error('Failed to save active workout:', e);
  }
}

/**
 * Get the most recent completed performance (weight & reps) for an exercise
 */
export function getLastPerformance(
  exerciseId: string,
  sessions: WorkoutSession[]
): { sets: { kg: number; reps: number }[]; date: string } | null {
  // Sort sessions newest first
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const session of sorted) {
    const found = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (found && found.sets.some((s) => s.completed && s.kg > 0)) {
      const validSets = found.sets
        .filter((s) => s.completed && s.kg > 0)
        .map((s) => ({ kg: s.kg, reps: s.reps }));
      if (validSets.length > 0) {
        return { sets: validSets, date: session.date };
      }
    }
  }

  return null;
}

/**
 * Seed realistic sample workouts for rich testing and immediate dashboard visualization
 */
export function seedRealisticHistory(): WorkoutSession[] {
  const sessions: WorkoutSession[] = [];
  const now = new Date();

  // Past 8 weeks of workouts: 3-4 days per week
  const pastDays = [
    54, 52, 49, 47, 45, 42, 40, 38, 35, 33, 31, 28, 26, 24, 21, 19, 17, 14, 12, 10, 7, 5, 3, 1,
  ];

  const pushEx = { id: '0025', name: 'barbell bench press', zh: '杠铃卧推', b: 'chest', eq: 'barbell' };
  const incEx = { id: '0047', name: 'incline dumbbell press', zh: '上斜哑铃卧推', b: 'chest', eq: 'dumbbell' };
  const sqEx = { id: '0043', name: 'barbell squat', zh: '杠铃深蹲', b: 'upper legs', eq: 'barbell' };
  const rdlEx = { id: '0085', name: 'romanian deadlift', zh: '罗马尼亚硬拉', b: 'upper legs', eq: 'barbell' };
  const dlEx = { id: '0032', name: 'barbell deadlift', zh: '传统硬拉', b: 'back', eq: 'barbell' };
  const rowEx = { id: '0027', name: 'barbell bent over row', zh: '俯身杠铃划船', b: 'back', eq: 'barbell' };

  pastDays.forEach((daysAgo, idx) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    d.setHours(18, 30, 0, 0);

    const isPush = idx % 3 === 0;
    const isPull = idx % 3 === 1;

    // Gradual progression over time
    const progressFactor = (idx / pastDays.length) * 10;

    let title = '推日 (Push Day)';
    let exercises: any[] = [];

    if (isPush) {
      title = '推日 (胸/肩/三头)';
      const benchKg = Math.round((60 + progressFactor) * 2) / 2;
      const incKg = Math.round((20 + progressFactor * 0.4) * 2) / 2;

      exercises = [
        {
          exerciseId: pushEx.id,
          exerciseName: pushEx.name,
          exerciseZh: pushEx.zh,
          bodyPart: pushEx.b,
          equipment: pushEx.eq,
          sets: [
            { id: `s-1`, setNumber: 1, type: 'warmup', kg: 40, reps: 10, completed: true },
            { id: `s-2`, setNumber: 2, type: 'normal', kg: benchKg, reps: 8, completed: true },
            { id: `s-3`, setNumber: 3, type: 'normal', kg: benchKg, reps: 8, completed: true },
            { id: `s-4`, setNumber: 4, type: 'normal', kg: benchKg, reps: 7, completed: true },
          ],
        },
        {
          exerciseId: incEx.id,
          exerciseName: incEx.name,
          exerciseZh: incEx.zh,
          bodyPart: incEx.b,
          equipment: incEx.eq,
          sets: [
            { id: `s-5`, setNumber: 1, type: 'normal', kg: incKg, reps: 10, completed: true },
            { id: `s-6`, setNumber: 2, type: 'normal', kg: incKg, reps: 10, completed: true },
            { id: `s-7`, setNumber: 3, type: 'normal', kg: incKg, reps: 8, completed: true },
          ],
        },
      ];
    } else if (isPull) {
      title = '拉日 (背/二头)';
      const dlKg = Math.round((90 + progressFactor * 1.5) * 2) / 2;
      const rowKg = Math.round((50 + progressFactor * 0.8) * 2) / 2;

      exercises = [
        {
          exerciseId: dlEx.id,
          exerciseName: dlEx.name,
          exerciseZh: dlEx.zh,
          bodyPart: dlEx.b,
          equipment: dlEx.eq,
          sets: [
            { id: `s-8`, setNumber: 1, type: 'warmup', kg: 60, reps: 8, completed: true },
            { id: `s-9`, setNumber: 2, type: 'normal', kg: dlKg, reps: 6, completed: true },
            { id: `s-10`, setNumber: 3, type: 'normal', kg: dlKg, reps: 6, completed: true },
            { id: `s-11`, setNumber: 4, type: 'normal', kg: dlKg, reps: 5, completed: true },
          ],
        },
        {
          exerciseId: rowEx.id,
          exerciseName: rowEx.name,
          exerciseZh: rowEx.zh,
          bodyPart: rowEx.b,
          equipment: rowEx.eq,
          sets: [
            { id: `s-12`, setNumber: 1, type: 'normal', kg: rowKg, reps: 10, completed: true },
            { id: `s-13`, setNumber: 2, type: 'normal', kg: rowKg, reps: 10, completed: true },
            { id: `s-14`, setNumber: 3, type: 'normal', kg: rowKg, reps: 9, completed: true },
          ],
        },
      ];
    } else {
      title = '腿日 (深蹲/硬拉)';
      const sqKg = Math.round((75 + progressFactor * 1.2) * 2) / 2;
      const rdlKg = Math.round((65 + progressFactor * 0.9) * 2) / 2;

      exercises = [
        {
          exerciseId: sqEx.id,
          exerciseName: sqEx.name,
          exerciseZh: sqEx.zh,
          bodyPart: sqEx.b,
          equipment: sqEx.eq,
          sets: [
            { id: `s-15`, setNumber: 1, type: 'warmup', kg: 50, reps: 10, completed: true },
            { id: `s-16`, setNumber: 2, type: 'normal', kg: sqKg, reps: 8, completed: true },
            { id: `s-17`, setNumber: 3, type: 'normal', kg: sqKg, reps: 8, completed: true },
            { id: `s-18`, setNumber: 4, type: 'normal', kg: sqKg, reps: 7, completed: true },
          ],
        },
        {
          exerciseId: rdlEx.id,
          exerciseName: rdlEx.name,
          exerciseZh: rdlEx.zh,
          bodyPart: rdlEx.b,
          equipment: rdlEx.eq,
          sets: [
            { id: `s-19`, setNumber: 1, type: 'normal', kg: rdlKg, reps: 10, completed: true },
            { id: `s-20`, setNumber: 2, type: 'normal', kg: rdlKg, reps: 10, completed: true },
            { id: `s-21`, setNumber: 3, type: 'normal', kg: rdlKg, reps: 8, completed: true },
          ],
        },
      ];
    }

    let totalVolume = 0;
    let completedSets = 0;
    exercises.forEach((ex) => {
      ex.sets.forEach((s: any) => {
        if (s.completed) {
          totalVolume += s.kg * s.reps;
          completedSets++;
        }
      });
    });

    sessions.push({
      id: `session-${idx}-${d.getTime()}`,
      title,
      date: d.toISOString(),
      startTime: d.getTime(),
      endTime: d.getTime() + 54 * 60 * 1000,
      duration: 54 * 60 + Math.floor(Math.random() * 600),
      exercises,
      totalVolume,
      completedSets,
    });
  });

  saveSessions(sessions);
  return sessions;
}
