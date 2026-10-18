import React, { useState } from 'react';
import { Timer, Plus, Minus, X, Bell, ChevronUp, ChevronDown } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface RestTimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
  isActive: boolean;
  onAddSeconds: (seconds: number) => void;
  onSkip: () => void;
  onClose: () => void;
  theme: ThemeConfig;
}

export const RestTimerBar: React.FC<RestTimerBarProps> = ({
  remainingSeconds,
  totalSeconds,
  isActive,
  onAddSeconds,
  onSkip,
  onClose,
  theme,
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
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border shadow-2xl transition-all group ${
            theme.isDark ? 'bg-[#121218]' : 'bg-white text-slate-900'
          }`}
          style={{ borderColor: theme.accentColor }}
        >
          <div className="relative flex items-center justify-center">
            <Timer className="w-4 h-4 animate-pulse" style={{ color: theme.accentColor }} />
          </div>
          <span className="font-mono font-bold text-sm tabular-nums" style={{ color: theme.accentColor }}>
            {timeString}
          </span>
          <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 md:bottom-6 left-0 right-0 z-50 px-3 max-w-xl mx-auto pointer-events-none">
      <div
        className={`pointer-events-auto backdrop-blur-xl border rounded-3xl shadow-2xl p-4 sm:p-5 transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218]/95 border-white/10 text-white shadow-black/80'
            : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/80'
        }`}
      >
        {/* Progress bar line at top */}
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden mb-3.5 ${
            theme.isDark ? 'bg-white/[0.06]' : 'bg-slate-100'
          }`}
        >
          <div
            className="h-full transition-all duration-1000 ease-linear rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: theme.accentColor,
              boxShadow: `0 0 10px ${theme.accentColor}80`,
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Left: Timer icon and countdown */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `${theme.accentColor}15`,
                color: theme.accentColor,
                borderColor: `${theme.accentColor}30`,
              }}
            >
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  组间休息
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs font-mono font-semibold" style={{ color: theme.accentColor }}>
                  目标 {totalSeconds}秒
                </span>
              </div>
              <div className="text-2xl font-black font-mono tracking-tight tabular-nums">
                {timeString}
              </div>
            </div>
          </div>

          {/* Right: Quick adjusting actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onAddSeconds(-15)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
                theme.isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="减少15秒"
            >
              -15s
            </button>
            <button
              onClick={() => onAddSeconds(30)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
                theme.isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="增加30秒"
            >
              +30s
            </button>
            <button
              onClick={onSkip}
              className="px-3.5 py-1.5 rounded-xl text-slate-950 text-xs font-bold shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: theme.accentColor }}
            >
              跳过
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white transition-colors ml-1"
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
