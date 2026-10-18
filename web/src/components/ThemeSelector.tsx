import React from 'react';
import { Palette, Check, Sparkles, Moon, Sun, X } from 'lucide-react';
import { THEMES, ThemeConfig, ThemeStyle } from '../types/theme';

interface ThemeSelectorProps {
  currentTheme: ThemeStyle;
  onSelectTheme: (theme: ThemeStyle) => void;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-5 sm:p-6 space-y-5 transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3.5 border-b ${
            theme.isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">切换主题视觉风格</h3>
              <p className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                精选 4 款顶级美学配色，随心变换举铁氛围
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              theme.isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {(Object.keys(THEMES) as ThemeStyle[]).map((key) => {
            const t = THEMES[key];
            const isSelected = currentTheme === key;

            return (
              <button
                key={key}
                onClick={() => {
                  onSelectTheme(key);
                  onClose();
                }}
                className={`group p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'shadow-xl ring-2'
                    : theme.isDark
                    ? 'border-white/10 hover:border-white/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
                style={{
                  backgroundColor: t.isDark ? t.bgSurface : '#ffffff',
                  borderColor: isSelected ? t.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 0 2px ${t.accentColor}` : undefined,
                }}
              >
                {/* Visual miniature horizon glow */}
                <div
                  className="absolute -top-12 left-0 right-0 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
                  style={{ backgroundColor: t.accentColor }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold ${
                        t.isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {t.name.split(' ')[0]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm"
                        style={{ backgroundColor: t.accentColor }}
                      />
                      {isSelected && (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-slate-950 font-bold"
                          style={{ backgroundColor: t.accentColor }}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-[11px] leading-relaxed line-clamp-2 ${
                      t.isDark ? 'text-zinc-400' : 'text-slate-500'
                    }`}
                  >
                    {t.description}
                  </p>
                </div>

                {/* Swatch Pill */}
                <div
                  className={`relative z-10 pt-3 mt-3 border-t flex items-center justify-between ${
                    t.isDark ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono ${
                      t.isDark ? 'text-zinc-500' : 'text-slate-400'
                    }`}
                  >
                    {t.enName}
                  </span>
                  <div
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      t.isDark
                        ? 'bg-white/10 text-zinc-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t.isDark ? '深色模式' : '极简明亮'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className={`p-3.5 rounded-2xl border text-[11px] flex items-center gap-2 ${
            theme.isDark
              ? 'bg-white/[0.02] border-white/5 text-zinc-400'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" style={{ color: theme.accentColor }} />
          <span>所选主题将持久化自动保存在浏览器中，刷新后依然生效。</span>
        </div>
      </div>
    </div>
  );
};
