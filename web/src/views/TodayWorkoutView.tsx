import React from 'react';
import { Play, Plus, BookOpen } from 'lucide-react';
import { WeekSchedule, WorkoutSession, WorkoutTemplate } from '../types/gym';
import { DAYS_ZH } from '../utils/translations';
import { formatVolume } from '../utils/calculations';
import { ThemeConfig } from '../types/theme';

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
  theme,
  onOpenThemeModal,
}) => {
  const today = new Date();
  const currentDayIndex = today.getDay();
  const scheduledTemplateId = schedule[currentDayIndex];
  const scheduledTemplate = templates.find((t) => t.id === scheduledTemplateId);

  const startOfWeek = new Date(today);
  const dayOffset = (today.getDay() + 6) % 7;
  startOfWeek.setDate(today.getDate() - dayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter(
    (s) => new Date(s.date).getTime() >= startOfWeek.getTime()
  );
  const weekVolume = thisWeekSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
  const weekSessionsCount = thisWeekSessions.length;

  return (
    <div className="max-w-xl mx-auto pb-28 md:pb-16 min-h-[70vh] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 8px 20px ${theme.accentColor}40`,
            }}
          >
            训
          </div>
          <span className={`text-lg font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            健身记录
          </span>
        </div>
        <button
          onClick={() => onNavigateToTab('library')}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border ${
            theme.isDark
              ? 'bg-white/[0.04] border-white/10 text-zinc-300'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          动作库
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <div className={`text-sm font-semibold flex items-center gap-2 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            {DAYS_ZH[currentDayIndex]} · {today.getMonth() + 1}月{today.getDate()}日
          </div>
          <h1
            className={`mt-2 text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
              theme.isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {scheduledTemplate ? scheduledTemplate.name : '今日休息'}
          </h1>
          <p className={`mt-3 text-sm leading-relaxed max-w-[30ch] ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {scheduledTemplate
              ? scheduledTemplate.description || '按今天的周计划开练。临时加动作进动作库。'
              : '今天没有排期。精力够也可以自由练。'}
          </p>
        </div>

        <div
          className={`flex gap-8 pt-4 border-t ${
            theme.isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div>
            <div className={`text-xl font-black tabular-nums ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatVolume(weekVolume)}
            </div>
            <div className={`text-xs mt-0.5 ${theme.isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
              本周容量 kg
            </div>
          </div>
          <div>
            <div className={`text-xl font-black tabular-nums ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              {weekSessionsCount}
            </div>
            <div className={`text-xs mt-0.5 ${theme.isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
              本周已练
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3 pt-8">
          {scheduledTemplate ? (
            <button
              onClick={() => onStartTemplateWorkout(scheduledTemplate)}
              className="w-full px-5 py-4 rounded-2xl font-bold text-sm text-slate-950 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: theme.accentColor,
                boxShadow: `0 10px 28px ${theme.accentColor}35`,
              }}
            >
              <Play className="w-4 h-4 fill-slate-950" />
              立即开练
            </button>
          ) : null}

          <button
            onClick={onStartEmptyWorkout}
            className={`w-full px-5 py-3.5 rounded-2xl text-sm font-semibold border flex items-center justify-center gap-2 ${
              theme.isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-200'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            自由空训练
          </button>

          <div className="flex justify-between px-1 pt-1">
            <button
              onClick={() => onNavigateToTab('plan')}
              className="text-sm font-bold"
              style={{ color: theme.accentColor }}
            >
              改周计划
            </button>
            <button
              onClick={onOpenThemeModal}
              className="text-sm font-bold"
              style={{ color: theme.accentColor }}
            >
              主题与设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
