import React from 'react';
import { Play, Dumbbell, Flame, Trophy, TrendingUp, Sparkles, Clock, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ThemeConfig } from '../types/theme';
import { WorkoutSession, WorkoutTemplate } from '../types/gym';
import { formatVolume } from '../utils/calculations';

interface FitnessHeroStageProps {
  theme: ThemeConfig;
  scheduledTemplate?: WorkoutTemplate;
  onStartToday: () => void;
  onStartEmpty: () => void;
  onOpenLibrary: () => void;
  onOpenThemeModal: () => void;
  sessionsCount: number;
  weekVolume: number;
  recentPRCount: number;
}

export const FitnessHeroStage: React.FC<FitnessHeroStageProps> = ({
  theme,
  scheduledTemplate,
  onStartToday,
  onStartEmpty,
  onOpenLibrary,
  onOpenThemeModal,
  sessionsCount,
  weekVolume,
  recentPRCount,
}) => {
  return (
    <div className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Horizon Radial Glow & Eclipse Arc (Inspired by Reference Images 1 & 3) */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-start overflow-hidden -z-10">
        {/* Soft Ambient Light Cone */}
        <div
          className="w-[700px] sm:w-[900px] h-[350px] sm:h-[450px] rounded-full blur-[100px] opacity-40 transition-all duration-700 -translate-y-20"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* The Solar Eclipse / Horizon Laser Arc */}
        <div
          className="absolute top-[280px] sm:top-[260px] w-[95%] sm:w-[85%] max-w-5xl h-[120px] rounded-[100%] border-t transition-all duration-700"
          style={{
            borderColor: theme.accentColor,
            boxShadow: `0 -12px 60px ${theme.accentColor}55`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
        {/* Top Kicker Label (Clean Unboxed & Subtle Glow) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-xs font-medium">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme.accentColor }}
          />
          <span className={theme.isDark ? 'text-zinc-200' : 'text-slate-700'}>
            离线优先 · 1,300+ 标准动作 · 智能力量进阶系统
          </span>
        </div>

        {/* Grand Headline (Inspired by "Finance That Grows with Your Ambition" / "We manage the Finance process") */}
        <h1
          className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${
            theme.isDark ? 'text-white' : 'text-slate-900'
          }`}
          style={{ textWrap: 'balance' }}
        >
          每克力量，皆在此处{' '}
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.accentColor}, #ffffff)`,
            }}
          >
            重塑超量恢复
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-xs sm:text-base max-w-2xl mx-auto leading-relaxed ${
            theme.isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}
        >
          告别杂乱的纸笔与笨拙的笔记。自动带入上次成绩、毫秒级组间休息计时、精准肌群负荷热力图，专为严肃健身与力量训练者打造。
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <button
            onClick={onStartToday}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-slate-950 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: theme.accentColor,
              boxShadow: `0 10px 30px ${theme.accentColor}40`,
            }}
          >
            <Play className="w-4 h-4 fill-slate-950 group-hover:translate-x-0.5 transition-transform" />
            <span>
              {scheduledTemplate ? `开始今日训练 (${scheduledTemplate.name.split(' ')[0]})` : '开启自由训练'}
            </span>
          </button>

          <button
            onClick={onOpenLibrary}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-semibold border backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 ${
              theme.isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-200 hover:text-white'
                : 'bg-white/80 hover:bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-zinc-400" />
            <span>浏览 1,300+ 动作百科</span>
          </button>
        </div>

        {/* Theme Quick Switcher Hint */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-[11px] text-zinc-500">当前风格: {theme.name}</span>
          <button
            onClick={onOpenThemeModal}
            className="text-[11px] font-medium underline underline-offset-2 transition-colors"
            style={{ color: theme.accentColor }}
          >
            切换主题 (4款美学配色)
          </button>
        </div>
      </div>

      {/* Floating High-Tech Fitness Dashboard Mockup (Matching the UI in Reference Image 1 & 2) */}
      <div className="relative mt-8 sm:mt-12 max-w-4xl mx-auto">
        {/* Glow halo under dashboard card */}
        <div
          className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 transition-all duration-500 pointer-events-none"
          style={{ backgroundColor: theme.accentColor }}
        />

        <div
          className={`relative rounded-3xl border backdrop-blur-xl p-5 sm:p-7 shadow-2xl transition-all duration-500 overflow-hidden ${
            theme.isDark
              ? 'bg-[#121218]/90 border-white/10 shadow-black/80'
              : 'bg-white/90 border-slate-200/90 shadow-slate-300/40'
          }`}
        >
          {/* Mockup Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.07] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <span
                  className={`text-sm sm:text-base font-bold tracking-tight ${
                    theme.isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  力量控制台 · 智能力量训练面板
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                实时捕获今日负荷 · 渐进式超负荷算法护航
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
                style={{
                  backgroundColor: `${theme.accentColor}15`,
                  color: theme.accentColor,
                  border: `1px solid ${theme.accentColor}30`,
                }}
              >
                出勤 {sessionsCount} 次已记录
              </span>
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                  theme.isDark
                    ? 'bg-white/[0.03] border-white/10 text-zinc-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                8周周期分析
              </span>
            </div>
          </div>

          {/* Mockup Content Grid: 3 Metric Bento Cards + Volume Bar Chart */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5">
            {/* Metric 1: Total Volume */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                theme.isDark
                  ? 'bg-white/[0.02] border-white/5'
                  : 'bg-slate-50/80 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>本周训练总容量</span>
                <Flame className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              </div>
              <div
                className={`text-2xl font-black font-mono tracking-tight tabular-nums ${
                  theme.isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {formatVolume(weekVolume > 0 ? weekVolume : 18500)}{' '}
                <span className="text-xs font-normal text-zinc-400 font-sans">kg</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1.5">
                <TrendingUp className="w-3 h-3" />
                <span>较上周稳定递增 +12.4%</span>
              </div>
            </div>

            {/* Metric 2: PRs Broken */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                theme.isDark
                  ? 'bg-white/[0.02] border-white/5'
                  : 'bg-slate-50/80 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>历史 PR 突破</span>
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div
                className={`text-2xl font-black font-mono tracking-tight tabular-nums ${
                  theme.isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {recentPRCount > 0 ? recentPRCount : 8}{' '}
                <span className="text-xs font-normal text-zinc-400 font-sans">项新纪录</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 mt-1.5">
                <Zap className="w-3 h-3" />
                <span>深蹲 / 卧推 1RM 刷新</span>
              </div>
            </div>

            {/* Metric 3: Rest Timer Status */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                theme.isDark
                  ? 'bg-white/[0.02] border-white/5'
                  : 'bg-slate-50/80 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>智能组间休息</span>
                <Clock className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              </div>
              <div
                className={`text-2xl font-black font-mono tracking-tight tabular-nums ${
                  theme.isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                90{' '}
                <span className="text-xs font-normal text-zinc-400 font-sans">秒推荐</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>打勾即启 · 纯前端和弦提示</span>
              </div>
            </div>
          </div>

          {/* High-Fidelity Fitness Volume Bar Chart (Matching Reference 1 & 3 visual chart) */}
          <div
            className={`mt-4 p-4 rounded-2xl border ${
              theme.isDark
                ? 'bg-white/[0.015] border-white/5'
                : 'bg-slate-50/60 border-slate-200/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-3">
              <span className={theme.isDark ? 'text-zinc-300 font-semibold' : 'text-slate-700 font-semibold'}>
                周期负荷频谱 · 一周训练容量分布
              </span>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  主攻肌群
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-zinc-600" />
                  辅助刺激
                </span>
              </div>
            </div>

            {/* Stylized Bar Chart */}
            <div className="grid grid-cols-7 gap-2 items-end h-24 pt-2">
              {[
                { day: '周一·胸', height: '80%', isHighlight: true, val: '4,200kg' },
                { day: '周二·休', height: '15%', isHighlight: false, val: '恢复' },
                { day: '周三·背', height: '90%', isHighlight: true, val: '5,100kg' },
                { day: '周四·休', height: '15%', isHighlight: false, val: '恢复' },
                { day: '周五·腿', height: '100%', isHighlight: true, val: '6,400kg' },
                { day: '周六·臂', height: '65%', isHighlight: true, val: '3,200kg' },
                { day: '周日·休', height: '15%', isHighlight: false, val: '超量恢复' },
              ].map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.val}
                  </span>
                  <div className="w-full bg-white/[0.05] rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className="w-full rounded-t-md transition-all duration-700 group-hover:brightness-125"
                      style={{
                        height: bar.height,
                        backgroundColor: bar.isHighlight ? theme.accentColor : '#52525b',
                        boxShadow: bar.isHighlight ? `0 0 15px ${theme.accentColor}55` : 'none',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400 truncate w-full text-center">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
