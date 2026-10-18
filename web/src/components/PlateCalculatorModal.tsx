import React, { useState } from 'react';
import { X, Calculator, Plus, Minus, RotateCcw } from 'lucide-react';
import { calculateBarbellPlates } from '../utils/calculations';
import { ThemeConfig } from '../types/theme';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
  theme: ThemeConfig;
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 100,
  theme,
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20);

  if (!isOpen) return null;

  const result = calculateBarbellPlates(targetWeight, barWeight);

  const handleAdjust = (delta: number) => {
    setTargetWeight((prev) => Math.max(barWeight, Math.round((prev + delta) * 2) / 2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
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
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">杠铃片配重计算器</h2>
              <p className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                快速计算单边需要装载的杠铃片组合
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Target Weight Input with Steppers */}
          <div>
            <div
              className={`flex items-center justify-between text-xs mb-2 ${
                theme.isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}
            >
              <span>目标总重量 (含杠铃杆)</span>
              <span>
                单边配重:{' '}
                <strong className="font-mono text-sm font-bold" style={{ color: theme.accentColor }}>
                  {result.weightPerSide} kg
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdjust(-5)}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xs font-bold transition-all active:scale-95 ${
                  theme.isDark
                    ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                }`}
              >
                -5
              </button>
              <button
                onClick={() => handleAdjust(-2.5)}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xs font-bold transition-all active:scale-95 ${
                  theme.isDark
                    ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                }`}
              >
                -2.5
              </button>

              <div
                className={`flex-1 flex items-center justify-center rounded-2xl border p-2 ${
                  theme.isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <input
                  type="number"
                  step="2.5"
                  min={barWeight}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Math.max(0, Number(e.target.value) || 0))}
                  className={`w-28 text-center font-mono font-bold text-2xl bg-transparent focus:outline-none ${
                    theme.isDark ? 'text-white' : 'text-slate-900'
                  }`}
                />
                <span className={`text-xs ml-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>kg</span>
              </div>

              <button
                onClick={() => handleAdjust(2.5)}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xs font-bold transition-all active:scale-95 ${
                  theme.isDark
                    ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                }`}
              >
                +2.5
              </button>
              <button
                onClick={() => handleAdjust(5)}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xs font-bold transition-all active:scale-95 ${
                  theme.isDark
                    ? 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                }`}
              >
                +5
              </button>
            </div>
          </div>

          {/* Barbell Weight Selection */}
          <div className="flex items-center justify-between text-xs">
            <span className={theme.isDark ? 'text-zinc-400' : 'text-slate-500'}>空杆重量</span>
            <div className="flex items-center gap-2">
              {[20, 15, 10, 0].map((w) => (
                <button
                  key={w}
                  onClick={() => setBarWeight(w)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs transition-all font-semibold ${
                    barWeight === w
                      ? 'text-slate-950 shadow-sm'
                      : theme.isDark
                      ? 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={
                    barWeight === w
                      ? { backgroundColor: theme.accentColor }
                      : undefined
                  }
                >
                  {w === 0 ? '无杆' : `${w}kg`}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Barbell Loading Illustration */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-center ${
              theme.isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`text-xs font-semibold mb-3 ${theme.isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              单边装载示意 (从内到外)
            </div>

            {result.platesPerSide.length === 0 ? (
              <div className={`py-4 text-xs ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                仅需空杆，无需装载杠铃片
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 flex-wrap py-2">
                {result.platesPerSide.map((p, idx) => {
                  const getPlateStyle = (weight: number) => {
                    switch (weight) {
                      case 25:
                        return 'bg-red-500 text-white h-16 w-8';
                      case 20:
                        return 'bg-blue-600 text-white h-16 w-7';
                      case 15:
                        return 'bg-amber-500 text-slate-950 h-14 w-7';
                      case 10:
                        return 'bg-emerald-500 text-slate-950 h-12 w-6';
                      case 5:
                        return 'bg-zinc-200 text-slate-900 h-10 w-5';
                      case 2.5:
                        return 'bg-zinc-600 text-white h-9 w-5';
                      default:
                        return 'bg-zinc-500 text-white h-8 w-4';
                    }
                  };

                  return (
                    <div
                      key={idx}
                      className={`rounded-lg flex flex-col items-center justify-center shadow-md font-mono text-[10px] font-bold ${getPlateStyle(
                        p.weight
                      )}`}
                    >
                      <span>{p.weight}</span>
                      {p.count > 1 && <span className="text-[8px] opacity-80">×{p.count}</span>}
                    </div>
                  );
                })}
              </div>
            )}
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
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
