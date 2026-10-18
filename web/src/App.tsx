import React, { useState, useEffect } from 'react';
import { RawExercise, UserSettings, WeekSchedule, WorkoutSession, WorkoutTemplate, WorkoutExercise } from './types/gym';
import {
  convertLegacySchedule,
  convertLegacyTemplate,
  convertLegacyWorkout,
  loadSessions,
  saveSessions,
  loadTemplates,
  saveTemplates,
  loadSchedule,
  saveSchedule,
  loadSettings,
  saveSettings,
  loadActiveWorkout,
  saveActiveWorkout,
  seedRealisticHistory,
  EXERCISE_MAP,
  getLastPerformance,
} from './utils/storage';
import { THEMES, ThemeStyle } from './types/theme';
import { getSavedTheme, saveTheme } from './utils/theme';
import { Navbar, NavTab } from './components/Navbar';
import { RestTimerBar } from './components/RestTimerBar';
import { ThemeSelector } from './components/ThemeSelector';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { ExerciseSelectorModal } from './components/ExerciseSelectorModal';
import { PlateCalculatorModal } from './components/PlateCalculatorModal';
import { OneRepMaxModal } from './components/OneRepMaxModal';
import { WorkoutSummaryModal } from './components/WorkoutSummaryModal';

import { TodayWorkoutView } from './views/TodayWorkoutView';
import { ActiveWorkoutView } from './views/ActiveWorkoutView';
import { PlanView } from './views/PlanView';
import { ExerciseLibraryView } from './views/ExerciseLibraryView';
import { HistoryView } from './views/HistoryView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';
import { detectWorkoutPRs } from './utils/calculations';
import { playCountdownTick, playRestCompleteSound } from './utils/audio';

export default function App() {
  // Theme State
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>(getSavedTheme);
  const theme = THEMES[themeStyle] || THEMES.eclipse;
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const handleSelectTheme = (newTheme: ThemeStyle) => {
    setThemeStyle(newTheme);
    saveTheme(newTheme);
  };

  // Core Data States
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => loadSessions());

  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => loadTemplates());
  const [schedule, setSchedule] = useState<WeekSchedule>(() => loadSchedule());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() => loadActiveWorkout());

  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('workout');

  // Timers
  const [activeElapsedSeconds, setActiveElapsedSeconds] = useState(0);
  const [restRemainingSeconds, setRestRemainingSeconds] = useState(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState(0);
  const [isRestActive, setIsRestActive] = useState(false);

  // Modals
  const [previewExercise, setPreviewExercise] = useState<RawExercise | null>(null);
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [isPlateCalcOpen, setIsPlateCalcOpen] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState(100);
  const [is1RMCalcOpen, setIs1RMCalcOpen] = useState(false);
  const [oneRMWeight, setOneRMWeight] = useState(80);
  const [oneRMReps, setOneRMReps] = useState(8);
  const [summarySession, setSummarySession] = useState<WorkoutSession | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // 1. Workout Elapsed Timer
  useEffect(() => {
    if (!activeWorkout) {
      setActiveElapsedSeconds(0);
      return;
    }

    const calcElapsed = () => {
      const start = activeWorkout.startTime || Date.now();
      const elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
      setActiveElapsedSeconds(elapsed);
    };

    calcElapsed();
    const interval = setInterval(calcElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  // 2. Rest Timer Countdown
  useEffect(() => {
    if (!isRestActive || restRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRestRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRestActive(false);
          if (settings.soundEnabled) {
            playRestCompleteSound();
          }
          return 0;
        }

        // Countdown tick on last 3 seconds
        if (prev <= 4 && prev > 1 && settings.soundEnabled) {
          playCountdownTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRestActive, restRemainingSeconds, settings.soundEnabled]);

  // Save changes to persistent storage
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    saveSchedule(schedule);
  }, [schedule]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveActiveWorkout(activeWorkout);
  }, [activeWorkout]);

  // Start rest timer helper
  const handleTriggerRestTimer = (customDuration?: number) => {
    if (!settings.autoStartRest && !customDuration) return;
    const dur = customDuration || settings.defaultRestSeconds;
    setRestTotalSeconds(dur);
    setRestRemainingSeconds(dur);
    setIsRestActive(true);
  };

  const handleAddRestSeconds = (delta: number) => {
    setRestRemainingSeconds((prev) => Math.max(0, prev + delta));
    setRestTotalSeconds((prev) => Math.max(prev, prev + delta));
    if (!isRestActive) setIsRestActive(true);
  };

  const handleSkipRest = () => {
    setIsRestActive(false);
    setRestRemainingSeconds(0);
  };

  // Workout Action Handlers
  const handleStartTemplateWorkout = (tpl: WorkoutTemplate) => {
    const now = Date.now();
    const workoutExercises: WorkoutExercise[] = tpl.exercises.map((item) => {
      const rawEx = EXERCISE_MAP.get(item.exerciseId);
      const lastPerf = getLastPerformance(item.exerciseId, sessions);

      const numSets = item.defaultSets || 4;
      const sets = Array.from({ length: numSets }, (_, i) => ({
        id: `set-${now}-${item.exerciseId}-${i}`,
        setNumber: i + 1,
        type: 'normal' as const,
        kg: lastPerf?.sets[i]?.kg ?? item.targetKg ?? 50,
        reps: lastPerf?.sets[i]?.reps ?? item.targetReps ?? 8,
        completed: false,
      }));

      return {
        exerciseId: item.exerciseId,
        exerciseName: item.exerciseName,
        exerciseZh: item.exerciseZh,
        bodyPart: rawEx?.b || 'chest',
        equipment: rawEx?.eq || 'barbell',
        sets,
      };
    });

    const newWorkout: WorkoutSession = {
      id: `session-${now}`,
      title: tpl.name,
      date: new Date().toISOString(),
      startTime: now,
      duration: 0,
      exercises: workoutExercises,
      totalVolume: 0,
      completedSets: 0,
      templateId: tpl.id,
    };

    setActiveWorkout(newWorkout);
    setCurrentTab('workout');
  };

  const handleStartEmptyWorkout = () => {
    const now = Date.now();
    const newWorkout: WorkoutSession = {
      id: `session-${now}`,
      title: '自由训练',
      date: new Date().toISOString(),
      startTime: now,
      duration: 0,
      exercises: [],
      totalVolume: 0,
      completedSets: 0,
    };

    setActiveWorkout(newWorkout);
    setCurrentTab('workout');
  };

  const handleAddExerciseToActiveWorkout = (raw: RawExercise) => {
    if (!activeWorkout) return;

    const now = Date.now();
    const lastPerf = getLastPerformance(raw.id, sessions);

    const defaultKg = lastPerf?.sets[0]?.kg ?? 40;
    const defaultReps = lastPerf?.sets[0]?.reps ?? 10;

    const newEx: WorkoutExercise = {
      exerciseId: raw.id,
      exerciseName: raw.n,
      exerciseZh: raw.zh,
      bodyPart: raw.b,
      equipment: raw.eq,
      sets: [
        {
          id: `set-${now}-1`,
          setNumber: 1,
          type: 'normal',
          kg: defaultKg,
          reps: defaultReps,
          completed: false,
        },
        {
          id: `set-${now}-2`,
          setNumber: 2,
          type: 'normal',
          kg: defaultKg,
          reps: defaultReps,
          completed: false,
        },
        {
          id: `set-${now}-3`,
          setNumber: 3,
          type: 'normal',
          kg: defaultKg,
          reps: defaultReps,
          completed: false,
        },
      ],
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newEx],
    });
  };

  const handleFinishWorkout = () => {
    if (!activeWorkout) return;

    let totalVol = 0;
    let completedSets = 0;

    activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) {
          completedSets++;
          totalVol += (s.kg || 0) * (s.reps || 0);
        }
      });
    });

    const finalSession: WorkoutSession = {
      ...activeWorkout,
      endTime: Date.now(),
      duration: activeElapsedSeconds,
      totalVolume: totalVol,
      completedSets,
    };

    // Detect PRs
    const prs = detectWorkoutPRs(finalSession, sessions);
    finalSession.newPrs = prs;

    // Save to historical sessions
    setSessions((prev) => [finalSession, ...prev]);

    // Clear active workout & rest
    setActiveWorkout(null);
    setIsRestActive(false);

    // Open celebration summary
    setSummarySession(finalSession);
    setIsSummaryOpen(true);
  };

  const handleCancelWorkout = () => {
    setActiveWorkout(null);
    setIsRestActive(false);
  };

  // Export & Import Handlers
  const handleExportData = () => {
    const backup = {
      version: '1.6.1',
      exportDate: new Date().toISOString(),
      sessions,
      templates,
      schedule,
      settings,
      themeStyle,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GymLog-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.store && Array.isArray(data.store.workouts)) {
        setSessions(data.store.workouts.map(convertLegacyWorkout));
        if (Array.isArray(data.store.templates)) setTemplates(data.store.templates.map(convertLegacyTemplate));
        const legacySchedule = convertLegacySchedule(data.store.schedule);
        if (legacySchedule) setSchedule(legacySchedule);
        if (data.rest != null) setSettings((prev) => ({ ...prev, defaultRestSeconds: Number(data.rest) || prev.defaultRestSeconds }));
        if (data.lang === 'zh' || data.lang === 'en') setSettings((prev) => ({ ...prev, language: data.lang }));
        if (data.restSound === '0' || data.restSound === '1') {
          setSettings((prev) => ({ ...prev, soundEnabled: data.restSound === '1' }));
        }
        return true;
      }
      if (data.sessions && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      }
      if (data.templates && Array.isArray(data.templates)) {
        setTemplates(data.templates);
      }
      if (data.schedule && typeof data.schedule === 'object') {
        setSchedule(data.schedule);
      }
      if (data.settings && typeof data.settings === 'object') {
        setSettings({ ...settings, ...data.settings });
      }
      if (data.themeStyle && THEMES[data.themeStyle as ThemeStyle]) {
        handleSelectTheme(data.themeStyle as ThemeStyle);
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSeedSampleData = () => {
    const sample = seedRealisticHistory();
    setSessions(sample);
  };

  const handleClearAllData = () => {
    setSessions([]);
    setActiveWorkout(null);
    localStorage.clear();
  };

  const handleSaveAsTemplateFromSummary = (name: string) => {
    if (!summarySession) return;
    const newTpl: WorkoutTemplate = {
      id: `tpl-${Date.now()}`,
      name,
      description: `基于 ${new Date(summarySession.date).toLocaleDateString()} 训练生成`,
      exercises: summarySession.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        exerciseZh: ex.exerciseZh,
        defaultSets: ex.sets.length,
        targetReps: ex.sets[0]?.reps || 8,
        targetKg: ex.sets[0]?.kg || 50,
      })),
    };
    setTemplates((prev) => [...prev, newTpl]);
  };

  const handleUpdateActiveWorkout = (updater: (prev: WorkoutSession) => WorkoutSession) => {
    setActiveWorkout((prev) => (prev ? updater(prev) : null));
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-500"
      style={{
        backgroundColor: theme.bgCanvas,
        color: theme.isDark ? '#f8fafc' : '#0f172a',
      }}
    >
      {/* Strict 3-zone Header Navigation & Mobile Tab Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeWorkout={activeWorkout}
        activeElapsedSeconds={activeElapsedSeconds}
        onOpenActiveWorkout={() => setCurrentTab('workout')}
        onOpenPlateCalc={() => {
          setPlateCalcWeight(100);
          setIsPlateCalcOpen(true);
        }}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        theme={theme}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        {currentTab === 'workout' && (
          activeWorkout ? (
            <ActiveWorkoutView
              workout={activeWorkout}
              elapsedSeconds={activeElapsedSeconds}
              historySessions={sessions}
              onUpdateWorkout={handleUpdateActiveWorkout}
              onFinishWorkout={handleFinishWorkout}
              onCancelWorkout={handleCancelWorkout}
              onOpenExerciseSelector={() => setIsExerciseSelectorOpen(true)}
              onPreviewExercise={(ex) => setPreviewExercise(ex)}
              onTriggerRestTimer={handleTriggerRestTimer}
            />
          ) : (
            <TodayWorkoutView
              schedule={schedule}
              templates={templates}
              sessions={sessions}
              onStartTemplateWorkout={handleStartTemplateWorkout}
              onStartEmptyWorkout={handleStartEmptyWorkout}
              onNavigateToTab={(tab) => setCurrentTab(tab as NavTab)}
              onSelectTemplate={(tpl) => {
                handleStartTemplateWorkout(tpl);
              }}
              onOpenSessionDetail={(session) => {
                setCurrentTab('history');
              }}
              theme={theme}
              onOpenThemeModal={() => setIsThemeModalOpen(true)}
              onOpen1RMCalc={() => setIs1RMCalcOpen(true)}
              onOpenPlateCalc={() => setIsPlateCalcOpen(true)}
            />
          )
        )}

        {currentTab === 'plan' && (
          <PlanView
            schedule={schedule}
            templates={templates}
            onUpdateSchedule={setSchedule}
            onSaveTemplate={(tpl) => {
              setTemplates((prev) => {
                const idx = prev.findIndex((t) => t.id === tpl.id);
                if (idx >= 0) {
                  const next = [...prev];
                  next[idx] = tpl;
                  return next;
                }
                return [...prev, tpl];
              });
            }}
            onDeleteTemplate={(id) => {
              setTemplates((prev) => prev.filter((t) => t.id !== id));
            }}
            onStartTemplateWorkout={handleStartTemplateWorkout}
            onOpenExerciseSelector={() => setIsExerciseSelectorOpen(true)}
          />
        )}

        {currentTab === 'library' && (
          <ExerciseLibraryView
            onSelectExerciseToPreview={(ex) => setPreviewExercise(ex)}
            historySessions={sessions}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            sessions={sessions}
            onDeleteSession={(id) => {
              setSessions((prev) => prev.filter((s) => s.id !== id));
            }}
            onStartEmptyWorkout={handleStartEmptyWorkout}
            onSeedSampleData={handleSeedSampleData}
          />
        )}

        {currentTab === 'stats' && (
          <StatsView
            sessions={sessions}
            onOpen1RMCalc={(w, r) => {
              if (w) setOneRMWeight(w);
              if (r) setOneRMReps(r);
              setIs1RMCalcOpen(true);
            }}
            onOpenPlateCalc={(w) => {
              if (w) setPlateCalcWeight(w);
              setIsPlateCalcOpen(true);
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onSeedSampleData={handleSeedSampleData}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Floating Rest Timer Bar */}
      <RestTimerBar
        remainingSeconds={restRemainingSeconds}
        totalSeconds={restTotalSeconds}
        isActive={isRestActive}
        onAddSeconds={handleAddRestSeconds}
        onSkip={handleSkipRest}
        onClose={() => setIsRestActive(false)}
      />

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={themeStyle}
        onSelectTheme={handleSelectTheme}
      />

      {/* Modals & Dialogs */}
      {previewExercise && (
        <ExerciseDetailModal
          exercise={previewExercise}
          onClose={() => setPreviewExercise(null)}
          onAddToWorkout={
            activeWorkout
              ? (ex) => {
                  handleAddExerciseToActiveWorkout(ex);
                  setCurrentTab('workout');
                }
              : undefined
          }
          historySessions={sessions}
        />
      )}

      {isExerciseSelectorOpen && (
        <ExerciseSelectorModal
          isOpen={isExerciseSelectorOpen}
          onClose={() => setIsExerciseSelectorOpen(false)}
          onSelectExercise={(ex) => {
            if (activeWorkout) {
              handleAddExerciseToActiveWorkout(ex);
            } else {
              setPreviewExercise(ex);
            }
          }}
          onPreviewExercise={(ex) => setPreviewExercise(ex)}
          alreadySelectedIds={activeWorkout ? activeWorkout.exercises.map((e) => e.exerciseId) : []}
        />
      )}

      {isPlateCalcOpen && (
        <PlateCalculatorModal
          isOpen={isPlateCalcOpen}
          onClose={() => setIsPlateCalcOpen(false)}
          initialWeight={plateCalcWeight}
        />
      )}

      {is1RMCalcOpen && (
        <OneRepMaxModal
          isOpen={is1RMCalcOpen}
          onClose={() => setIs1RMCalcOpen(false)}
          defaultWeight={oneRMWeight}
          defaultReps={oneRMReps}
        />
      )}

      {isSummaryOpen && summarySession && (
        <WorkoutSummaryModal
          isOpen={isSummaryOpen}
          session={summarySession}
          onClose={() => setIsSummaryOpen(false)}
          onSaveAsTemplate={handleSaveAsTemplateFromSummary}
        />
      )}
    </div>
  );
}
