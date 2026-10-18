import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Flame, Clock, Dumbbell, Award, Share2, Save, X } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { formatDurationHuman, formatVolume } from '../utils/calculations';
import { getBodyPartName } from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  session: WorkoutSession | null;
  onClose: () => void;
  onSaveAsTemplate?: (name: string) => void;
  theme: ThemeConfig;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  isOpen,
  session,
  onClose,
  onSaveAsTemplate,
  theme,
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
          colors: [theme.accentColor, '#f59e0b', '#38bdf8', '#10b981'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [isOpen, theme.accentColor]);

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
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-all ${
          theme.isDark
            ? 'bg-[#121218] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Banner with Trophy */}
        <div
          className="p-6 text-center relative border-b"
          style={{
            borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.8)',
            background: `radial-gradient(circle at top, ${theme.accentColor}25 0%, transparent 80%)`,
          }}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-xl transition-colors ${
              theme.isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-slate-950 mb-3 shadow-xl"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 8px 25px ${theme.accentColor}50`,
            }}
          >
            <Trophy className="w-8 h-8 fill-slate-950" />
          </div>

          <h2 className="text-2xl font-black tracking-tight">训练圆满完成！</h2>
          <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            每一滴汗水都在重塑更加坚韧的肉体与意志
          </p>
        </div>

        {/* Core Stats Overview */}
        <div className="p-5 sm:p-6 space-y-5">
          <div
            className={`grid grid-cols-3 gap-3 p-4 rounded-2xl border text-center ${
              theme.isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className={`flex items-center justify-center gap-1 text-[11px] mb-1 ${
                theme.isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>总耗时</span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono">
                {formatDurationHuman(Math.round((session.duration || 0) / 60))}
              </div>
            </div>

            <div
              className="border-x"
              style={{ borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(226,232,240,0.8)' }}
            >
              <div className={`flex items-center justify-center gap-1 text-[11px] mb-1 ${
                theme.isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>完成组数</span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono">
                {session.completedSets || 0}{' '}
                <span className={`text-xs font-normal ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  组
                </span>
              </div>
            </div>

            <div>
              <div className={`flex items-center justify-center gap-1 text-[11px] mb-1 ${
                theme.isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                <Flame className="w-3.5 h-3.5" />
                <span>训练总容量</span>
              </div>
              <div
                className="text-base sm:text-lg font-bold font-mono"
                style={{ color: theme.accentColor }}
              >
                {formatVolume(session.totalVolume || 0)}{' '}
                <span className={`text-xs font-normal ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* New PRs Achievement Badges */}
          {session.newPrs && session.newPrs.length > 0 && (
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: `${theme.accentColor}12`,
                borderColor: `${theme.accentColor}30`,
              }}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: theme.accentColor }} />
                <span className="text-xs font-bold" style={{ color: theme.accentColor }}>
                  突破了 {session.newPrs.length} 项个人最佳纪录 (PR)！
                </span>
              </div>
              <div className="space-y-1 pt-1">
                {session.newPrs.map((pr, idx) => (
                  <div
                    key={idx}
                    className={`text-xs flex items-center justify-between p-2 rounded-xl border ${
                      theme.isDark ? 'bg-black/30 border-white/5 text-zinc-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{pr.exerciseName}</span>
                    <span className="font-mono font-bold" style={{ color: theme.accentColor }}>
                      {pr.type === 'maxWeight' ? `${pr.value} kg 极限重量` : pr.type === 'max1RM' ? `${pr.value} kg 1RM` : `${pr.value} kg 总容量`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Breakdown Summary */}
          <div>
            <div className={`text-xs font-semibold mb-2 ${theme.isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              动作组数明细 ({session.exercises.length} 个动作)
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {session.exercises.map((ex, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    theme.isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold text-slate-950 shrink-0"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-medium truncate">{ex.exerciseZh || ex.exerciseName}</span>
                  </div>
                  <div className={`font-mono text-[11px] shrink-0 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {ex.sets.filter((s) => s.completed).length} 组完成
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional: Save as Template */}
          {onSaveAsTemplate && (
            <div>
              {!showSaveTpl ? (
                <button
                  onClick={() => {
                    setTemplateName(session.title || '常用训练计划');
                    setShowSaveTpl(true);
                  }}
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    theme.isDark
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>将本次训练存为新模板</span>
                </button>
              ) : (
                <div
                  className={`p-3.5 rounded-2xl border space-y-2.5 ${
                    theme.isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={theme.isDark ? 'text-zinc-300' : 'text-slate-700'}>新模板名称</span>
                    <button
                      onClick={() => setShowSaveTpl(false)}
                      className={`text-[11px] ${theme.isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      取消
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="如：胸背超级组计划..."
                      className={`flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none border ${
                        theme.isDark
                          ? 'bg-black/30 border-white/10 text-white placeholder-zinc-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                    <button
                      onClick={handleSaveTemplate}
                      disabled={savedSuccess}
                      className="px-4 py-2 rounded-xl font-bold text-xs text-slate-950 transition-all flex items-center gap-1"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{savedSuccess ? '已保存!' : '保存'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-end ${
            theme.isDark ? 'border-white/[0.08] bg-white/[0.02]' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold text-xs text-slate-950 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 6px 20px ${theme.accentColor}35`,
            }}
          >
            完成并退出
          </button>
        </div>
      </div>
    </div>
  );
};
