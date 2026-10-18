import React, { useState } from 'react';
import { Timer, Plus, Minus, X, Bell, ChevronUp, ChevronDown } from 'lucide-react';

interface RestTimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
  isActive: boolean;
  onAddSeconds: (seconds: number) => void;
  onSkip: () => void;
  onClose: () => void;
}

export const RestTimerBar: React.FC<RestTimerBarProps> = ({
  remainingSeconds,
  totalSeconds,
  isActive,
  onAddSeconds,
  onSkip,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isActive && remainingSeconds <= 0) return null;

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const progressPercent = totalSeconds > 0 ? Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100)) : 0;

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 border border-emerald-500/50 shadow-xl shadow-black/50 text-white hover:border-emerald-400 transition-all group"
        >
          <div className="relative flex items-center justify-center">
            <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <span className="font-mono font-bold text-sm text-emerald-400 tabular-nums">
            {timeString}
          </span>
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 md:bottom-6 left-0 right-0 z-50 px-3 max-w-xl mx-auto pointer-events-none">
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/60 p-3 sm:p-4 text-white">
        {/* Progress bar line at top */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Left: Timer icon and countdown */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">组间休息</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-emerald-400/90 font-mono">目标 {totalSeconds}秒</span>
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                {timeString}
              </div>
            </div>
          </div>

          {/* Right: Quick adjusting actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onAddSeconds(-15)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              title="减少15秒"
            >
              -15s
            </button>
            <button
              onClick={() => onAddSeconds(30)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              title="增加30秒"
            >
              +30s
            </button>
            <button
              onClick={onSkip}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-colors"
            >
              跳过
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
              title="最小化"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
