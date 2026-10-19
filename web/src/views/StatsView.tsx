import React, { useMemo } from 'react';
import { Calculator, Zap } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { EXERCISE_MAP } from '../utils/storage';
import { getExerciseMediaUrl, getExerciseMediaFallbackUrl } from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface StatsViewProps {
  sessions: WorkoutSession[];
  onOpen1RMCalc: (defaultWeight?: number, defaultReps?: number) => void;
  onOpenPlateCalc: (weight?: number) => void;
  theme: ThemeConfig;
}

interface ProgressRow {
  id: string;
  name: string;
  zh?: string;
  g?: string;
  weights: number[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  sessions,
  onOpen1RMCalc,
  onOpenPlateCalc,
  theme,
}) => {
  const rows = useMemo(() => {
    const map = new Map<string, ProgressRow>();
    const sorted = [...sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sorted.forEach((session) => {
      session.exercises.forEach((ex) => {
        const top = ex.sets.reduce((m, s) => Math.max(m, Number(s.kg) || 0), 0);
        const raw = EXERCISE_MAP.get(ex.exerciseId);
        const row =
          map.get(ex.exerciseId) ||
          ({
            id: ex.exerciseId,
            name: ex.exerciseName,
            zh: ex.exerciseZh,
            g: raw?.g || raw?.img,
            weights: [],
          } as ProgressRow);
        if (ex.exerciseZh) row.zh = ex.exerciseZh;
        if (raw?.g || raw?.img) row.g = raw.g || raw.img;
        row.weights.push(top);
        map.set(ex.exerciseId, row);
      });
    });

    return Array.from(map.values())
      .filter((r) => r.weights.length > 0)
      .sort((a, b) => b.weights.length - a.weights.length);
  }, [sessions]);

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-28 md:pb-16">
      <div>
        <h1 className={`text-2xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          动作进步
        </h1>
        <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          每个动作最近几次最重的一组。哪天练了什么在「历史」。
        </p>
      </div>

      {rows.length === 0 ? (
        <div
          className={`p-12 text-center rounded-3xl border ${
            theme.isDark ? 'bg-[#121218]/80 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <p className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            还没有可统计的动作
          </p>
          <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            完成几次训练后，这里会显示重量变化
          </p>
        </div>
      ) : (
        rows.map((row) => {
          const recent = row.weights.slice(-6);
          const last = recent[recent.length - 1] || 0;
          const prev = recent.length > 1 ? recent[recent.length - 2] : last;
          const delta = last - prev;
          const max = Math.max(...recent, 1);
          const media = getExerciseMediaUrl(row.g);
          const sign = delta > 0 ? `+${delta}` : String(delta);

          return (
            <div
              key={row.id}
              className={`p-4 rounded-3xl border flex gap-3 items-center ${
                theme.isDark ? 'bg-[#121218]/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-[#0b1220] shrink-0">
                {media ? (
                  <img
                    src={media}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const fb = getExerciseMediaFallbackUrl(row.g);
                      if (fb && e.currentTarget.dataset.fallback !== '1') {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = fb;
                      }
                    }}
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-extrabold truncate ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                  {row.zh || row.name}
                </h3>
                <p className={`text-xs mt-0.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  最近最重 {last} kg · 较上次 {sign} kg
                </p>
                <div className="flex items-end gap-1 h-6 mt-2">
                  {recent.map((w, i) => (
                    <i
                      key={i}
                      className="w-1.5 rounded-sm block"
                      style={{
                        height: `${Math.max(4, Math.round((w / max) * 24))}px`,
                        backgroundColor: theme.accentColor,
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}

      <div
        className={`p-4 rounded-3xl border flex items-center justify-between gap-3 ${
          theme.isDark ? 'bg-[#121218]/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <h3 className={`text-sm font-extrabold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>工具</h3>
          <p className={`text-xs mt-0.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            1RM 估算 · 杠铃片配重
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onOpen1RMCalc(80, 8)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${
              theme.isDark ? 'border-white/10 text-zinc-200' : 'border-slate-200 text-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            1RM
          </button>
          <button
            onClick={() => onOpenPlateCalc(100)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${
              theme.isDark ? 'border-white/10 text-zinc-200' : 'border-slate-200 text-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            配重
          </button>
        </div>
      </div>
    </div>
  );
};
