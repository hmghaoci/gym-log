import React, { useState } from 'react';
import { Play, Pause, Plus, Trash2, Check, Clock, Flame, Dumbbell, Sparkles, ChevronDown, ChevronUp, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import { RawExercise, SetType, WorkoutExercise, WorkoutSession, WorkoutSet } from '../types/gym';
import { formatDurationTimer, formatVolume } from '../utils/calculations';
import { playSetCompleteSound } from '../utils/audio';
import { getBodyPartName, getMuscleTargetName } from '../utils/translations';
import { EXERCISE_MAP, getLastPerformance } from '../utils/storage';
import { ThemeConfig } from '../types/theme';

interface ActiveWorkoutViewProps {
  workout: WorkoutSession;
  elapsedSeconds: number;
  historySessions: WorkoutSession[];
  onUpdateWorkout: (updater: (prev: WorkoutSession) => WorkoutSession) => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
  onOpenExerciseSelector: () => void;
  onPreviewExercise: (ex: RawExercise) => void;
  onTriggerRestTimer: (customDuration?: number) => void;
  theme: ThemeConfig;
}

export const ActiveWorkoutView: React.FC<ActiveWorkoutViewProps> = ({
  workout,
  elapsedSeconds,
  historySessions,
  onUpdateWorkout,
  onFinishWorkout,
  onCancelWorkout,
  onOpenExerciseSelector,
  onPreviewExercise,
  onTriggerRestTimer,
  theme,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Compute live active volume and finished sets
  let liveVolume = 0;
  let liveCompletedSets = 0;
  let totalSets = 0;

  workout.exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      totalSets++;
      if (set.completed) {
        liveCompletedSets++;
        liveVolume += (set.kg || 0) * (set.reps || 0);
      }
    });
  });

  // Handlers for Sets
  const handleToggleSetComplete = (exIdx: number, setIdx: number) => {
    onUpdateWorkout((prev) => {
      const next = { ...prev };
      const ex = next.exercises[exIdx];
      const targetSet = ex.sets[setIdx];
      const isCompleting = !targetSet.completed;

      targetSet.completed = isCompleting;

      if (isCompleting) {
        playSetCompleteSound();
        onTriggerRestTimer();
      }

      return next;
    });
  };

  const handleUpdateSetValue = (
    exIdx: number,
    setIdx: number,
    field: 'kg' | 'reps' | 'type',
    val: any
  ) => {
    onUpdateWorkout((prev) => {
      const next = { ...prev };
      const targetSet = next.exercises[exIdx].sets[setIdx];
      (targetSet as any)[field] = val;
      return next;
    });
  };

  const handleAdjustSetValue = (
    exIdx: number,
    setIdx: number,
    field: 'kg' | 'reps',
    delta: number
  ) => {
    onUpdateWorkout((prev) => {
      const next = { ...prev };
      const targetSet = next.exercises[exIdx].sets[setIdx];
      const current = Number(targetSet[field]) || 0;
      targetSet[field] = Math.max(0, Math.round((current + delta) * 10) / 10);
      return next;
    });
  };

  const handleAddSet = (exIdx: number) => {
    onUpdateWorkout((prev) => {
      const next = { ...prev };
      const ex = next.exercises[exIdx];
      const lastSet = ex.sets[ex.sets.length - 1];

      const newSet: WorkoutSet = {
        id: `set-${Date.now()}-${Math.random()}`,
        setNumber: ex.sets.length + 1,
        type: 'normal',
        kg: lastSet ? lastSet.kg : 0,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
      };

      ex.sets.push(newSet);
      return next;
    });
  };

  const handleDeleteSet = (exIdx: number, setIdx: number) => {
    onUpdateWorkout((prev) => {
      const next = { ...prev };
      const ex = next.exercises[exIdx];
      ex.sets.splice(setIdx, 1);
      // Renumber sets
      ex.sets.forEach((s, i) => {
        s.setNumber = i + 1;
      });
      return next;
    });
  };

  const handleDeleteExercise = (exIdx: number) => {
    onUpdateWorkout((prev) => {
      const next = { ...prev };
      next.exercises.splice(exIdx, 1);
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-28 md:pb-16">
      {/* Sticky Active Workout Header */}
      <div
        className={`sticky top-16 z-20 backdrop-blur-xl border rounded-3xl p-5 shadow-2xl transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218]/95 border-white/10'
            : 'bg-white/95 border-slate-200/90 shadow-slate-200/70'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: theme.accentColor }}
              />
              <h1 className={`text-base sm:text-lg font-black tracking-tight truncate ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                {workout.title || '今日训练'}
              </h1>
            </div>
            <div className={`flex items-center gap-3 text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              <span
                className="flex items-center gap-1 font-mono font-bold tabular-nums"
                style={{ color: theme.accentColor }}
              >
                <Clock className="w-3.5 h-3.5" />
                {formatDurationTimer(elapsedSeconds)}
              </span>
              <span>·</span>
              <span className="font-mono tabular-nums">
                已完成 {liveCompletedSets}/{totalSets} 组
              </span>
              <span>·</span>
              <span className="font-mono font-bold tabular-nums" style={{ color: theme.accentColor }}>
                容量 {formatVolume(liveVolume)} kg
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors whitespace-nowrap"
            >
              放弃训练
            </button>
            <button
              onClick={onFinishWorkout}
              className="px-5 py-2.5 rounded-2xl text-slate-950 font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ backgroundColor: theme.accentColor }}
            >
              完成并保存
            </button>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      {workout.exercises.length === 0 ? (
        <div
          className={`p-16 text-center rounded-3xl border border-dashed ${
            theme.isDark ? 'bg-[#121218]/60 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <Dumbbell className="w-12 h-12 text-zinc-500 mx-auto mb-3 opacity-60" />
          <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            当前训练暂无动作
          </h3>
          <p className={`text-xs mt-1 mb-5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            点击下方按钮，从 1,300+ 动作库中选择或搜索动作
          </p>
          <button
            onClick={onOpenExerciseSelector}
            className="px-6 py-3 rounded-2xl font-bold text-xs text-slate-950 shadow-lg transition-all inline-flex items-center gap-2"
            style={{ backgroundColor: theme.accentColor }}
          >
            <Plus className="w-4 h-4" />
            <span>添加第一个动作</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {workout.exercises.map((ex, exIdx) => {
            const rawEx = EXERCISE_MAP.get(ex.exerciseId);
            const lastPerf = getLastPerformance(ex.exerciseId, historySessions);

            return (
              <div
                key={ex.exerciseId + '-' + exIdx}
                className={`rounded-3xl border overflow-hidden shadow-lg transition-all ${
                  theme.isDark
                    ? 'bg-[#121218]/90 border-white/10'
                    : 'bg-white border-slate-200/90 shadow-slate-200/50'
                }`}
              >
                {/* Exercise Header */}
                <div
                  className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
                    theme.isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 text-slate-950"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        {exIdx + 1}
                      </span>
                      <h2 className={`text-base font-bold tracking-tight truncate ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                        {ex.exerciseZh || ex.exerciseName}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 ml-9 truncate">
                      <span className="truncate">{ex.exerciseName}</span>
                      <span>·</span>
                      <span>{getBodyPartName(ex.bodyPart)}</span>
                      {lastPerf && (
                        <>
                          <span>·</span>
                          <span className="text-amber-400 font-mono text-[11px] font-semibold">
                            上次: {lastPerf.sets[0]?.kg}kg × {lastPerf.sets[0]?.reps}次
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {rawEx && (
                      <button
                        onClick={() => onPreviewExercise(rawEx)}
                        className={`p-2 rounded-xl transition-colors ${
                          theme.isDark
                            ? 'text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                        title="查看动作要领与图解"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteExercise(exIdx)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="拿掉此动作"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  {/* Table Column Labels */}
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-zinc-400 px-2 pb-1">
                    <div className="col-span-2 sm:col-span-1 text-center">组号</div>
                    <div className="hidden sm:block sm:col-span-2 text-center">上次成绩</div>
                    <div className="col-span-5 sm:col-span-4 text-center">重量 (kg)</div>
                    <div className="col-span-3 sm:col-span-3 text-center">次数 (reps)</div>
                    <div className="col-span-2 sm:col-span-2 text-center">完成</div>
                  </div>

                  {/* Set Rows */}
                  {ex.sets.map((set, setIdx) => {
                    const prevRecord = lastPerf?.sets[setIdx];

                    return (
                      <div
                        key={set.id}
                        className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-2xl border transition-all ${
                          set.completed
                            ? ''
                            : theme.isDark
                            ? 'bg-white/[0.02] border-white/5'
                            : 'bg-slate-50 border-slate-200/80'
                        }`}
                        style={
                          set.completed
                            ? {
                                backgroundColor: `${theme.accentColor}15`,
                                borderColor: `${theme.accentColor}40`,
                              }
                            : {}
                        }
                      >
                        {/* Set Number & Type Toggle */}
                        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                          <button
                            onClick={() => {
                              const types: SetType[] = ['normal', 'warmup', 'dropset', 'failure'];
                              const curIdx = types.indexOf(set.type);
                              const nextType = types[(curIdx + 1) % types.length];
                              handleUpdateSetValue(exIdx, setIdx, 'type', nextType);
                            }}
                            className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center transition-colors ${
                              set.type === 'warmup'
                                ? 'bg-amber-500/20 text-amber-400'
                                : set.type === 'dropset'
                                ? 'bg-purple-500/20 text-purple-400'
                                : set.type === 'failure'
                                ? 'bg-rose-500/20 text-rose-400'
                                : theme.isDark
                                ? 'bg-white/10 text-white'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                            title={`类型: ${set.type} (点击切换热身组/递减组)`}
                          >
                            {set.type === 'warmup' ? 'W' : set.type === 'dropset' ? 'D' : set.setNumber}
                          </button>
                        </div>

                        {/* Previous Record Hint */}
                        <div className="hidden sm:block sm:col-span-2 text-center text-xs font-mono text-zinc-500 tabular-nums">
                          {prevRecord ? `${prevRecord.kg}kg × ${prevRecord.reps}` : '—'}
                        </div>

                        {/* Weight with Quick Steppers */}
                        <div className="col-span-5 sm:col-span-4 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustSetValue(exIdx, setIdx, 'kg', -2.5)}
                            className={`w-8 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                              theme.isDark
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/5 text-white'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                            }`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            step="0.5"
                            value={set.kg === 0 ? '' : set.kg}
                            placeholder="0"
                            onChange={(e) =>
                              handleUpdateSetValue(exIdx, setIdx, 'kg', Number(e.target.value) || 0)
                            }
                            className={`w-full h-9 text-center rounded-xl text-sm font-mono font-bold focus:outline-none border tabular-nums ${
                              theme.isDark
                                ? 'bg-white/[0.04] border-white/10 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleAdjustSetValue(exIdx, setIdx, 'kg', 2.5)}
                            className={`w-8 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                              theme.isDark
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/5 text-white'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                            }`}
                          >
                            +
                          </button>
                        </div>

                        {/* Reps with Quick Steppers */}
                        <div className="col-span-3 sm:col-span-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustSetValue(exIdx, setIdx, 'reps', -1)}
                            className={`w-8 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                              theme.isDark
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/5 text-white'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                            }`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={set.reps === 0 ? '' : set.reps}
                            placeholder="0"
                            onChange={(e) =>
                              handleUpdateSetValue(exIdx, setIdx, 'reps', Number(e.target.value) || 0)
                            }
                            className={`w-full h-9 text-center rounded-xl text-sm font-mono font-bold focus:outline-none border tabular-nums ${
                              theme.isDark
                                ? 'bg-white/[0.04] border-white/10 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleAdjustSetValue(exIdx, setIdx, 'reps', 1)}
                            className={`w-8 h-9 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                              theme.isDark
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/5 text-white'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                            }`}
                          >
                            +
                          </button>
                        </div>

                        {/* Done Toggle Button */}
                        <div className="col-span-2 sm:col-span-2 flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                              set.completed
                                ? 'text-slate-950 shadow-lg'
                                : theme.isDark
                                ? 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/10'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                            style={set.completed ? { backgroundColor: theme.accentColor } : {}}
                            title={set.completed ? '已完成 (点击重置)' : '点击标记完成并开启休息倒计时'}
                          >
                            <Check className="w-5 h-5 stroke-[3]" />
                          </button>

                          {ex.sets.length > 1 && (
                            <button
                              onClick={() => handleDeleteSet(exIdx, setIdx)}
                              className="hidden sm:flex p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                              title="删除此组"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Set Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleAddSet(exIdx)}
                      className={`w-full py-2.5 rounded-2xl border border-dashed text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                        theme.isDark
                          ? 'border-white/10 hover:border-white/20 text-zinc-300 hover:text-white'
                          : 'border-slate-300 hover:border-slate-400 text-slate-700'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>加一组 (Set {ex.sets.length + 1})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Exercise Floating / Bottom Button */}
          <div className="pt-2">
            <button
              onClick={onOpenExerciseSelector}
              className={`w-full py-4 rounded-3xl border-2 border-dashed text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                theme.isDark
                  ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/15 hover:border-white/30 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800 shadow-sm'
              }`}
            >
              <Plus className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span>加动作 (从动作库中选择)</span>
            </button>
          </div>
        </div>
      )}

      {/* Cancel Workout Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
              theme.isDark ? 'bg-[#121218] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold mb-1">确定要放弃这次训练吗？</h3>
            <p className={`text-xs mb-5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              本次训练中记录的所有组数与数据将不会被保存。
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold ${
                  theme.isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                继续练
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  onCancelWorkout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                放弃训练
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
