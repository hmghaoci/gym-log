import { THEMES, ThemeConfig, ThemeStyle } from '../types/theme';

const THEME_KEY = 'gymlog.themeStyle';

const LEGACY_THEME: Record<string, ThemeStyle> = {
  ember: 'eclipse',
  forge: 'emerald',
  pulse: 'aurora',
  mist: 'clean',
};

export function getSavedTheme(): ThemeStyle {
  try {
    const saved = localStorage.getItem(THEME_KEY) as ThemeStyle;
    if (saved && THEMES[saved]) return saved;
    const legacy = localStorage.getItem('gymlog.theme') || '';
    if (LEGACY_THEME[legacy]) return LEGACY_THEME[legacy];
  } catch {
    // fallback
  }
  return 'eclipse';
}

export function saveTheme(theme: ThemeStyle) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}
