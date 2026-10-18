import React, { useState } from 'react';
import { X, Play, Dumbbell, Award, History, Info, Sparkles, Plus } from 'lucide-react';
import { RawExercise, WorkoutSession } from '../types/gym';
import { getBodyPartName, getEquipmentName, getMuscleTargetName, getExerciseMediaUrl } from '../utils/translations';
import { calculate1RM, formatVolume } from '../utils/calculations';
import { ThemeConfig } from '../types/theme';

interface ExerciseDetailModalProps {
  exercise: RawExercise | null;
  onClose: () => void;
  onAddToWorkout?: (exercise: RawExercise) => void;
  historySessions?: WorkoutSession[];
  theme: ThemeConfig;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onAddToWorkout,
  historySessions = [],
  theme,
}) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [imgError, setImgError] = useState(false);

  if (!exercise) return null;

  const gifUrl = getExerciseMediaUrl(exercise.g);
  const jpgUrl = getExerciseMediaUrl(exercise.img);
  const mediaSrc = showAnimation && gifUrl ? gifUrl : jpgUrl;

  // Compute personal records for this exercise
  let maxWeight = 0;
  let max1RM = 0;
  let totalSetsDone = 0;
  let lastPerformedDate: string | null = null;

  for (const session of historySessions) {
    const match = session.exercises.find((e) => e.exerciseId === exercise.id);
    if (match) {
      if (!lastPerformedDate) lastPerformedDate = session.date;
      for (const set of match.sets) {
        if (set.completed && set.kg > 0) {
          totalSetsDone++;
          if (set.kg > maxWeight) maxWeight = set.kg;
          const est = calculate1RM(set.kg, set.reps).average;
          if (est > max1RM) max1RM = est;
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/40'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between p-5 sm:p-6 border-b ${
            theme.isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
              <h2 className="text-xl font-bold tracking-tight">
                {exercise.zh || exercise.n}
              </h2>
            </div>
            <div
              className={`flex items-center gap-2 text-xs mt-1.5 flex-wrap ${
                theme.isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}
            >
              <span>{exercise.n}</span>
              <span>·</span>
              <span>{getBodyPartName(exercise.b)}</span>
              <span>·</span>
              <span>{getEquipmentName(exercise.eq)}</span>
              <span>·</span>
              <span className="font-semibold" style={{ color: theme.accentColor }}>
                {getMuscleTargetName(exercise.t)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              theme.isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Media / Animation Box */}
          <div
            className={`relative w-full aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden border flex items-center justify-center ${
              theme.isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {mediaSrc && !imgError ? (
              <img
                src={mediaSrc}
                alt={exercise.zh || exercise.n}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                <Dumbbell className="w-12 h-12 opacity-40" style={{ color: theme.accentColor }} />
                <span className={`text-sm font-medium ${theme.isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  {exercise.zh || exercise.n}
                </span>
                <span className={`text-xs ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                  {getBodyPartName(exercise.b)} · {getEquipmentName(exercise.eq)}
                </span>
              </div>
            )}

            {/* Animation Toggle Button */}
            {gifUrl && (
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => setShowAnimation(!showAnimation)}
                  className={`px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-medium transition-all flex items-center gap-1.5 shadow-md ${
                    theme.isDark
                      ? 'bg-black/70 border-white/20 text-white hover:bg-black/90'
                      : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-white'
                  }`}
                >
                  <Play
                    className="w-3.5 h-3.5"
                    style={{
                      fill: showAnimation ? theme.accentColor : 'none',
                      color: showAnimation ? theme.accentColor : undefined,
                    }}
                  />
                  <span>{showAnimation ? '暂停动画' : '播放动图'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Historical PR Highlights */}
          {maxWeight > 0 ? (
            <div
              className={`grid grid-cols-3 gap-3 p-4 rounded-2xl border ${
                theme.isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className={`text-[11px] block ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  历史最高重量
                </span>
                <div
                  className="text-lg font-bold font-mono tabular-nums mt-0.5"
                  style={{ color: theme.accentColor }}
                >
                  {maxWeight} <span className="text-xs font-normal opacity-70">kg</span>
                </div>
              </div>
              <div>
                <span className={`text-[11px] block ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  预估极限 1RM
                </span>
                <div
                  className="text-lg font-bold font-mono tabular-nums mt-0.5"
                  style={{ color: theme.accentColor }}
                >
                  {Math.round(max1RM)} <span className="text-xs font-normal opacity-70">kg</span>
                </div>
              </div>
              <div>
                <span className={`text-[11px] block ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  累计完成组数
                </span>
                <div className="text-lg font-bold font-mono tabular-nums mt-0.5">
                  {totalSetsDone} <span className="text-xs font-normal opacity-70">组</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`px-4 py-3 rounded-2xl border text-xs flex items-center gap-2 ${
                theme.isDark
                  ? 'bg-white/[0.02] border-white/10 text-zinc-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>暂无此动作的历史记录。在训练中完成任意一组后将自动记录个人纪录 (PR)。</span>
            </div>
          )}

          {/* Execution Steps */}
          <div>
            <h3 className={`text-sm font-semibold mb-2.5 flex items-center gap-2 ${
              theme.isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span>动作要领与步骤</span>
            </h3>

            {exercise.s && exercise.s.length > 0 ? (
              <ol className="space-y-2.5">
                {exercise.s.map((step, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-3 text-xs leading-relaxed ${
                      theme.isDark ? 'text-zinc-300' : 'text-slate-700'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center font-mono font-semibold text-[11px] shrink-0 mt-0.5 text-slate-950"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                标准规范动作，收紧核心，控制离心收缩节奏。
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-end gap-3 ${
            theme.isDark ? 'border-white/[0.08] bg-white/[0.02]' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              theme.isDark
                ? 'bg-white/10 hover:bg-white/15 text-zinc-200'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            关闭
          </button>
          {onAddToWorkout && (
            <button
              onClick={() => {
                onAddToWorkout(exercise);
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: theme.accentColor,
                boxShadow: `0 4px 15px ${theme.accentColor}35`,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>加入今日训练</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
