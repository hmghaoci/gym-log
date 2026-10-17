const APP_VERSION = '1.1.0'
const UPDATE_URL = 'https://raw.githubusercontent.com/hmghaoci/gym-log/main/release/latest.json'
const STORE_KEY = 'gymlog.v1'
const REST_KEY = 'gymlog.rest'
const LANG_KEY = 'gymlog.lang'

const I18N = {
  zh: {
    appTitle: '健身记录',
    checkUpdate: '检查更新',
    versionLocal: '记录只存在这台手机里。',
    start: '开始训练',
    restTitle: '组间休息',
    seconds: '秒',
    history: '历史',
    noHistory: '还没有训练记录。',
    dataCredit: '动作数据来自 hasaneyldrm/exercises-dataset。',
    pickTitle: '选择动作',
    back: '返回',
    searchPh: '搜索动作名或部位',
    noMatch: '没有匹配的动作。',
    workoutTitle: '训练中',
    addExercise: '加动作',
    kg: '公斤',
    reps: '次数',
    done: '完成',
    finish: '结束并保存',
    emptyWorkout: '先添加一个动作。',
    rest: '休息',
    skip: '跳过',
    notFound: '找不到这次训练。',
    setLine: (i, kg, reps) => `第 ${i} 组 · ${kg || 0} 公斤 × ${reps || 0} 次`,
    histLine: (n, names) => `${n} 个动作 · ${names}`,
    all: '全部',
    offline: '手机离线，训练记录仍在本机',
    latest: v => `已是最新版本 ${v}`,
    foundApk: v => `发现 ${v}。请安装新的 APK`,
    foundNoBundle: v => `发现 ${v}，更新包还没上传`,
    updateFail: '检查更新失败。训练记录仍在本机，可以继续练',
    downloading: '正在下载更新，不用重装',
    noSets: '还没有完成任何一组',
    saved: '这次训练已保存',
    lang: '语言',
    body: {
      chest: '胸', back: '背', shoulders: '肩', 'upper arms': '手臂', 'lower arms': '前臂',
      'upper legs': '大腿', 'lower legs': '小腿', waist: '核心', cardio: '有氧', neck: '颈部',
    },
    eq: {
      'body weight': '自重', dumbbell: '哑铃', barbell: '杠铃', cable: '绳索',
      'leverage machine': '器械', band: '弹力带', kettlebell: '壶铃',
      'stability ball': '稳定球', 'medicine ball': '药球', 'smith machine': '史密斯机',
      'ez barbell': '曲杆', 'olympic barbell': '奥杠', rope: '绳索', sled: '雪橇',
      assisted: '辅助', 'wheel roller': '健腹轮',
    },
    target: {
      abs: '腹肌', lats: '背阔肌', quads: '股四头肌', biceps: '肱二头肌', triceps: '肱三头肌',
      delts: '三角肌', glutes: '臀肌', hamstrings: '腘绳肌', calves: '小腿', traps: '斜方肌',
      pectorals: '胸肌', forearms: '前臂', shoulders: '肩', adductors: '内收肌', abductors: '外展肌',
      spine: '脊柱', 'cardiovascular system': '心肺', 'serratus anterior': '前锯肌',
      'upper back': '上背', 'levator scapulae': '肩胛提肌',
    },
  },
  en: {
    appTitle: 'Gym Log',
    checkUpdate: 'Check update',
    versionLocal: 'Workouts stay on this phone only.',
    start: 'Start workout',
    restTitle: 'Rest between sets',
    seconds: 's',
    history: 'History',
    noHistory: 'No workouts yet.',
    dataCredit: 'Exercises from hasaneyldrm/exercises-dataset.',
    pickTitle: 'Choose exercise',
    back: 'Back',
    searchPh: 'Search name or body part',
    noMatch: 'No matching exercises.',
    workoutTitle: 'Workout',
    addExercise: 'Add',
    kg: 'kg',
    reps: 'reps',
    done: 'Done',
    finish: 'Finish & save',
    emptyWorkout: 'Add an exercise first.',
    rest: 'Rest',
    skip: 'Skip',
    notFound: 'Workout not found.',
    setLine: (i, kg, reps) => `Set ${i} · ${kg || 0} kg × ${reps || 0}`,
    histLine: (n, names) => `${n} exercises · ${names}`,
    all: 'All',
    offline: 'Offline. Your workouts are still saved locally.',
    latest: v => `Already on ${v}`,
    foundApk: v => `Update ${v} available. Install the new APK.`,
    foundNoBundle: v => `Update ${v} found, but the bundle is not uploaded yet.`,
    updateFail: 'Update check failed. You can keep training offline.',
    downloading: 'Downloading update…',
    noSets: 'No completed sets yet',
    saved: 'Workout saved',
    lang: 'Language',
    body: {
      chest: 'Chest', back: 'Back', shoulders: 'Shoulders', 'upper arms': 'Arms', 'lower arms': 'Forearms',
      'upper legs': 'Legs', 'lower legs': 'Calves', waist: 'Core', cardio: 'Cardio', neck: 'Neck',
    },
  },
}

const FILTER_IDS = ['', 'chest', 'back', 'shoulders', 'upper arms', 'upper legs', 'waist']

const state = {
  exercises: [],
  screen: 'home',
  filter: '',
  query: '',
  session: null,
  restLeft: 0,
  restTimer: null,
  toast: '',
  openId: null,
  lang: localStorage.getItem(LANG_KEY) || 'zh',
}

function t(key, ...args) {
  const pack = I18N[state.lang] || I18N.zh
  const val = pack[key]
  return typeof val === 'function' ? val(...args) : val
}

function bodyName(code) {
  return (I18N[state.lang].body[code] || I18N.zh.body[code] || code)
}

function eqName(code) {
  if (state.lang !== 'zh') return code || ''
  return I18N.zh.eq[code] || code || ''
}

function targetName(code) {
  if (state.lang !== 'zh') return code || ''
  return I18N.zh.target[code] || code || ''
}

function exName(ex) {
  if (!ex) return ''
  if (state.lang === 'zh') return ex.zh || ex.n || ex.name || ''
  return ex.n || ex.name || ex.zh || ''
}

function setLang(lang) {
  state.lang = lang === 'en' ? 'en' : 'zh'
  localStorage.setItem(LANG_KEY, state.lang)
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en'
  render()
}

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { workouts: [] } }
  catch { return { workouts: [] } }
}
function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data))
}
function restSec() {
  return Number(localStorage.getItem(REST_KEY) || 90)
}
function setRestSec(n) {
  localStorage.setItem(REST_KEY, String(n))
}

function toast(msg) {
  state.toast = msg
  render()
  setTimeout(() => {
    if (state.toast === msg) {
      state.toast = ''
      render()
    }
  }, 3200)
}

function cmpVer(a, b) {
  const pa = String(a).split('.').map(Number)
  const pb = String(b).split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0)
    if (d) return d
  }
  return 0
}

async function checkUpdate() {
  if (navigator.onLine === false) {
    toast(t('offline'))
    return
  }
  try {
    const res = await fetch(`${UPDATE_URL}?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('http')
    const data = await res.json()
    if (!data.version || cmpVer(data.version, APP_VERSION) <= 0) {
      toast(t('latest', APP_VERSION))
      return
    }
    const updater = window.Capacitor?.Plugins?.CapacitorUpdater
    if (!window.Capacitor?.isNativePlatform?.() || !updater) {
      toast(t('foundApk', data.version))
      return
    }
    if (!data.url || !data.checksum) {
      toast(t('foundNoBundle', data.version))
      return
    }
    await applyBundle(updater, data)
  } catch {
    toast(t('updateFail'))
  }
}

async function applyBundle(CapacitorUpdater, data) {
  toast(t('downloading'))
  const bundle = await CapacitorUpdater.download({
    url: data.url,
    version: data.version,
    checksum: data.checksum,
  })
  await CapacitorUpdater.set({ id: bundle.id })
}

function startSession() {
  state.session = { id: Date.now().toString(36), started: Date.now(), exercises: [] }
  state.screen = 'workout'
  render()
}

function addExercise(ex) {
  if (!state.session.exercises.some(item => item.id === ex.id)) {
    state.session.exercises.push({
      id: ex.id,
      name: ex.n,
      zh: ex.zh || '',
      sets: [{ kg: '', reps: '', done: false }],
    })
  }
  state.screen = 'workout'
  render()
}

function completeSet(exIndex, setIndex) {
  const set = state.session.exercises[exIndex].sets[setIndex]
  set.done = true
  const list = state.session.exercises[exIndex].sets
  if (setIndex === list.length - 1) list.push({ kg: set.kg, reps: set.reps, done: false })
  startRest()
  render()
}

function startRest() {
  clearInterval(state.restTimer)
  state.restLeft = restSec()
  state.restTimer = setInterval(() => {
    state.restLeft -= 1
    if (state.restLeft <= 0) {
      clearInterval(state.restTimer)
      state.restTimer = null
      state.restLeft = 0
      if (navigator.vibrate) navigator.vibrate(200)
    }
    render()
  }, 1000)
}

function finishSession() {
  const store = loadStore()
  const exercises = state.session.exercises
    .map(ex => ({ ...ex, sets: ex.sets.filter(s => s.done) }))
    .filter(ex => ex.sets.length)
  if (!exercises.length) {
    toast(t('noSets'))
    return
  }
  store.workouts.unshift({
    id: state.session.id,
    started: state.session.started,
    ended: Date.now(),
    exercises,
  })
  saveStore(store)
  clearInterval(state.restTimer)
  state.session = null
  state.restLeft = 0
  state.screen = 'home'
  toast(t('saved'))
  render()
}

function fmt(ts) {
  const d = new Date(ts)
  const p = n => String(n).padStart(2, '0')
  if (state.lang === 'en') return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`
  return `${d.getMonth() + 1}月${d.getDate()}日 ${p(d.getHours())}:${p(d.getMinutes())}`
}

function render() {
  const root = document.getElementById('app')
  const store = loadStore()
  let html = ''
  if (state.screen === 'home') html = homeView(store)
  else if (state.screen === 'pick') html = pickView()
  else if (state.screen === 'workout') html = workoutView()
  else if (state.screen === 'detail') html = detailView(store)
  root.innerHTML = html
  bind()
  if (state.toast && state.restLeft <= 0) {
    const el = document.createElement('div')
    el.className = 'toast'
    el.textContent = state.toast
    root.appendChild(el)
  }
}

function homeView(store) {
  const sep = state.lang === 'zh' ? '、' : ', '
  const items = store.workouts.map(w => {
    const names = w.exercises.map(e => exName(e)).slice(0, 3).join(sep)
    return `<button class="list-btn" data-open="${w.id}"><b>${fmt(w.started)}</b><div class="muted">${t('histLine', w.exercises.length, names)}</div></button>`
  }).join('')
  return `
    <div class="row"><h1>${t('appTitle')}</h1><button class="ghost" id="check">${t('checkUpdate')}</button></div>
    <p class="muted">v${APP_VERSION}. ${t('versionLocal')}</p>
    <div class="card">
      <b>${t('lang')}</b>
      <div class="chips" style="margin-top:8px">
        <button class="chip ${state.lang === 'zh' ? 'on' : ''}" data-lang="zh">中文</button>
        <button class="chip ${state.lang === 'en' ? 'on' : ''}" data-lang="en">English</button>
      </div>
    </div>
    <button class="primary" id="start">${t('start')}</button>
    <div class="card">
      <b>${t('restTitle')}</b>
      <div class="chips" style="margin-top:8px">
        ${[60, 90, 120, 180].map(n => `<button class="chip ${restSec() === n ? 'on' : ''}" data-rest="${n}">${n} ${t('seconds')}</button>`).join('')}
      </div>
    </div>
    <h2 style="font-size:16px">${t('history')}</h2>
    ${items || `<p class="muted">${t('noHistory')}</p>`}
    <p class="muted">${t('dataCredit')}</p>
  `
}

function pickView() {
  const q = state.query.trim().toLowerCase()
  const list = state.exercises.filter(ex => {
    if (state.filter && ex.b !== state.filter && !(state.filter === 'upper arms' && ex.b === 'lower arms') && !(state.filter === 'upper legs' && ex.b === 'lower legs')) return false
    if (!q) return true
    const zh = (ex.zh || '').toLowerCase()
    return ex.n.toLowerCase().includes(q) || zh.includes(q) || bodyName(ex.b).toLowerCase().includes(q) || (ex.t || '').toLowerCase().includes(q)
  }).slice(0, 40)
  const filters = FILTER_IDS.map(id => {
    const label = id ? bodyName(id === 'upper arms' ? 'upper arms' : id === 'upper legs' ? 'upper legs' : id) : t('all')
    const short = id === 'upper arms' ? (state.lang === 'zh' ? '手臂' : 'Arms') : id === 'upper legs' ? (state.lang === 'zh' ? '腿' : 'Legs') : label
    return `<button class="chip ${state.filter === id ? 'on' : ''}" data-filter="${id}">${id ? short : t('all')}</button>`
  }).join('')
  return `
    <div class="row"><h1>${t('pickTitle')}</h1><button class="ghost" id="back">${t('back')}</button></div>
    <input id="q" type="search" placeholder="${t('searchPh')}" value="${escapeHtml(state.query)}" />
    <div class="chips" style="margin-top:8px">${filters}</div>
    ${list.map(ex => `<button class="list-btn" data-add="${ex.id}"><b>${escapeHtml(exName(ex))}</b><div class="muted">${bodyName(ex.b)} · ${escapeHtml(eqName(ex.eq))} · ${escapeHtml(targetName(ex.t))}</div></button>`).join('') || `<p class="muted">${t('noMatch')}</p>`}
  `
}

function workoutView() {
  const blocks = state.session.exercises.map((ex, i) => `
    <div class="card">
      <b>${escapeHtml(exName(ex))}</b>
      ${ex.sets.map((set, j) => `
        <div class="set ${set.done ? 'done' : ''}">
          <span>${j + 1}</span>
          <input data-kg="${i}:${j}" type="number" inputmode="decimal" placeholder="${t('kg')}" value="${set.kg}" ${set.done ? 'disabled' : ''} />
          <input data-reps="${i}:${j}" type="number" inputmode="numeric" placeholder="${t('reps')}" value="${set.reps}" ${set.done ? 'disabled' : ''} />
          ${set.done ? `<span>${t('done')}</span>` : `<button class="ghost" data-done="${i}:${j}">${t('done')}</button>`}
        </div>
      `).join('')}
    </div>
  `).join('')
  return `
    <div class="row"><h1>${t('workoutTitle')}</h1><button class="ghost" id="pick">${t('addExercise')}</button></div>
    ${blocks || `<p class="muted">${t('emptyWorkout')}</p>`}
    <button class="primary" id="finish">${t('finish')}</button>
    ${state.restLeft > 0 ? `<div class="timer"><div><div class="muted" style="color:#d1d5db">${t('rest')}</div><b style="font-size:28px">${state.restLeft}s</b></div><button class="ghost" id="skip">${t('skip')}</button></div>` : ''}
  `
}

function detailView(store) {
  const w = store.workouts.find(item => item.id === state.openId)
  if (!w) return `<button class="ghost" id="back">${t('back')}</button><p>${t('notFound')}</p>`
  const blocks = w.exercises.map(ex => `
    <div class="card"><b>${escapeHtml(exName(ex))}</b>
      ${ex.sets.map((s, i) => `<div class="muted">${t('setLine', i + 1, s.kg, s.reps)}</div>`).join('')}
    </div>
  `).join('')
  return `<div class="row"><h1>${fmt(w.started)}</h1><button class="ghost" id="back">${t('back')}</button></div>${blocks}`
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))
}

function bind() {
  const on = (id, fn) => {
    const el = document.getElementById(id)
    if (el) el.onclick = fn
  }
  on('start', startSession)
  on('check', checkUpdate)
  on('pick', () => { state.screen = 'pick'; render() })
  on('back', () => { state.screen = state.session ? 'workout' : 'home'; render() })
  on('finish', finishSession)
  on('skip', () => { clearInterval(state.restTimer); state.restLeft = 0; render() })
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.onclick = () => setLang(btn.dataset.lang)
  })
  document.querySelectorAll('[data-rest]').forEach(btn => {
    btn.onclick = () => { setRestSec(btn.dataset.rest); render() }
  })
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.onclick = () => { state.openId = btn.dataset.open; state.screen = 'detail'; render() }
  })
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.onclick = () => { state.filter = btn.dataset.filter; render() }
  })
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.onclick = () => addExercise(state.exercises.find(ex => ex.id === btn.dataset.add))
  })
  document.querySelectorAll('[data-done]').forEach(btn => {
    btn.onclick = () => {
      const [i, j] = btn.dataset.done.split(':').map(Number)
      completeSet(i, j)
    }
  })
  document.querySelectorAll('[data-kg],[data-reps]').forEach(input => {
    input.oninput = () => {
      const key = input.dataset.kg ? 'kg' : 'reps'
      const [i, j] = (input.dataset.kg || input.dataset.reps).split(':').map(Number)
      state.session.exercises[i].sets[j][key] = input.value
    }
  })
  const q = document.getElementById('q')
  if (q) {
    q.oninput = () => {
      state.query = q.value
      const pos = q.selectionStart
      render()
      const again = document.getElementById('q')
      if (again) {
        again.focus()
        again.setSelectionRange(pos, pos)
      }
    }
  }
}

async function boot() {
  const res = await fetch('data/exercises.json')
  state.exercises = await res.json()
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en'
  render()
  if (window.Capacitor?.isNativePlatform?.()) {
    window.Capacitor.Plugins.CapacitorUpdater?.notifyAppReady?.().catch(() => {})
  }
}

boot()
