import React, { useState } from 'react';
import { X, Award, Dumbbell, Zap } from 'lucide-react';
import { calculate1RM, get1RMPercentages } from '../utils/calculations';
import { ThemeConfig } from '../types/theme';

interface OneRepMaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWeight?: number;
  defaultReps?: number;
  theme: ThemeConfig;
}

export const OneRepMaxModal: React.FC<OneRepMaxModalProps> = ({
  isOpen,
  onClose,
  defaultWeight = 80,
  defaultReps = 8,
  theme,
}) => {
  const [weight, setWeight] = useState<number>(defaultWeight);
  const [reps, setReps] = useState<number>(defaultReps);

  if (!isOpen) return null;

  const result = calculate1RM(weight, reps);
  const percentages = get1RMPercentages(result.average);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            theme.isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">1RM 极限重量推算</h2>
              <p className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                基于 Brzycki & Epley 国际力量公式
              </p>
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

        {/* Form Inputs */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs block mb-1.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                完成重量 (kg)
              </label>
              <input
                type="number"
                step="2.5"
                min="0"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 0)}
                className={`w-full px-3 py-2.5 rounded-2xl text-center font-mono font-bold text-lg border transition-colors focus:outline-none ${
                  theme.isDark
                    ? 'bg-white/[0.04] border-white/10 text-white focus:border-white/30'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                }`}
              />
            </div>
            <div>
              <label className={`text-xs block mb-1.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                重复次数 (Reps)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="30"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value) || 1)}
                className={`w-full px-3 py-2.5 rounded-2xl text-center font-mono font-bold text-lg border transition-colors focus:outline-none ${
                  theme.isDark
                    ? 'bg-white/[0.04] border-white/10 text-white focus:border-white/30'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Result Card */}
          <div
            className={`p-5 rounded-2xl border text-center transition-all ${
              theme.isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              推算一次最大极限负荷 (1RM)
            </span>
            <div
              className="text-4xl font-black font-mono my-1 tracking-tight"
              style={{ color: theme.accentColor }}
            >
              {Math.round(result.average)}{' '}
              <span className={`text-base font-normal ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                kg
              </span>
            </div>
            <div className={`text-[11px] mt-1 ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
              Brzycki: {Math.round(result.brzycki)}kg · Epley: {Math.round(result.epley)}kg
            </div>
          </div>

          {/* Percentages Breakdown Table */}
          <div>
            <div className={`text-xs font-semibold mb-2 ${theme.isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              力量训练百分比负荷表
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {percentages.map((p) => (
                <div
                  key={p.percentage}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    theme.isDark
                      ? 'bg-white/[0.02] border-white/5 text-zinc-300'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <span className={theme.isDark ? 'text-zinc-400' : 'text-slate-500'}>{p.percentage}%</span>
                  <span className="font-bold">{p.weight} kg</span>
                  <span className="text-[10px] opacity-60">~{p.targetReps} 次</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-end ${
            theme.isDark ? 'border-white/[0.08] bg-white/[0.02]' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
              theme.isDark
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
