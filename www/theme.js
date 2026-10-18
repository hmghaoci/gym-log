/** UI 风格。键 gymlog.theme。功能会话不要改配色，只调用 setTheme / renderThemeControls。 */
const THEME_KEY = 'gymlog.theme'
const THEMES = [
  { id: 'ember', name: '余烬', bar: '#0c0c0c' },
  { id: 'mist', name: '薄雾', bar: '#d5e0e8' },
  { id: 'pulse', name: '脉冲', bar: '#05060a' },
  { id: 'forge', name: '锻火', bar: '#070707' },
]

function currentThemeId() {
  const id = localStorage.getItem(THEME_KEY) || 'mist'
  return THEMES.some(item => item.id === id) ? id : 'mist'
}

function applyTheme(id) {
  const theme = THEMES.find(item => item.id === id) || THEMES[0]
  document.documentElement.dataset.theme = theme.id
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme.bar)
}

function setTheme(id) {
  const theme = THEMES.find(item => item.id === id) || THEMES[0]
  localStorage.setItem(THEME_KEY, theme.id)
  applyTheme(theme.id)
  if (typeof render === 'function') render()
}

function renderThemeControls() {
  const cur = currentThemeId()
  const chips = THEMES.map(item => (
    `<button class="chip ${item.id === cur ? 'on' : ''}" data-theme="${item.id}">${item.name}</button>`
  )).join('')
  return `<div class="card" id="theme-slot"><b>界面风格</b><div class="chips" style="margin-top:8px">${chips}</div></div>`
}

applyTheme(currentThemeId())
