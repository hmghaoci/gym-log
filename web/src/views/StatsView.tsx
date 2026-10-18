import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Dumbbell, Award, Flame, Zap, ArrowUpRight, ChevronRight, Calculator } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { calculate1RM, formatVolume } from '../utils/calculations';
import { getBodyPartName, SHORT_DAYS_ZH } from '../utils/translations';
import { RAW_EXERCISES } from '../utils/storage';

interface StatsViewProps {
  sessions: WorkoutSession[];
  onOpen1RMCalc: (defaultWeight?: number, defaultReps?: number) => void;
  onOpenPlateCalc: (weight?: number) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  sessions,
  onOpen1RMCalc,
  onOpenPlateCalc,
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
    const dayOfWeek = today.getDay(); // 0 is Sunday

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
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">训练数据与进阶分析</h1>
          <p className="text-xs text-slate-400 mt-1">
            追踪 8 周出勤热力图、肌群负荷配比与专项 1RM 极限力量增长曲线
          </p>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onOpenPlateCalc(allTimeBestWeight || 80)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>杠铃配重</span>
          </button>
          <button
            onClick={() => onOpen1RMCalc(allTimeBestWeight || 80, 8)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1RM 计算器</span>
          </button>
        </div>
      </div>

      {/* 8-Week Activity Heatmap */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">近八周训练活跃度</h2>
          </div>
          <span className="text-xs text-slate-400">练过的日子会亮起</span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
            {heatmapData.map((day, idx) => {
              let bgClass = 'bg-slate-800/40 border-slate-800/60';
              if (day.hasWorkout) {
                if (day.volume > 15000) bgClass = 'bg-emerald-400 border-emerald-300';
                else if (day.volume > 8000) bgClass = 'bg-emerald-500 border-emerald-400';
                else bgClass = 'bg-emerald-600/80 border-emerald-500/80';
              }

              return (
                <div
                  key={idx}
                  title={`${day.dateStr}: ${day.hasWorkout ? `${formatVolume(day.volume)} kg 容量` : '休息'}`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md border ${bgClass} transition-transform hover:scale-125 cursor-pointer`}
                />
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span>56 天周期记录</span>
          <div className="flex items-center gap-1.5">
            <span>低负荷</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span>高负荷</span>
          </div>
        </div>
      </div>

      {/* Exercise Progression Deep-Dive */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">动作力量进阶曲线</h2>
          </div>

          {/* Exercise Selector Dropdown */}
          {exercisedList.length > 0 && (
            <select
              value={activeEx?.id}
              onChange={(e) => setSelectedExId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {exercisedList.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.zh || ex.name} (已练 {ex.count} 次)
                </option>
              ))}
            </select>
          )}
        </div>

        {activeEx ? (
          <div>
            {/* PR Accolades */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">历史最高重量</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  {allTimeBestWeight} <span className="text-xs font-normal text-slate-400">kg</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">预估极限 1RM</span>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                  {allTimeBest1RM} <span className="text-xs font-normal text-slate-400">kg</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">记录次数</span>
                <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                  {exerciseTrend.length} <span className="text-xs font-normal text-slate-400">次</span>
                </div>
              </div>
            </div>

            {/* Visual Trend Bars */}
            {exerciseTrend.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>近 {exerciseTrend.length} 次训练重量递增轨迹</span>
                  <span className="font-mono text-[11px] text-emerald-400">最高重量 / 预估 1RM</span>
                </div>

                <div className="space-y-2">
                  {exerciseTrend.map((point, idx) => {
                    const weightPct = allTimeBest1RM > 0 ? (point.est1RM / allTimeBest1RM) * 100 : 50;

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="w-16 font-mono text-slate-400 text-xs shrink-0">
                          {point.dateFormatted}
                        </div>

                        {/* Progress Bar Container */}
                        <div className="flex-1 bg-slate-800/80 h-3 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(15, weightPct)}%` }}
                          />
                        </div>

                        <div className="flex items-center gap-3 shrink-0 font-mono text-right">
                          <span className="text-white font-bold tabular-nums">
                            {point.maxWeight} kg <span className="text-[10px] text-slate-400">× {point.repsAtMax}</span>
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
              <div className="text-center py-8 text-xs text-slate-500">
                暂无此动作的训练记录
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            暂无动作统计，在训练中记录动作后将自动生成进阶分析图表。
          </div>
        )}
      </div>

      {/* Muscle Group Distribution Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">肌群训练容量占比</h2>
          </div>
          <span className="text-xs text-slate-400">全面均衡发展</span>
        </div>

        {muscleDistribution.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            暂无肌群数据
          </div>
        ) : (
          <div className="space-y-3">
            {muscleDistribution.map((item) => (
              <div key={item.bodyPart} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">
                    {getBodyPartName(item.bodyPart)}
                  </span>
                  <span className="font-mono text-slate-400">
                    {formatVolume(item.volume)} kg ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
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
