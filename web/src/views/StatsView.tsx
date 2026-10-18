import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Dumbbell, Award, Flame, Zap, ArrowUpRight, ChevronRight, Calculator } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { calculate1RM, formatVolume } from '../utils/calculations';
import { getBodyPartName, SHORT_DAYS_ZH } from '../utils/translations';
import { RAW_EXERCISES } from '../utils/storage';
import { ThemeConfig } from '../types/theme';

interface StatsViewProps {
  sessions: WorkoutSession[];
  onOpen1RMCalc: (defaultWeight?: number, defaultReps?: number) => void;
  onOpenPlateCalc: (weight?: number) => void;
  theme: ThemeConfig;
}

export const StatsView: React.FC<StatsViewProps> = ({
  sessions,
  onOpen1RMCalc,
  onOpenPlateCalc,
  theme,
}) => {
  // Find all distinct exercises that have appeared in history
  const exercisedList = useMemo(() => {
    const map = new Map<string, { id: string; name: string; zh?: string; count: number }>();
    sessions.forEach((s) => {
      s.exercises.forEach((e) => {
        const item = map.get(e.exerciseId) || {
          id: e.exerciseId,
          name: e.exerciseName,
          zh: e.exerciseZh,
          count: 0,
        };
        item.count++;
        map.set(e.exerciseId, item);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [sessions]);

  // Selected exercise for deep-dive progress
  const [selectedExId, setSelectedExId] = useState<string>(
    exercisedList.length > 0 ? exercisedList[0].id : '0025'
  );

  // If selectedExId not in exercisedList, set to first available
  const activeEx = exercisedList.find((e) => e.id === selectedExId) || exercisedList[0];

  // 1. Generate 8-Week Activity Heatmap Data
  const heatmapData = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Total 56 days (8 weeks * 7 days)
    const days: { date: Date; dateStr: string; volume: number; hasWorkout: boolean }[] = [];

    // Map sessions by date (YYYY-MM-DD)
    const sessionVolumeByDate: Record<string, number> = {};
    sessions.forEach((s) => {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      sessionVolumeByDate[key] = (sessionVolumeByDate[key] || 0) + (s.totalVolume || 0);
    });

    for (let i = 55; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      const vol = sessionVolumeByDate[key] || 0;
      days.push({
        date: d,
        dateStr: key,
        volume: vol,
        hasWorkout: vol > 0,
      });
    }

    return days;
  }, [sessions]);

  // 2. Muscle Group Volume Distribution
  const muscleDistribution = useMemo(() => {
    const totals: Record<string, number> = {};
    let totalAll = 0;

    sessions.forEach((s) => {
      s.exercises.forEach((e) => {
        const bp = e.bodyPart || 'other';
        let vol = 0;
        e.sets.forEach((set) => {
          if (set.completed) {
            vol += (set.kg || 0) * (set.reps || 0);
          }
        });
        totals[bp] = (totals[bp] || 0) + vol;
        totalAll += vol;
      });
    });

    return Object.entries(totals)
      .map(([bodyPart, volume]) => ({
        bodyPart,
        volume,
        percentage: totalAll > 0 ? Math.round((volume / totalAll) * 100) : 0,
      }))
      .sort((a, b) => b.volume - a.volume);
  }, [sessions]);

  // 3. Performance Trend for Active Selected Exercise
  const exerciseTrend = useMemo(() => {
    if (!activeEx) return [];

    const trendPoints: {
      date: string;
      dateFormatted: string;
      maxWeight: number;
      est1RM: number;
      volume: number;
      repsAtMax: number;
    }[] = [];

    // Chronological order (oldest to newest)
    const chronological = [...sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    chronological.forEach((session) => {
      const found = session.exercises.find((e) => e.exerciseId === activeEx.id);
      if (found) {
        let maxWeight = 0;
        let repsAtMax = 0;
        let best1RM = 0;
        let exVolume = 0;

        found.sets.forEach((set) => {
          if (set.completed && set.kg > 0) {
            exVolume += set.kg * set.reps;
            if (set.kg > maxWeight) {
              maxWeight = set.kg;
              repsAtMax = set.reps;
            }
            const est = calculate1RM(set.kg, set.reps).average;
            if (est > best1RM) {
              best1RM = est;
            }
          }
        });

        if (maxWeight > 0) {
          const d = new Date(session.date);
          trendPoints.push({
            date: session.date,
            dateFormatted: `${d.getMonth() + 1}/${d.getDate()}`,
            maxWeight,
            est1RM: Math.round(best1RM),
            volume: exVolume,
            repsAtMax,
          });
        }
      }
    });

    return trendPoints;
  }, [sessions, activeEx]);

  // Best all-time for selected exercise
  const allTimeBestWeight = exerciseTrend.reduce(
    (max, p) => (p.maxWeight > max ? p.maxWeight : max),
    0
  );
  const allTimeBest1RM = exerciseTrend.reduce(
    (max, p) => (p.est1RM > max ? p.est1RM : max),
    0
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-28 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            训练数据与进阶分析
          </h1>
          <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            追踪 8 周出勤热力图、肌群负荷配比与专项 1RM 极限力量增长曲线
          </p>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onOpenPlateCalc(allTimeBestWeight || 80)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              theme.isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border-white/10'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
            <span>杠铃配重</span>
          </button>
          <button
            onClick={() => onOpen1RMCalc(allTimeBestWeight || 80, 8)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              theme.isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border-white/10'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1RM 计算器</span>
          </button>
        </div>
      </div>

      {/* 8-Week Activity Heatmap Card (Fully Themed!) */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-xl space-y-4 ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: theme.accentColor }} />
            <h2 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              近八周训练活跃度
            </h2>
          </div>
          <span className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            练过的日子会亮起
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-2 min-w-[500px]">
            {heatmapData.map((day, idx) => {
              let dotStyle: React.CSSProperties = {};
              let dotClass = '';

              if (!day.hasWorkout) {
                dotClass = theme.isDark ? 'bg-white/[0.04] border-white/5' : 'bg-slate-100 border-slate-200/80';
              } else {
                if (day.volume > 15000) {
                  dotStyle = {
                    backgroundColor: theme.accentColor,
                    borderColor: theme.accentColor,
                    boxShadow: `0 0 10px ${theme.accentColor}70`,
                  };
                } else if (day.volume > 8000) {
                  dotStyle = {
                    backgroundColor: `${theme.accentColor}cc`,
                    borderColor: theme.accentColor,
                  };
                } else {
                  dotStyle = {
                    backgroundColor: `${theme.accentColor}75`,
                    borderColor: `${theme.accentColor}90`,
                  };
                }
              }

              return (
                <div
                  key={idx}
                  title={`${day.dateStr}: ${day.hasWorkout ? `${formatVolume(day.volume)} kg 容量` : '休息'}`}
                  style={dotStyle}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md border ${dotClass} transition-all hover:scale-125 cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className={`flex items-center justify-between text-[11px] pt-3 border-t ${
          theme.isDark ? 'text-zinc-400 border-white/[0.07]' : 'text-slate-500 border-slate-100'
        }`}>
          <span>56 天周期记录</span>
          <div className="flex items-center gap-1.5">
            <span>低负荷</span>
            <div
              className={`w-2.5 h-2.5 rounded-sm ${theme.isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`}
            />
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: `${theme.accentColor}75` }}
            />
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: `${theme.accentColor}cc` }}
            />
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{
                backgroundColor: theme.accentColor,
                boxShadow: `0 0 6px ${theme.accentColor}80`,
              }}
            />
            <span>高负荷</span>
          </div>
        </div>
      </div>

      {/* Exercise Progression Deep-Dive Card (Fully Themed!) */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-xl space-y-5 ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: theme.accentColor }} />
            <h2 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              动作力量进阶曲线
            </h2>
          </div>

          {/* Exercise Selector Dropdown */}
          {exercisedList.length > 0 && (
            <select
              value={activeEx?.id}
              onChange={(e) => setSelectedExId(e.target.value)}
              className={`rounded-xl px-3 py-1.5 text-xs focus:outline-none border font-medium ${
                theme.isDark
                  ? 'bg-white/[0.05] border-white/10 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {exercisedList.map((ex) => (
                <option key={ex.id} value={ex.id} className={theme.isDark ? 'bg-zinc-900 text-white' : 'bg-white text-slate-800'}>
                  {ex.zh || ex.name} (已练 {ex.count} 次)
                </option>
              ))}
            </select>
          )}
        </div>

        {activeEx ? (
          <div>
            {/* PR Metric Boxes */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div
                className={`p-4 rounded-2xl border ${
                  theme.isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200/70'
                }`}
              >
                <span className={`text-[11px] ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  历史最高重量
                </span>
                <div
                  className="text-xl font-black font-mono mt-1 tabular-nums"
                  style={{ color: theme.accentColor }}
                >
                  {allTimeBestWeight}{' '}
                  <span className={`text-xs font-normal font-sans ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    kg
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  theme.isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200/70'
                }`}
              >
                <span className={`text-[11px] ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  预估极限 1RM
                </span>
                <div className="text-xl font-black font-mono text-amber-400 mt-1 tabular-nums">
                  {allTimeBest1RM}{' '}
                  <span className={`text-xs font-normal font-sans ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    kg
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  theme.isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200/70'
                }`}
              >
                <span className={`text-[11px] ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  记录次数
                </span>
                <div
                  className={`text-xl font-black font-mono mt-1 tabular-nums ${
                    theme.isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {exerciseTrend.length}{' '}
                  <span className={`text-xs font-normal font-sans ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    次
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Trend Bars */}
            {exerciseTrend.length > 0 ? (
              <div className="space-y-3">
                <div className={`flex items-center justify-between text-xs mb-2 ${
                  theme.isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  <span>近 {exerciseTrend.length} 次训练重量递增轨迹</span>
                  <span className="font-mono text-[11px]" style={{ color: theme.accentColor }}>
                    最高重量 / 预估 1RM
                  </span>
                </div>

                <div className="space-y-2">
                  {exerciseTrend.map((point, idx) => {
                    const weightPct = allTimeBest1RM > 0 ? (point.est1RM / allTimeBest1RM) * 100 : 50;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                          theme.isDark
                            ? 'bg-white/[0.02] border-white/5'
                            : 'bg-slate-50 border-slate-200/70'
                        }`}
                      >
                        <div
                          className={`w-16 font-mono text-xs shrink-0 ${
                            theme.isDark ? 'text-zinc-400' : 'text-slate-500'
                          }`}
                        >
                          {point.dateFormatted}
                        </div>

                        {/* Progress Bar Container */}
                        <div
                          className={`flex-1 h-3 rounded-full overflow-hidden relative ${
                            theme.isDark ? 'bg-white/[0.05]' : 'bg-slate-200'
                          }`}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(15, weightPct)}%`,
                              background: `linear-gradient(to right, ${theme.accentColor}99, ${theme.accentColor})`,
                              boxShadow: `0 0 10px ${theme.accentColor}40`,
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-3 shrink-0 font-mono text-right">
                          <span
                            className={`font-bold tabular-nums ${
                              theme.isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {point.maxWeight} kg{' '}
                            <span className={`text-[10px] ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                              × {point.repsAtMax}
                            </span>
                          </span>
                          <span className="text-amber-400/90 font-medium text-[11px] tabular-nums">
                            1RM: {point.est1RM}kg
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 text-xs ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                暂无此动作的训练记录
              </div>
            )}
          </div>
        ) : (
          <div className={`text-center py-12 text-xs ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            暂无动作统计，在训练中记录动作后将自动生成进阶分析图表。
          </div>
        )}
      </div>

      {/* Muscle Group Distribution Section (Fully Themed!) */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-xl space-y-4 ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" style={{ color: theme.accentColor }} />
            <h2 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              肌群训练容量占比
            </h2>
          </div>
          <span className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            全面均衡发展
          </span>
        </div>

        {muscleDistribution.length === 0 ? (
          <div className={`text-center py-8 text-xs ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            暂无肌群数据
          </div>
        ) : (
          <div className="space-y-3.5">
            {muscleDistribution.map((item) => (
              <div key={item.bodyPart} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold ${theme.isDark ? 'text-zinc-200' : 'text-slate-800'}`}
                  >
                    {getBodyPartName(item.bodyPart)}
                  </span>
                  <span
                    className={`font-mono ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}
                  >
                    {formatVolume(item.volume)} kg ({item.percentage}%)
                  </span>
                </div>
                <div
                  className={`w-full h-2 rounded-full overflow-hidden ${
                    theme.isDark ? 'bg-white/[0.05]' : 'bg-slate-100'
                  }`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: theme.accentColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
