export type ThemeStyle = 'eclipse' | 'aurora' | 'clean' | 'emerald';

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  enName: string;
  description: string;
  isDark: boolean;
  accentColor: string;
  accentGradient: string;
  bgCanvas: string;
  bgSurface: string;
  bgCard: string;
  borderColor: string;
  borderGlow: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  horizonGlow: string;
  tagColor: string;
  tagBg: string;
}

export const THEMES: Record<ThemeStyle, ThemeConfig> = {
  eclipse: {
    id: 'eclipse',
    name: '日蚀熔岩 (Eclipse Amber)',
    enName: 'Obsidian Flare',
    description: '暗夜黑曜石与耀眼日蚀熔岩橙光，极具冲击力的现代科技感',
    isDark: true,
    accentColor: '#f97316',
    accentGradient: 'from-orange-500 via-amber-500 to-yellow-500',
    bgCanvas: '#070709',
    bgSurface: '#101014',
    bgCard: 'bg-[#15151c]/90',
    borderColor: 'border-white/[0.08]',
    borderGlow: 'border-orange-500/40 shadow-lg shadow-orange-500/15',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-300',
    textMuted: 'text-zinc-400',
    horizonGlow: 'from-orange-600/30 via-amber-500/15 to-transparent',
    tagColor: 'text-orange-400',
    tagBg: 'bg-orange-500/10 border-orange-500/30',
  },
  aurora: {
    id: 'aurora',
    name: '极光幻夜 (Cyber Aurora)',
    enName: 'Neon Midnight',
    description: '深邃幻夜紫与赛博青霓虹光束，梦幻未来主义力量美学',
    isDark: true,
    accentColor: '#8b5cf6',
    accentGradient: 'from-violet-600 via-purple-500 to-cyan-400',
    bgCanvas: '#07060f',
    bgSurface: '#0f0d1e',
    bgCard: 'bg-[#16132b]/90',
    borderColor: 'border-white/[0.08]',
    borderGlow: 'border-purple-500/40 shadow-lg shadow-purple-500/15',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    horizonGlow: 'from-purple-600/30 via-cyan-500/15 to-transparent',
    tagColor: 'text-purple-400',
    tagBg: 'bg-purple-500/10 border-purple-500/30',
  },
  clean: {
    id: 'clean',
    name: '极简净白 (Frosted Studio)',
    enName: 'Clean Studio',
    description: '轻盈通透的磨砂微光纯白美学，清爽干净的呼吸感',
    isDark: false,
    accentColor: '#0ea5e9',
    accentGradient: 'from-sky-500 via-teal-500 to-emerald-500',
    bgCanvas: '#f8fafc',
    bgSurface: '#ffffff',
    bgCard: 'bg-white/85',
    borderColor: 'border-slate-200/80',
    borderGlow: 'border-sky-500/40 shadow-xl shadow-sky-500/10',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    horizonGlow: 'from-sky-400/20 via-teal-400/10 to-transparent',
    tagColor: 'text-sky-600',
    tagBg: 'bg-sky-50 border-sky-200',
  },
  emerald: {
    id: 'emerald',
    name: '黑曜钛金 (Titanium Lime)',
    enName: 'Athletic Green',
    description: '碳纤维深灰底色与活力荧光草绿，专业硬核力量健身',
    isDark: true,
    accentColor: '#10b981',
    accentGradient: 'from-emerald-500 via-teal-500 to-lime-400',
    bgCanvas: '#080c14',
    bgSurface: '#0e1624',
    bgCard: 'bg-[#131d2e]/90',
    borderColor: 'border-white/[0.08]',
    borderGlow: 'border-emerald-500/40 shadow-lg shadow-emerald-500/15',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    horizonGlow: 'from-emerald-600/30 via-teal-500/15 to-transparent',
    tagColor: 'text-emerald-400',
    tagBg: 'bg-emerald-500/10 border-emerald-500/30',
  },
};
