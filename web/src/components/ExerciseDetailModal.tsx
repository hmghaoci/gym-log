import React, { useState } from 'react';
import { X, Play, Dumbbell, Award, History, Info, Sparkles, Plus } from 'lucide-react';
import { RawExercise, WorkoutSession } from '../types/gym';
import { getBodyPartName, getEquipmentName, getMuscleTargetName, getExerciseMediaUrl } from '../utils/translations';
import { calculate1RM, formatVolume } from '../utils/calculations';

interface ExerciseDetailModalProps {
  exercise: RawExercise | null;
  onClose: () => void;
  onAddToWorkout?: (exercise: RawExercise) => void;
  historySessions?: WorkoutSession[];
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onAddToWorkout,
  historySessions = [],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {exercise.zh || exercise.n}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{exercise.n}</span>
              <span>·</span>
              <span>{getBodyPartName(exercise.b)}</span>
              <span>·</span>
              <span>{getEquipmentName(exercise.eq)}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">{getMuscleTargetName(exercise.t)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Media / Animation Box */}
          <div className="relative w-full aspect-video sm:aspect-[16/10] bg-[#1a2234] rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {mediaSrc && !imgError ? (
              <img
                src={mediaSrc}
                alt={exercise.zh || exercise.n}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 gap-2 p-6 text-center">
                <Dumbbell className="w-12 h-12 text-emerald-500/40" />
                <span className="text-sm font-medium text-slate-400">{exercise.zh || exercise.n}</span>
                <span className="text-xs text-slate-500">
                  {getBodyPartName(exercise.b)} · {getEquipmentName(exercise.eq)}
                </span>
              </div>
            )}

            {/* Animation Toggle Button */}
            {gifUrl && (
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={() => setShowAnimation(!showAnimation)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
                >
                  <Play className={`w-3.5 h-3.5 ${showAnimation ? 'text-emerald-400 fill-emerald-400' : ''}`} />
                  <span>{showAnimation ? '暂停动画' : '播放动图'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Historical PR Highlights */}
          {maxWeight > 0 ? (
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400">历史最高重量</span>
                <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  {maxWeight} <span className="text-xs font-normal text-slate-400">kg</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">预估极限 1RM</span>
                <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                  {Math.round(max1RM)} <span className="text-xs font-normal text-slate-400">kg</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">累计完成组数</span>
                <div className="text-lg font-bold font-mono text-slate-200 tabular-nums">
                  {totalSetsDone} <span className="text-xs font-normal text-slate-400">组</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>暂无此动作的历史记录。在训练中完成任意一组后将自动记录个人纪录 (PR)。</span>
            </div>
          )}

          {/* Execution Steps */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-2.5 flex items-center gap-2">
              <span>动作要领与步骤</span>
            </h3>

            {exercise.s && exercise.s.length > 0 ? (
              <ol className="space-y-2.5">
                {exercise.s.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-slate-300">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-semibold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-slate-400">标准规范动作，收紧核心，控制离心收缩节奏。</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            关闭
          </button>
          {onAddToWorkout && (
            <button
              onClick={() => {
                onAddToWorkout(exercise);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
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
