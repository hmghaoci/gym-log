import React from 'react';
import { Dumbbell, Calendar, BookOpen, History, BarChart3, Settings, Play, Calculator, Palette } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { formatDurationTimer } from '../utils/calculations';
import { ThemeConfig } from '../types/theme';

export type NavTab = 'workout' | 'plan' | 'library' | 'history' | 'stats' | 'tools' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeWorkout: WorkoutSession | null;
  activeElapsedSeconds: number;
  onOpenActiveWorkout: () => void;
  onOpenPlateCalc: () => void;
  onOpenThemeModal: () => void;
  theme: ThemeConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeWorkout,
  activeElapsedSeconds,
  onOpenActiveWorkout,
  onOpenPlateCalc,
  onOpenThemeModal,
  theme,
}) => {
  return (
    <>
      {/* Desktop Top Header (Strict 3-zone contract) */}
      <header
        className={`sticky top-0 z-30 w-full backdrop-blur-xl border-b transition-colors duration-300 ${
          theme.isDark
            ? 'bg-[#070709]/85 border-white/[0.08]'
            : 'bg-white/85 border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single text wordmark with subtle themed mark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('workout')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                style={{
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 4px 15px ${theme.accentColor}40`,
                }}
              >
                <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-lg font-black tracking-tight font-sans whitespace-nowrap ${
                    theme.isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  健身记录
                </span>
                <span
                  className="text-[10px] font-semibold tracking-wide whitespace-nowrap"
                  style={{ color: theme.accentColor }}
                >
                  力量进阶引擎
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'workout', label: '训练' },
              { id: 'plan', label: '计划' },
              { id: 'library', label: '动作库' },
              { id: 'history', label: '历史' },
              { id: 'stats', label: '数据统计' },
            ].map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? theme.isDark
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'bg-slate-900 text-white shadow-sm'
                      : theme.isDark
                      ? 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  style={
                    isActive
                      ? {
                          color: theme.isDark ? '#ffffff' : '#ffffff',
                          borderBottom: `2px solid ${theme.accentColor}`,
                        }
                      : {}
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + Theme Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Theme Switcher Trigger */}
            <button
              onClick={onOpenThemeModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                theme.isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-zinc-300 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
              }`}
              title="切换主题风格 (日蚀熔岩 / 极光幻夜 / 极简净白 / 黑曜钛金)"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className="hidden sm:inline text-[11px] font-semibold">{theme.name.split(' ')[0]}</span>
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Quick Plate Calculator */}
            <button
              onClick={onOpenPlateCalc}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                theme.isDark
                  ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-zinc-300 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
              title="杠铃片配重计算"
            >
              <Calculator className="w-3.5 h-3.5 text-zinc-400" />
              <span>杠铃配重</span>
            </button>

            {activeWorkout ? (
              <button
                onClick={onOpenActiveWorkout}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 shadow-lg transition-all animate-pulse whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: theme.accentColor,
                  boxShadow: `0 4px 15px ${theme.accentColor}50`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <span>进行中 {formatDurationTimer(activeElapsedSeconds)}</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('settings')}
                className={`p-2 rounded-xl transition-colors ${
                  theme.isDark
                    ? 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                } ${currentTab === 'settings' ? 'bg-white/10 text-white' : ''}`}
                title="设置与数据备份"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (thumb-zone ergonomics, minimum 44px hitboxes) */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t pb-safe transition-colors duration-300 ${
          theme.isDark
            ? 'bg-[#070709]/95 border-white/[0.08]'
            : 'bg-white/95 border-slate-200/90 shadow-lg'
        }`}
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
          {[
            { id: 'workout', label: '训练', icon: Dumbbell },
            { id: 'plan', label: '计划', icon: Calendar },
            { id: 'library', label: '动作库', icon: BookOpen },
            { id: 'history', label: '历史', icon: History },
            { id: 'stats', label: '数据', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`flex flex-col items-center justify-center min-h-[48px] transition-colors ${
                  isActive
                    ? 'font-bold'
                    : theme.isDark
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={isActive ? { color: theme.accentColor } : {}}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[11px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
