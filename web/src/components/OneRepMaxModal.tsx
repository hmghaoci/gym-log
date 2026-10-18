import React, { useState } from 'react';
import { X, Award, Dumbbell, Zap } from 'lucide-react';
import { calculate1RM, get1RMPercentages } from '../utils/calculations';

interface OneRepMaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWeight?: number;
  defaultReps?: number;
}

export const OneRepMaxModal: React.FC<OneRepMaxModalProps> = ({
  isOpen,
  onClose,
  defaultWeight = 80,
  defaultReps = 8,
}) => {
  const [weight, setWeight] = useState<number>(defaultWeight);
  const [reps, setReps] = useState<number>(defaultReps);

  if (!isOpen) return null;

  const result = calculate1RM(weight, reps);
  const percentages = get1RMPercentages(result.average);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">1RM 极限重量推算</h2>
              <p className="text-xs text-slate-400">基于 Brzycki & Epley 国际力量公式</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">完成重量 (kg)</label>
              <input
                type="number"
                step="2.5"
                min="0"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">完成次数 (reps)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Big Result Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 text-center">
            <span className="text-xs text-slate-400">预估极限单次最大重量 (1RM)</span>
            <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1 tabular-nums">
              {result.average} <span className="text-sm font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex justify-center gap-3">
              <span>Brzycki: {result.brzycki} kg</span>
              <span>·</span>
              <span>Epley: {result.epley} kg</span>
            </div>
          </div>

          {/* Training Percentages Table */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">力量区间与建议次数</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {percentages.slice(1, 7).map((item) => (
                <div
                  key={item.percentage}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-semibold text-slate-300">{item.percentage}%</span>
                    <span className="text-slate-500 text-[10px] ml-1.5">({item.targetReps}次)</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    {item.weight} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
