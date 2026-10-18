import React from 'react';
import { Play, Plus, Calendar, Flame, CheckCircle2, Trophy, Clock, ArrowRight, Dumbbell, Sparkles, ChevronRight } from 'lucide-react';
import { WeekSchedule, WorkoutSession, WorkoutTemplate } from '../types/gym';
import { DAYS_ZH, SHORT_DAYS_ZH } from '../utils/translations';
import { formatDurationHuman, formatVolume } from '../utils/calculations';
import { ThemeConfig } from '../types/theme';
import { FitnessHeroStage } from '../components/FitnessHeroStage';
import { FitnessBentoGrid } from '../components/FitnessBentoGrid';

interface TodayWorkoutViewProps {
  schedule: WeekSchedule;
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  onStartTemplateWorkout: (template: WorkoutTemplate) => void;
  onStartEmptyWorkout: () => void;
  onNavigateToTab: (tab: 'plan' | 'history' | 'stats' | 'library') => void;
  onSelectTemplate: (template: WorkoutTemplate) => void;
  onOpenSessionDetail: (session: WorkoutSession) => void;
  theme: ThemeConfig;
  onOpenThemeModal: () => void;
  onOpen1RMCalc: () => void;
  onOpenPlateCalc: () => void;
}

export const TodayWorkoutView: React.FC<TodayWorkoutViewProps> = ({
  schedule,
  templates,
  sessions,
  onStartTemplateWorkout,
  onStartEmptyWorkout,
  onNavigateToTab,
  onSelectTemplate,
  onOpenSessionDetail,
  theme,
  onOpenThemeModal,
  onOpen1RMCalc,
  onOpenPlateCalc,
}) => {
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 = Sun, 1 = Mon ...
  const scheduledTemplateId = schedule[currentDayIndex];
  const scheduledTemplate = templates.find((t) => t.id === scheduledTemplateId);

  // Compute week statistics
  const startOfWeek = new Date(today);
  const dayOffset = (today.getDay() + 6) % 7; // Monday as 0
  startOfWeek.setDate(today.getDate() - dayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter(
    (s) => new Date(s.date).getTime() >= startOfWeek.getTime()
  );

  const weekVolume = thisWeekSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
  const weekSets = thisWeekSessions.reduce((sum, s) => sum + (s.completedSets || 0), 0);
  const weekSessionsCount = thisWeekSessions.length;

  // PRs broken
  const allPrsCount = sessions.reduce((acc, s) => acc + (s.newPrs?.length || 0), 0);

  // Most recent past session
  const lastSession = sessions.length > 0
    ? [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-28 md:pb-16">
      {/* 1. Gorgeous Fitness Hero Stage with Solar Eclipse Horizon Glow (Matching Reference Images 1 & 3) */}
      <FitnessHeroStage
        theme={theme}
        scheduledTemplate={scheduledTemplate}
        onStartToday={() => {
          if (scheduledTemplate) {
            onStartTemplateWorkout(scheduledTemplate);
          } else {
            onStartEmptyWorkout();
          }
        }}
        onStartEmpty={onStartEmptyWorkout}
        onOpenLibrary={() => onNavigateToTab('library')}
        onOpenThemeModal={onOpenThemeModal}
        sessionsCount={sessions.length}
        weekVolume={weekVolume}
        recentPRCount={allPrsCount}
      />

      {/* 2. Today's Immediate Action Card */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 relative overflow-hidden shadow-xl ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className={`text-xs font-bold ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {DAYS_ZH[currentDayIndex]} · {today.getMonth() + 1}月{today.getDate()}日排期
              </span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              {scheduledTemplate ? scheduledTemplate.name : '今日休息日 (Rest Day)'}
            </h2>
            <p className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              {scheduledTemplate
                ? scheduledTemplate.description || '按周期计划执行今日动作组与渐进负荷'
                : '充分睡眠与蛋白质补充也是肌肉增长的关键环节。若精力充沛也可开启自由练。'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {scheduledTemplate ? (
              <button
                onClick={() => onStartTemplateWorkout(scheduledTemplate)}
                className="px-5 py-3 rounded-2xl font-bold text-xs text-slate-950 shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 6px 20px ${theme.accentColor}35`,
                }}
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>立即开练</span>
              </button>
            ) : null}

            <button
              onClick={onStartEmptyWorkout}
              className={`px-4 py-3 rounded-2xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                theme.isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>自由空训练</span>
            </button>
          </div>
        </div>

        {/* Exercises Preview in Scheduled Template */}
        {scheduledTemplate && (
          <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-zinc-500">计划动作:</span>
            {scheduledTemplate.exercises.map((ex, i) => (
              <span
                key={i}
                className={`text-xs px-2.5 py-1 rounded-lg border ${
                  theme.isDark
                    ? 'bg-white/[0.03] border-white/5 text-zinc-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {ex.exerciseZh || ex.exerciseName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Seven-Day Cyclical Schedule Bar */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          theme.isDark ? 'bg-[#121218]/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: theme.accentColor }} />
            <h3 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              七日训练排期
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('plan')}
            className="text-xs font-semibold flex items-center gap-1 hover:underline"
            style={{ color: theme.accentColor }}
          >
            <span>定制周计划</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
            const isCurrent = dayIdx === currentDayIndex;
            const tplId = schedule[dayIdx];
            const tpl = templates.find((t) => t.id === tplId);

            return (
              <div
                key={dayIdx}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? theme.isDark
                      ? 'bg-white/10 border-white/30 text-white shadow-md'
                      : 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : theme.isDark
                    ? 'bg-white/[0.02] border-white/5 text-zinc-400'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600'
                }`}
                style={
                  isCurrent
                    ? {
                        borderTop: `3px solid ${theme.accentColor}`,
                      }
                    : {}
                }
              >
                <div
                  className={`text-[11px] font-bold ${
                    isCurrent ? (theme.isDark ? 'text-white' : 'text-white') : 'text-zinc-500'
                  }`}
                >
                  {SHORT_DAYS_ZH[dayIdx]}
                </div>
                <div className="text-xs font-semibold truncate mt-1">
                  {tpl ? tpl.name.split(' ')[0] : '休息'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Fitness Bento Grid (Matching Reference Images 1 & 3) */}
      <FitnessBentoGrid
        theme={theme}
        onOpen1RM={onOpen1RMCalc}
        onOpenPlate={onOpenPlateCalc}
        onOpenLibrary={() => onNavigateToTab('library')}
      />

      {/* 5. Last Session Highlight */}
      {lastSession && (
        <div
          className={`p-5 sm:p-6 rounded-3xl border transition-all ${
            theme.isDark ? 'bg-[#121218]/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400">上次训练回顾</span>
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-xs font-semibold hover:underline"
              style={{ color: theme.accentColor }}
            >
              查看全部历史
            </button>
          </div>

          <div
            onClick={() => onOpenSessionDetail(lastSession)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              theme.isDark
                ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/10'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div>
              <div className={`font-bold text-sm ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                {lastSession.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span>{new Date(lastSession.date).toLocaleDateString()}</span>
                <span>·</span>
                <span>{formatDurationHuman(lastSession.duration)}</span>
                <span>·</span>
                <span className="font-mono font-bold" style={{ color: theme.accentColor }}>
                  {formatVolume(lastSession.totalVolume)} kg
                </span>
                <span>·</span>
                <span>{lastSession.completedSets} 组</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      )}
    </div>
  );
};
