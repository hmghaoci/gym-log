import React from 'react';
import { Sparkles, Dumbbell, Clock, Calculator, Zap, ShieldCheck, ArrowRight, BookOpen, Flame } from 'lucide-react';
import { ThemeConfig } from '../types/theme';

interface FitnessBentoGridProps {
  theme: ThemeConfig;
  onOpen1RM: () => void;
  onOpenPlate: () => void;
  onOpenLibrary: () => void;
}

export const FitnessBentoGrid: React.FC<FitnessBentoGridProps> = ({
  theme,
  onOpen1RM,
  onOpenPlate,
  onOpenLibrary,
}) => {
  return (
    <div className="space-y-6 pt-4 pb-12">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: theme.accentColor }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>科学训练系统架构</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          为真正的力量追求者打造
        </h2>
        <p className={`text-xs sm:text-sm ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
          汲取现代仪表盘美学设计，消除传统健身 App 杂乱广告与繁琐跳转
        </p>
      </div>

      {/* Bento Grid Layout (Inspired by Reference Images 1 & 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bento 1: Auto Previous Performance */}
        <div
          className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
            theme.isDark
              ? 'bg-[#121218]/80 hover:bg-[#161620] border-white/10 hover:border-white/20'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${theme.accentColor}15`,
                color: theme.accentColor,
                border: `1px solid ${theme.accentColor}30`,
              }}
            >
              <Flame className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              上次成绩自动带入
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              开练即自动展示上次完成的重量与次数。无需翻找历史记录，轻松执行渐进式超负荷。
            </p>
          </div>

          <div
            className={`mt-4 p-3 rounded-xl border font-mono text-xs flex items-center justify-between ${
              theme.isDark ? 'bg-white/[0.03] border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>卧推 上次: 75kg × 8次</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold" style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}>
              +2.5kg 超负荷
            </span>
          </div>
        </div>

        {/* Bento 2: Smart Rest Timer */}
        <div
          className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
            theme.isDark
              ? 'bg-[#121218]/80 hover:bg-[#161620] border-white/10 hover:border-white/20'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${theme.accentColor}15`,
                color: theme.accentColor,
                border: `1px solid ${theme.accentColor}30`,
              }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              触觉与音频组间休息
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              打勾组数即刻触发无缝倒计时，支持后台运行与悬浮迷你徽标，Web Audio 和弦提示音精准提醒。
            </p>
          </div>

          <div
            className={`mt-4 p-3 rounded-xl border font-mono text-xs flex items-center justify-between ${
              theme.isDark ? 'bg-white/[0.03] border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>休息中 · 01:28</span>
            <span className="text-[11px] text-emerald-400">环形进度 45%</span>
          </div>
        </div>

        {/* Bento 3: 1RM Power Calculator */}
        <div
          onClick={onOpen1RM}
          className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer ${
            theme.isDark
              ? 'bg-[#121218]/80 hover:bg-[#161620] border-white/10 hover:border-white/20'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                1RM 极限力量推算
              </h3>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className={`text-xs mt-1.5 leading-relaxed ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              基于国际举重界公认的 Brzycki 与 Epley 算法，实时推演极限重量与各百分比强度区间。
            </p>
          </div>

          <div
            className={`mt-4 p-3 rounded-xl border font-mono text-xs flex items-center justify-between ${
              theme.isDark ? 'bg-white/[0.03] border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>80kg × 8次</span>
            <span className="text-amber-400 font-bold">1RM ≈ 99.2kg</span>
          </div>
        </div>

        {/* Bento 4: Barbell Plate Calculator */}
        <div
          onClick={onOpenPlate}
          className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer ${
            theme.isDark
              ? 'bg-[#121218]/80 hover:bg-[#161620] border-white/10 hover:border-white/20'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${theme.accentColor}15`,
                color: theme.accentColor,
                border: `1px solid ${theme.accentColor}30`,
              }}
            >
              <Calculator className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                奥林匹克杠铃片配重
              </h3>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className={`text-xs mt-1.5 leading-relaxed ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              输入 100kg 或任意目标重量，即刻呈现 25/20/15/10/5/2.5kg 杠铃片单边挂载配比。
            </p>
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            <span className="w-3 h-5 rounded-sm bg-blue-600 inline-block" title="20kg" />
            <span className="w-3 h-5 rounded-sm bg-blue-600 inline-block" title="20kg" />
            <span className="w-2.5 h-4 rounded-sm bg-slate-400 inline-block" title="2.5kg" />
            <span className="text-[11px] font-mono text-zinc-400 ml-2">单边挂载 42.5kg</span>
          </div>
        </div>

        {/* Bento 5: 1,300+ Exercise Encyclopedia */}
        <div
          onClick={onOpenLibrary}
          className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer ${
            theme.isDark
              ? 'bg-[#121218]/80 hover:bg-[#161620] border-white/10 hover:border-white/20'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{
                backgroundColor: `${theme.accentColor}15`,
                color: theme.accentColor,
                border: `1px solid ${theme.accentColor}30`,
              }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                1,300+ 动作动画百科
              </h3>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className={`text-xs mt-1.5 leading-relaxed ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              覆盖胸、背、肩、腿、臂、核心等全身体征部位。中文标准执行步骤与 GymVisual 动态教学。
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
            <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/5">胸部 150+</span>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/5">背部 180+</span>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/5">腿部 210+</span>
          </div>
        </div>

        {/* Bento 6: Privacy First Offline Local Storage */}
        <div
          className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
            theme.isDark
              ? 'bg-[#121218]/80 hover:bg-[#161620] border-white/10 hover:border-white/20'
              : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              零追踪 · 100% 本地隐私
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              所有健身记录保存在本地，无需注册或连网，支持一键导出/导入完整的 JSON 数据备份。
            </p>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>无服务器抓取 · 数据完全归你所有</span>
          </div>
        </div>
      </div>
    </div>
  );
};
