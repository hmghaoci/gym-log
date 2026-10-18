import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Flame, Clock, Dumbbell, Award, Share2, Save, X } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { formatDurationHuman, formatVolume } from '../utils/calculations';
import { getBodyPartName } from '../utils/translations';

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  session: WorkoutSession | null;
  onClose: () => void;
  onSaveAsTemplate?: (name: string) => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  isOpen,
  session,
  onClose,
  onSaveAsTemplate,
}) => {
  const [templateName, setTemplateName] = useState('');
  const [showSaveTpl, setShowSaveTpl] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#38bdf8'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen || !session) return null;

  // Extract unique muscle groups trained
  const bodyParts = Array.from(new Set(session.exercises.map((e) => e.bodyPart))).filter(Boolean);

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !onSaveAsTemplate) return;
    onSaveAsTemplate(templateName.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setShowSaveTpl(false);
      setSavedSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/90 rounded-3xl shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Banner with Trophy */}
        <div className="p-6 bg-gradient-to-b from-emerald-950/60 to-transparent border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">训练圆满完成！</h2>
          <p className="text-xs text-slate-400 mt-1">
            {session.title} · 每一次推拉都在重塑更强大的自己
          </p>
        </div>

        {/* Workout Stats Grid */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>时长</span>
              </span>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {formatDurationHuman(session.duration)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" />
                <span>总容量</span>
              </span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {formatVolume(session.totalVolume)} <span className="text-[10px] text-slate-400">kg</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-teal-400" />
                <span>完成组数</span>
              </span>
              <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                {session.completedSets} <span className="text-[10px] text-slate-400">组</span>
              </div>
            </div>
          </div>

          {/* New PRs Award Section */}
          {session.newPrs && session.newPrs.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>本次打破 {session.newPrs.length} 项个人最好成绩 (PR)！</span>
              </div>
              <div className="space-y-1.5">
                {session.newPrs.map((pr, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-200">{pr.exerciseName}</span>
                    <span className="font-mono font-bold text-amber-300">
                      {pr.type === 'maxWeight' ? `${pr.value} kg × ${pr.reps}次` : `预估 1RM ${pr.value} kg`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Muscle Groups Trained */}
          <div>
            <span className="text-xs text-slate-400 block mb-2">轰炸肌群</span>
            <div className="flex items-center gap-2 flex-wrap">
              {bodyParts.map((bp) => (
                <div
                  key={bp}
                  className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200 font-medium"
                >
                  {getBodyPartName(bp)}
                </div>
              ))}
            </div>
          </div>

          {/* Exercises Completed List */}
          <div>
            <span className="text-xs text-slate-400 block mb-2">完成动作</span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {session.exercises.map((ex, idx) => {
                const finishedSets = ex.sets.filter((s) => s.completed);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800/60"
                  >
                    <span className="text-slate-200 truncate">{ex.exerciseZh || ex.exerciseName}</span>
                    <span className="text-slate-400 font-mono">
                      {finishedSets.length} 组完成
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save As Template Option */}
          {onSaveAsTemplate && (
            <div>
              {!showSaveTpl ? (
                <button
                  onClick={() => {
                    setShowSaveTpl(true);
                    setTemplateName(session.title || '自定义训练模板');
                  }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-slate-600 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>将本次动作保存为训练模板</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-300 font-medium">模板名称</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="例如：推日进阶"
                      className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleSaveTemplate}
                      disabled={savedSuccess}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
                    >
                      {savedSuccess ? '已保存！' : '保存'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
          >
            收下成就并返回
          </button>
        </div>
      </div>
    </div>
  );
};
