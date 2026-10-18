import React, { useState } from 'react';
import { X, Calculator, Plus, Minus, RotateCcw } from 'lucide-react';
import { calculateBarbellPlates } from '../utils/calculations';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
}

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 100,
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20);

  if (!isOpen) return null;

  const result = calculateBarbellPlates(targetWeight, barWeight);

  const handleAdjust = (delta: number) => {
    setTargetWeight((prev) => Math.max(barWeight, Math.round((prev + delta) * 2) / 2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">杠铃片配重计算器</h2>
              <p className="text-xs text-slate-400">快速计算单边需要装载的杠铃片组合</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Target Weight Input with Steppers */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>目标总重量 (含杠铃)</span>
              <span>单边配重: <strong className="text-emerald-400 font-mono text-sm">{result.weightPerSide} kg</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAdjust(-5)}
                className="w-11 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold flex items-center justify-center text-lg active:scale-95 transition-all"
              >
                -5
              </button>
              <button
                onClick={() => handleAdjust(-2.5)}
                className="w-11 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-semibold flex items-center justify-center text-xs active:scale-95 transition-all"
              >
                -2.5
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  step="2.5"
                  min={barWeight}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full h-12 text-center text-2xl font-bold font-mono text-emerald-400 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 tabular-nums"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  kg
                </span>
              </div>

              <button
                onClick={() => handleAdjust(2.5)}
                className="w-11 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-semibold flex items-center justify-center text-xs active:scale-95 transition-all"
              >
                +2.5
              </button>
              <button
                onClick={() => handleAdjust(5)}
                className="w-11 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold flex items-center justify-center text-lg active:scale-95 transition-all"
              >
                +5
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs">
              {[40, 60, 80, 100, 120, 140, 160].map((w) => (
                <button
                  key={w}
                  onClick={() => setTargetWeight(w)}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                    targetWeight === w
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {w}kg
                </button>
              ))}
            </div>
          </div>

          {/* Barbell Weight Options */}
          <div>
            <span className="text-xs text-slate-400 block mb-1.5">杠铃杆自重</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { weight: 20, label: '20 kg (标准奥杆)' },
                { weight: 15, label: '15 kg (女士/短奥杆)' },
                { weight: 10, label: '10 kg (EZ曲柄杆)' },
              ].map((bar) => (
                <button
                  key={bar.weight}
                  onClick={() => {
                    setBarWeight(bar.weight);
                    if (targetWeight < bar.weight) setTargetWeight(bar.weight);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    barWeight === bar.weight
                      ? 'bg-slate-800 border-emerald-500/80 text-white'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-mono font-bold text-sm text-emerald-400">{bar.weight} kg</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{bar.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Barbell Representation */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
              <span>单边装载方案</span>
              <span className="text-[11px] text-slate-400">两边对称</span>
            </div>

            {result.platesPerSide.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">
                {targetWeight <= barWeight ? '无需挂铃片（纯空杆）' : '无法计算配重'}
              </div>
            ) : (
              <div className="space-y-2">
                {result.platesPerSide.map((plate, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-8 rounded-sm shadow-sm border border-black/20"
                        style={{ backgroundColor: plate.colorHex }}
                      />
                      <span className="font-mono font-bold text-white text-sm">
                        {plate.weight} kg 片
                      </span>
                    </div>
                    <div className="font-mono text-emerald-400 font-bold text-sm">
                      × {plate.count} 片 <span className="text-slate-400 font-normal">/ 单边</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
