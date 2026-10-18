const APP_VERSION = '1.5.0'
const UPDATE_URLS = [
  'https://github.com/hmghaoci/gym-log/releases/latest/download/latest.json',
  'https://raw.githubusercontent.com/hmghaoci/gym-log/main/release/latest.json',
]
const STORE_KEY = 'gymlog.v1'
const REST_KEY = 'gymlog.rest'
const LANG_KEY = 'gymlog.lang'
const REST_SOUND_KEY = 'gymlog.restSound'
/** UI 会话占用 gymlog.theme，功能侧勿用 */

function fmtVol(n) {
  const v = Math.round(Number(n) || 0)
  try {
    return v.toLocaleString(typeof state !== 'undefined' && state.lang === 'en' ? 'en-US' : 'zh-CN')
  } catch {
    return String(v)
  }
}

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
    templates: '模板',
    newTemplate: '新建模板',
    saveTemplate: '存为模板',
    templatePh: '模板名称，例如推日',
    templateEmpty: '先加至少一个动作。',
    templateNeed: '写上名称，并至少留下一个动作。',
    templateSaved: '模板已保存',
    removeExercise: '拿掉',
    removeSet: '删',
    deleteWorkout: '删除这次训练',
    deleteConfirm: '再点一次删除',
    noTemplates: '还没有模板。',
    lastPrefix: '上次',
    showAnim: '动画',
    hideAnim: '收起',
    mediaCredit: '动作动画 © Gym visual',
    addToTemplate: '加动作',
    removeTplEx: '拿掉',
    backup: '备份',
    exportData: '导出记录',
    importData: '导入记录',
    exportOk: '已导出备份文件',
    importOk: '导入成功',
    importBad: '文件不是有效的备份',
    importConfirm: '导入会覆盖本机记录，再点一次确认',
    restSound: '休息提示音',
    restDone: '休息结束，开始下一组',
    on: '开',
    off: '关',
    progress: '进步',
    progressTitle: '动作进步',
    progressPick: '选一个练过的动作',
    progressEmpty: '还没有可统计的动作。',
    progressBest: (kg, reps) => `最好 ${kg || 0} 公斤 × ${reps || 0} 次`,
    progressSession: (n) => `近 ${n} 次训练`,
    settings: '设置',
    weekVolume: '本周训练',
    volumeUnit: '公斤 · 容量',
    weekSessions: n => `本周练了 ${n} 次`,
    histVol: (vol, n, names) => `${fmtVol(vol)} 公斤 · ${n} 个动作 · ${names}`,
    workoutVol: vol => `本次容量 ${fmtVol(vol)} 公斤`,
    tabHome: '首页',
    tabPlan: '计划',
    tabHistory: '历史',
    tabStats: '数据',
    tabSettings: '设置',
    todayTitle: '今天',
    todayRest: '今天休息。也可以开一场空训练。',
    startToday: '开始今天的训练',
    startEmpty: '开一场空训练',
    planTitle: '周计划',
    planHint: '给每一天安排一个模板，首页会按今天自动打开。',
    restDay: '休息',
    assignTpl: '安排模板',
    statsTitle: '数据',
    heatTitle: '近八周训练',
    heatEmpty: '练过的日子会亮起来。',
    days: ['日', '一', '二', '三', '四', '五', '六'],
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
    templates: 'Routines',
    newTemplate: 'New routine',
    saveTemplate: 'Save routine',
    templatePh: 'Routine name, e.g. Push',
    templateEmpty: 'Add at least one exercise.',
    templateNeed: 'Add a name and at least one exercise.',
    templateSaved: 'Routine saved',
    removeExercise: 'Remove',
    removeSet: 'Del',
    deleteWorkout: 'Delete workout',
    deleteConfirm: 'Tap again to delete',
    noTemplates: 'No routines yet.',
    lastPrefix: 'Last',
    showAnim: 'GIF',
    hideAnim: 'Hide',
    mediaCredit: 'Exercise media © Gym visual',
    addToTemplate: 'Add exercise',
    removeTplEx: 'Remove',
    backup: 'Backup',
    exportData: 'Export',
    importData: 'Import',
    exportOk: 'Backup file saved',
    importOk: 'Import done',
    importBad: 'Not a valid backup file',
    importConfirm: 'Import replaces local data. Tap again to confirm',
    restSound: 'Rest alert',
    restDone: 'Rest over — next set',
    on: 'On',
    off: 'Off',
    progress: 'Progress',
    progressTitle: 'Progress',
    progressPick: 'Pick an exercise you trained',
    progressEmpty: 'No tracked exercises yet.',
    progressBest: (kg, reps) => `Best ${kg || 0} kg × ${reps || 0}`,
    progressSession: (n) => `Last ${n} sessions`,
    settings: 'Settings',
    weekVolume: 'This week',
    volumeUnit: 'kg · volume',
    weekSessions: n => `${n} workouts this week`,
    histVol: (vol, n, names) => `${fmtVol(vol)} kg · ${n} exercises · ${names}`,
    workoutVol: vol => `Volume ${fmtVol(vol)} kg`,
    tabHome: 'Home',
    tabPlan: 'Plan',
    tabHistory: 'History',
    tabStats: 'Stats',
    tabSettings: 'Settings',
    todayTitle: 'Today',
    todayRest: 'Rest day. You can still start an empty workout.',
    startToday: 'Start today’s workout',
    startEmpty: 'Start empty workout',
    planTitle: 'Weekly plan',
    planHint: 'Assign a routine to each weekday. Home opens today’s plan.',
    restDay: 'Rest',
    assignTpl: 'Assign routine',
    statsTitle: 'Stats',
    heatTitle: 'Last 8 weeks',
    heatEmpty: 'Days you trained light up.',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
  confirmId: null,
  draft: null,
  pickFor: 'session',
  openGif: null,
  progressId: null,
  importArmed: false,
  audioCtx: null,
}

const MEDIA_BASE = 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/'

function mediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return MEDIA_BASE + String(path).replace(/^\//, '')
}

function findExercise(id) {
  return state.exercises.find(ex => ex.id === id)
}

function gifBlock(id) {
  const ex = findExercise(id)
  if (!ex?.g) return ''
  if (state.openGif !== id) {
    return `<button class="ghost tiny" data-gif="${id}">${t('showAnim')}</button>`
  }
  return `
    <div class="gif-box">
      <img src="${escapeHtml(mediaUrl(ex.g))}" alt="" loading="lazy" />
      <button class="ghost tiny" data-gif="${id}">${t('hideAnim')}</button>
      <div class="muted" style="margin-top:4px">${t('mediaCredit')}</div>
    </div>
  `
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
  try {
    const data = JSON.parse(localStorage.getItem(STORE_KEY)) || {}
    if (!Array.isArray(data.workouts)) data.workouts = []
    if (!Array.isArray(data.templates)) data.templates = []
    if (!Array.isArray(data.schedule) || data.schedule.length !== 7) {
      data.schedule = ['', '', '', '', '', '', '']
    }
    return data
  } catch {
    return { workouts: [], templates: [], schedule: ['', '', '', '', '', '', ''] }
  }
}

function setScheduleDay(day, tplId) {
  const store = loadStore()
  store.schedule[Number(day)] = tplId || ''
  saveStore(store)
}

function templateById(store, id) {
  if (!id) return null
  return store.templates.find(item => item.id === id) || null
}

function todayTemplate(store) {
  return templateById(store, store.schedule[new Date().getDay()])
}

/** 显示顺序：周一到周日（中文习惯），值仍是 Date.getDay() */
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

const TAB_SCREENS = new Set(['home', 'plan', 'history', 'stats', 'settings'])
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

async function loadLatest() {
  let lastError = 'http'
  for (const url of UPDATE_URLS) {
    try {
      const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      return await res.json()
    } catch (err) {
      lastError = err && err.message ? err.message : 'http'
    }
  }
  throw new Error(lastError)
}

async function checkUpdate() {
  if (navigator.onLine === false) {
    toast(t('offline'))
    return
  }
  try {
    const data = await loadLatest()
    if (!data.version || cmpVer(data.version, APP_VERSION) <= 0) {
      toast(t('latest', APP_VERSION))
      return
    }
    const updater = window.Capacitor?.Plugins?.CapacitorUpdater
    if (!window.Capacitor?.isNativePlatform?.() || !updater) {
      if (data.apk) window.location.href = data.apk
      toast(t('foundApk', data.version))
      return
    }
    if (!data.url || !data.checksum) {
      if (data.apk) window.location.href = data.apk
      toast(t('foundNoBundle', data.version))
      return
    }
    await applyBundle(updater, data)
  } catch (err) {
    toast(`${t('updateFail')} (${err && err.message ? err.message : 'error'})`)
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

function lastSets(id) {
  const store = loadStore()
  for (const workout of store.workouts) {
    const found = workout.exercises.find(item => item.id === id)
    if (found && found.sets && found.sets.length) return found.sets
  }
  return []
}

function lastLine(id) {
  const sets = lastSets(id)
  if (!sets.length) return ''
  const sep = state.lang === 'zh' ? '、' : ', '
  const parts = sets.map(set => (
    state.lang === 'zh'
      ? `${set.kg || 0} 公斤 × ${set.reps || 0} 次`
      : `${set.kg || 0} kg × ${set.reps || 0}`
  ))
  return `${t('lastPrefix')} ${parts.join(sep)}`
}

function freshExercise(ex) {
  const prev = lastSets(ex.id)
  const first = prev[0] || {}
  return {
    id: ex.id,
    name: ex.n || ex.name,
    zh: ex.zh || '',
    sets: [{ kg: first.kg ?? '', reps: first.reps ?? '', done: false }],
  }
}

function startSession() {
  state.session = { id: Date.now().toString(36), started: Date.now(), exercises: [] }
  state.pickFor = 'session'
  state.screen = 'workout'
  render()
}

function startFromTemplate(tpl) {
  state.session = {
    id: Date.now().toString(36),
    started: Date.now(),
    exercises: tpl.exercises.map(freshExercise),
  }
  state.pickFor = 'session'
  state.screen = 'workout'
  render()
}

function addExercise(ex) {
  if (!ex) return
  if (state.pickFor === 'template' && state.draft) {
    if (!state.draft.exercises.some(item => item.id === ex.id)) {
      state.draft.exercises.push({ id: ex.id, name: ex.n || ex.name, zh: ex.zh || '' })
    }
    state.screen = 'template'
    render()
    return
  }
  if (!state.session.exercises.some(item => item.id === ex.id)) {
    state.session.exercises.push(freshExercise(ex))
  }
  state.screen = 'workout'
  render()
}

function removeExercise(index) {
  state.session.exercises.splice(index, 1)
  render()
}

function removeSet(exIndex, setIndex) {
  const sets = state.session.exercises[exIndex].sets
  sets.splice(setIndex, 1)
  if (!sets.length) sets.push({ kg: '', reps: '', done: false })
  render()
}

function openNewTemplate() {
  state.draft = { name: '', exercises: [] }
  state.pickFor = 'template'
  state.screen = 'template'
  render()
}

function openSaveTemplate() {
  if (!state.session || !state.session.exercises.length) {
    toast(t('templateEmpty'))
    return
  }
  state.draft = {
    name: '',
    exercises: state.session.exercises.map(ex => ({ id: ex.id, name: ex.name, zh: ex.zh || '' })),
  }
  state.pickFor = 'template'
  state.screen = 'template'
  render()
}

function saveDraft() {
  const name = (state.draft.name || '').trim()
  if (!name || !state.draft.exercises.length) {
    toast(t('templateNeed'))
    return
  }
  const store = loadStore()
  const payload = {
    id: state.draft.replaceId || Date.now().toString(36),
    name,
    exercises: state.draft.exercises.map(ex => ({ id: ex.id, name: ex.name, zh: ex.zh || '' })),
  }
  if (state.draft.replaceId) {
    const idx = store.templates.findIndex(item => item.id === state.draft.replaceId)
    if (idx >= 0) store.templates[idx] = payload
    else store.templates.unshift(payload)
  } else {
    store.templates.unshift(payload)
  }
  saveStore(store)
  state.draft = null
  state.pickFor = 'session'
  state.screen = state.session ? 'workout' : 'plan'
  toast(t('templateSaved'))
  render()
}

function deleteTemplate(id) {
  const key = `tpl:${id}`
  if (state.confirmId !== key) {
    state.confirmId = key
    render()
    return
  }
  const store = loadStore()
  store.templates = store.templates.filter(item => item.id !== id)
  store.schedule = store.schedule.map(day => (day === id ? '' : day))
  saveStore(store)
  state.confirmId = null
  render()
}

function deleteWorkout(id) {
  const key = `wo:${id}`
  if (state.confirmId !== key) {
    state.confirmId = key
    render()
    return
  }
  const store = loadStore()
  store.workouts = store.workouts.filter(item => item.id !== id)
  saveStore(store)
  state.confirmId = null
  state.openId = null
  state.screen = 'history'
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

function restSoundOn() {
  return localStorage.getItem(REST_SOUND_KEY) !== '0'
}

function setRestSound(on) {
  localStorage.setItem(REST_SOUND_KEY, on ? '1' : '0')
}

function playRestBeep() {
  if (!restSoundOn()) return
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    if (!state.audioCtx) state.audioCtx = new Ctx()
    const ctx = state.audioCtx
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    ;[0, 0.18, 0.36].forEach(delay => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, now + delay)
      gain.gain.exponentialRampToValueAtTime(0.2, now + delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.14)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + delay)
      osc.stop(now + delay + 0.16)
    })
  } catch { /* ignore */ }
}

function notifyRestDone() {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400])
  playRestBeep()
  toast(t('restDone'))
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
      notifyRestDone()
    }
    render()
  }, 1000)
}

function exportBackup() {
  const payload = {
    app: 'gym-log',
    version: APP_VERSION,
    exportedAt: Date.now(),
    store: loadStore(),
    rest: restSec(),
    lang: state.lang,
    restSound: restSoundOn() ? '1' : '0',
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = URL.createObjectURL(blob)
  a.download = `gym-log-backup-${stamp}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  toast(t('exportOk'))
}

function importBackupFile(file) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || ''))
      const store = data.store || data
      if (!store || !Array.isArray(store.workouts)) throw new Error('bad')
      if (!Array.isArray(store.templates)) store.templates = []
      if (!Array.isArray(store.schedule) || store.schedule.length !== 7) {
        store.schedule = ['', '', '', '', '', '', '']
      }
      saveStore({ workouts: store.workouts, templates: store.templates, schedule: store.schedule })
      if (data.rest != null) setRestSec(data.rest)
      if (data.lang === 'en' || data.lang === 'zh') {
        state.lang = data.lang
        localStorage.setItem(LANG_KEY, state.lang)
        document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en'
      }
      if (data.restSound === '0' || data.restSound === '1') setRestSound(data.restSound === '1')
      state.importArmed = false
      toast(t('importOk'))
      render()
    } catch {
      toast(t('importBad'))
    }
  }
  reader.readAsText(file)
}

function bestSet(sets) {
  let best = null
  for (const set of sets || []) {
    const kg = Number(set.kg) || 0
    const reps = Number(set.reps) || 0
    if (!best || kg > best.kg || (kg === best.kg && reps > best.reps)) best = { kg, reps }
  }
  return best
}

function progressSeries(exerciseId) {
  const store = loadStore()
  const points = []
  for (const w of store.workouts) {
    const found = (w.exercises || []).find(ex => ex.id === exerciseId)
    if (!found) continue
    const best = bestSet(found.sets)
    if (!best) continue
    points.push({ started: w.started, ...best })
  }
  return points.slice(0, 12).reverse()
}

function trainedExercises() {
  const store = loadStore()
  const map = new Map()
  for (const w of store.workouts) {
    for (const ex of w.exercises || []) {
      if (!map.has(ex.id)) map.set(ex.id, { id: ex.id, name: ex.name, zh: ex.zh || '' })
    }
  }
  return [...map.values()].sort((a, b) => exName(a).localeCompare(exName(b), state.lang === 'zh' ? 'zh' : 'en'))
}

/** UI 会话可定义 renderThemeControls()；此处勿实现配色 */
function themeBlockHtml() {
  if (typeof renderThemeControls === 'function') return renderThemeControls()
  return '<div id="theme-slot"></div>'
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

function weekStartMs(ts = Date.now()) {
  const d = new Date(ts)
  const day = d.getDay()
  const back = day === 0 ? 6 : day - 1
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - back)
  return d.getTime()
}

function setVolume(set) {
  return (Number(set.kg) || 0) * (Number(set.reps) || 0)
}

function workoutVolume(w) {
  let total = 0
  for (const ex of w.exercises || []) {
    for (const set of ex.sets || []) total += setVolume(set)
  }
  return total
}

function weekStats(store) {
  const start = weekStartMs()
  let volume = 0
  let sessions = 0
  for (const w of store.workouts || []) {
    if ((w.started || 0) < start) continue
    sessions += 1
    volume += workoutVolume(w)
  }
  return { volume, sessions }
}

function tabBar() {
  if (!TAB_SCREENS.has(state.screen)) return ''
  const tabs = [
    ['home', 'tabHome'],
    ['plan', 'tabPlan'],
    ['history', 'tabHistory'],
    ['stats', 'tabStats'],
    ['settings', 'tabSettings'],
  ]
  return `<nav class="tabbar">${tabs.map(([id, key]) => (
    `<button class="tab ${state.screen === id ? 'on' : ''}" data-tab="${id}">${t(key)}</button>`
  )).join('')}</nav>`
}

function render() {
  const root = document.getElementById('app')
  const store = loadStore()
  let html = ''
  if (state.screen === 'home') html = homeView(store)
  else if (state.screen === 'plan') html = planView(store)
  else if (state.screen === 'history') html = historyView(store)
  else if (state.screen === 'stats') html = statsView(store)
  else if (state.screen === 'settings') html = settingsView()
  else if (state.screen === 'pick') html = pickView()
  else if (state.screen === 'workout') html = workoutView()
  else if (state.screen === 'detail') html = detailView(store)
  else if (state.screen === 'template') html = templateView()
  else if (state.screen === 'progress') html = progressView()
  root.innerHTML = html + tabBar()
  document.body.classList.toggle('has-tabs', TAB_SCREENS.has(state.screen))
  bind()
  if (state.toast && state.restLeft <= 0) {
    const el = document.createElement('div')
    el.className = 'toast'
    el.textContent = state.toast
    root.appendChild(el)
  }
}

function historyListHtml(store) {
  const sep = state.lang === 'zh' ? '、' : ', '
  const items = store.workouts.map(w => {
    const names = w.exercises.map(e => exName(e)).slice(0, 3).join(sep)
    const vol = workoutVolume(w)
    return `<button class="list-btn" data-open="${w.id}"><b>${fmt(w.started)}</b><div class="muted">${t('histVol', vol, w.exercises.length, names)}</div></button>`
  }).join('')
  return items || `<p class="muted">${t('noHistory')}</p>`
}

const THEME_LAYOUT_IMGS = {
  ember: ['theme-assets/ember-bench.jpg', 'theme-assets/ember-dumbbell.jpg', 'theme-assets/ember-cable.jpg', 'theme-assets/ember-gym.jpg'],
  mist: ['theme-assets/mist-train.jpg', 'theme-assets/mist-barbell.jpg', 'theme-assets/mist-dumbbell.jpg', 'theme-assets/mist-row.jpg'],
  pulse: ['theme-assets/pulse-bar.jpg', 'theme-assets/pulse-rack.jpg', 'theme-assets/pulse-horizon.jpg'],
  forge: ['theme-assets/forge-bar.jpg', 'theme-assets/forge-dumbbell.jpg', 'theme-assets/forge-kettle.jpg', 'theme-assets/forge-rack.jpg'],
}

function layoutTheme() {
  const id = typeof currentThemeId === 'function' ? currentThemeId() : 'ember'
  return THEME_LAYOUT_IMGS[id] ? id : 'ember'
}

function themeImg(index) {
  const list = THEME_LAYOUT_IMGS[layoutTheme()]
  return list[index % list.length]
}

function todayActionsHtml(store) {
  const today = todayTemplate(store)
  const sep = state.lang === 'zh' ? '、' : ', '
  const dayLabel = t('days')[new Date().getDay()]
  if (today) {
    return `
      <div class="kicker">${t('todayTitle')} · ${dayLabel}</div>
      <b class="today-name">${escapeHtml(today.name)}</b>
      <div class="muted" style="margin:6px 0 12px">${today.exercises.map(ex => exName(ex)).slice(0, 4).join(sep)}</div>
      <button class="primary" id="startToday">${t('startToday')}</button>
      <button class="ghost" id="start" style="width:100%;margin-top:8px">${t('startEmpty')}</button>
    `
  }
  return `
    <div class="kicker">${t('todayTitle')} · ${dayLabel}</div>
    <p class="muted" style="margin:8px 0 12px">${t('todayRest')}</p>
    <button class="primary" id="start">${t('startEmpty')}</button>
  `
}

function homeView(store) {
  const week = weekStats(store)
  const theme = layoutTheme()
  const head = `<div class="row"><h1>${t('appTitle')}</h1></div>`
  const todayCard = `<div class="card today-card">${todayActionsHtml(store)}</div>`

  if (theme === 'mist') {
    return `
      <div class="layout layout-mist">
        ${head}
        <p class="kicker">${t('weekVolume')}</p>
        <h2 class="layout-title">${fmtVol(week.volume)} <span>${t('volumeUnit')}</span></h2>
        <div class="card shot-who">
          <img src="${themeImg(0)}" alt="" />
          <div><b>${t('weekSessions', week.sessions)}</b><div class="muted">${t('weekVolume')}</div></div>
        </div>
        ${todayCard}
      </div>
    `
  }

  if (theme === 'pulse') {
    const goal = 4
    const ratio = Math.min(1, week.sessions / goal)
    const dash = Math.round(ratio * 176)
    return `
      <div class="layout layout-pulse">
        ${head}
        <p class="kicker">${t('weekVolume')}</p>
        <h2 class="layout-title">${fmtVol(week.volume)}<span> ${t('volumeUnit')}</span></h2>
        <div class="pulse-grid">
          <img class="pulse-shot" src="${themeImg(0)}" alt="" />
          <div class="card">
            <svg width="56" height="56" viewBox="0 0 72 72" aria-hidden="true">
              <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="8"/>
              <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-dasharray="${dash} 176" transform="rotate(-90 36 36)"/>
            </svg>
            <b class="pulse-kg" style="font-size:18px;margin-top:6px">${t('weekSessions', week.sessions)}</b>
          </div>
        </div>
        ${todayCard}
      </div>
    `
  }

  if (theme === 'forge') {
    return `
      <div class="layout layout-forge">
        ${head}
        <div class="forge-plate">
          <img src="${themeImg(0)}" alt="" />
          <div class="forge-pad">
            <div class="kicker">${t('weekVolume')}</div>
            <div class="hero-num">${fmtVol(week.volume)}</div>
            <div class="muted">${t('volumeUnit')} · ${t('weekSessions', week.sessions)}</div>
          </div>
        </div>
        ${todayCard}
      </div>
    `
  }

  return `
    <div class="layout layout-ember">
      ${head}
      <div class="hero-photo">
        <img src="${themeImg(0)}" alt="" />
        <div class="cap">
          <div class="kicker">${t('weekVolume')}</div>
          <div class="hero-num">${fmtVol(week.volume)}</div>
          <div class="muted">${t('volumeUnit')} · ${t('weekSessions', week.sessions)}</div>
        </div>
      </div>
      ${todayCard}
    </div>
  `
}

function planView(store) {
  const sep = state.lang === 'zh' ? '、' : ', '
  const dayRows = DAY_ORDER.map(day => {
    const selected = store.schedule[day] || ''
    const opts = [`<option value="">${t('restDay')}</option>`]
      .concat(store.templates.map(tpl => (
        `<option value="${tpl.id}" ${tpl.id === selected ? 'selected' : ''}>${escapeHtml(tpl.name)}</option>`
      )))
    return `
      <div class="card plan-day">
        <div class="row"><b>${t('days')[day]}</b></div>
        <select class="select" data-day="${day}">${opts.join('')}</select>
      </div>
    `
  }).join('')
  const tplRows = store.templates.map(tpl => `
    <div class="row" style="margin-top:8px">
      <button class="list-btn" data-edit-tpl="${tpl.id}" style="margin:0;flex:1">
        <b>${escapeHtml(tpl.name)}</b>
        <div class="muted">${tpl.exercises.map(ex => exName(ex)).slice(0, 3).join(sep)}</div>
      </button>
      <button class="danger tiny" data-del-tpl="${tpl.id}">${state.confirmId === `tpl:${tpl.id}` ? t('deleteConfirm') : t('removeSet')}</button>
    </div>
  `).join('')
  return `
    <div class="row"><h1>${t('planTitle')}</h1><button class="ghost tiny" id="newTpl">${t('newTemplate')}</button></div>
    <p class="muted">${t('planHint')}</p>
    ${dayRows}
    <div class="section-head"><h2>${t('templates')}</h2></div>
    ${tplRows || `<p class="muted">${t('noTemplates')}</p>`}
  `
}

function historyView(store) {
  return `
    <div class="row"><h1>${t('history')}</h1></div>
    ${historyListHtml(store)}
  `
}

function heatMapHtml(store) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  const backToMonday = today.getDay() === 0 ? 6 : today.getDay() - 1
  start.setDate(today.getDate() - backToMonday - 49)
  const counts = new Map()
  for (const w of store.workouts || []) {
    const d = new Date(w.started)
    d.setHours(0, 0, 0, 0)
    counts.set(d.getTime(), (counts.get(d.getTime()) || 0) + 1)
  }
  const cells = []
  for (let i = 0; i < 56; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const future = d.getTime() > today.getTime()
    const n = future ? 0 : (counts.get(d.getTime()) || 0)
    const level = future ? 'f' : n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3
    cells.push(`<i class="heat l${level}" title="${d.toLocaleDateString()}"></i>`)
  }
  return `<div class="heat-grid">${cells.join('')}</div>`
}

function statsView(store) {
  const list = trainedExercises()
  const heat = heatMapHtml(store)
  if (!list.length) {
    return `
      <div class="row"><h1>${t('statsTitle')}</h1></div>
      <div class="card"><b>${t('heatTitle')}</b>${heat}<p class="muted" style="margin-top:8px">${t('heatEmpty')}</p></div>
      <p class="muted">${t('progressEmpty')}</p>
    `
  }
  const id = state.progressId && list.some(ex => ex.id === state.progressId) ? state.progressId : list[0].id
  state.progressId = id
  const series = progressSeries(id)
  const maxKg = Math.max(1, ...series.map(p => p.kg))
  const bars = series.map(p => {
    const h = Math.max(8, Math.round((p.kg / maxKg) * 100))
    const label = `${new Date(p.started).getMonth() + 1}/${new Date(p.started).getDate()}`
    return `<div class="prog-col" title="${p.kg}×${p.reps}"><div class="prog-bar" style="height:${h}%"></div><span class="muted">${label}</span><span class="muted">${p.kg}</span></div>`
  }).join('')
  const peak = series.reduce((best, p) => (
    !best || p.kg > best.kg || (p.kg === best.kg && p.reps > best.reps) ? p : best
  ), null)
  return `
    <div class="row"><h1>${t('statsTitle')}</h1></div>
    <div class="card"><b>${t('heatTitle')}</b>${heat}</div>
    <p class="muted">${t('progressPick')}</p>
    <div class="chips" style="margin-top:8px">
      ${list.slice(0, 24).map(ex => `<button class="chip ${ex.id === id ? 'on' : ''}" data-prog="${ex.id}">${escapeHtml(exName(ex))}</button>`).join('')}
    </div>
    <div class="card">
      <b>${escapeHtml(exName(list.find(ex => ex.id === id)))}</b>
      <div class="muted" style="margin-top:4px">${t('progressSession', series.length)}${peak ? ` · ${t('progressBest', peak.kg, peak.reps)}` : ''}</div>
      <div class="prog-chart">${bars || `<p class="muted">${t('progressEmpty')}</p>`}</div>
    </div>
  `
}

function settingsView() {
  const soundOn = restSoundOn()
  return `
    <div class="row"><h1>${t('settings')}</h1></div>
    <p class="muted">v${APP_VERSION}. ${t('versionLocal')}</p>
    <div class="card">
      <b>${t('lang')}</b>
      <div class="chips" style="margin-top:8px">
        <button class="chip ${state.lang === 'zh' ? 'on' : ''}" data-lang="zh">中文</button>
        <button class="chip ${state.lang === 'en' ? 'on' : ''}" data-lang="en">English</button>
      </div>
    </div>
    ${themeBlockHtml()}
    <div class="card">
      <b>${t('restTitle')}</b>
      <div class="chips" style="margin-top:8px">
        ${[60, 90, 120, 180].map(n => `<button class="chip ${restSec() === n ? 'on' : ''}" data-rest="${n}">${n} ${t('seconds')}</button>`).join('')}
      </div>
      <div class="row" style="margin-top:10px">
        <span class="muted">${t('restSound')}</span>
        <div class="chips">
          <button class="chip ${soundOn ? 'on' : ''}" data-sound="1">${t('on')}</button>
          <button class="chip ${!soundOn ? 'on' : ''}" data-sound="0">${t('off')}</button>
        </div>
      </div>
    </div>
    <div class="card">
      <b>${t('backup')}</b>
      <div class="row" style="margin-top:8px;gap:8px">
        <button class="ghost" id="exportBtn" style="flex:1">${t('exportData')}</button>
        <button class="ghost" id="importBtn" style="flex:1">${state.importArmed ? t('importConfirm') : t('importData')}</button>
      </div>
      <input id="importFile" type="file" accept="application/json,.json" hidden />
    </div>
    <button class="ghost" id="check" style="width:100%;margin-top:8px">${t('checkUpdate')}</button>
    <p class="muted" style="margin-top:12px">${t('dataCredit')}</p>
  `
}

function progressView() {
  const list = trainedExercises()
  if (!list.length) {
    return `
      <div class="row"><h1>${t('progressTitle')}</h1><button class="ghost" id="back">${t('back')}</button></div>
      <p class="muted">${t('progressEmpty')}</p>
    `
  }
  const id = state.progressId && list.some(ex => ex.id === state.progressId) ? state.progressId : list[0].id
  state.progressId = id
  const series = progressSeries(id)
  const maxKg = Math.max(1, ...series.map(p => p.kg))
  const bars = series.map(p => {
    const h = Math.max(8, Math.round((p.kg / maxKg) * 100))
    const label = state.lang === 'zh'
      ? `${new Date(p.started).getMonth() + 1}/${new Date(p.started).getDate()}`
      : `${new Date(p.started).getMonth() + 1}/${new Date(p.started).getDate()}`
    return `<div class="prog-col" title="${p.kg}×${p.reps}"><div class="prog-bar" style="height:${h}%"></div><span class="muted">${label}</span><span class="muted">${p.kg}</span></div>`
  }).join('')
  const peak = series.reduce((best, p) => (
    !best || p.kg > best.kg || (p.kg === best.kg && p.reps > best.reps) ? p : best
  ), null)
  return `
    <div class="row"><h1>${t('progressTitle')}</h1><button class="ghost" id="back">${t('back')}</button></div>
    <p class="muted">${t('progressPick')}</p>
    <div class="chips" style="margin-top:8px">
      ${list.slice(0, 24).map(ex => `<button class="chip ${ex.id === id ? 'on' : ''}" data-prog="${ex.id}">${escapeHtml(exName(ex))}</button>`).join('')}
    </div>
    <div class="card">
      <b>${escapeHtml(exName(list.find(ex => ex.id === id)))}</b>
      <div class="muted" style="margin-top:4px">${t('progressSession', series.length)}${peak ? ` · ${t('progressBest', peak.kg, peak.reps)}` : ''}</div>
      <div class="prog-chart">${bars || `<p class="muted">${t('progressEmpty')}</p>`}</div>
    </div>
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
    ${list.map(ex => `
      <button class="list-btn" data-add="${ex.id}">
        <div class="pick-row">
          ${ex.img ? `<img class="thumb" src="${escapeHtml(mediaUrl(ex.img))}" alt="" loading="lazy" />` : ''}
          <div>
            <b>${escapeHtml(exName(ex))}</b>
            <div class="muted">${bodyName(ex.b)} · ${escapeHtml(eqName(ex.eq))} · ${escapeHtml(targetName(ex.t))}</div>
          </div>
        </div>
      </button>
    `).join('') || `<p class="muted">${t('noMatch')}</p>`}
  `
}

function workoutView() {
  const blocks = state.session.exercises.map((ex, i) => {
    const last = lastLine(ex.id)
    return `
    <div class="card">
      <div class="card-head">
        <b>${escapeHtml(exName(ex))}</b>
        <button class="danger tiny" data-del-ex="${i}">${t('removeExercise')}</button>
      </div>
      ${last ? `<div class="muted" style="margin:6px 0">${escapeHtml(last)}</div>` : ''}
      ${gifBlock(ex.id)}
      ${ex.sets.map((set, j) => `
        <div class="set ${set.done ? 'done' : ''}">
          <span>${j + 1}</span>
          <input data-kg="${i}:${j}" type="number" inputmode="decimal" placeholder="${t('kg')}" value="${set.kg}" ${set.done ? 'disabled' : ''} />
          <input data-reps="${i}:${j}" type="number" inputmode="numeric" placeholder="${t('reps')}" value="${set.reps}" ${set.done ? 'disabled' : ''} />
          ${set.done ? `<span>${t('done')}</span>` : `<button class="ghost tiny" data-done="${i}:${j}">${t('done')}</button>`}
          <button class="danger tiny" data-del-set="${i}:${j}">${t('removeSet')}</button>
        </div>
      `).join('')}
    </div>`
  }).join('')
  return `
    <div class="row"><h1>${t('workoutTitle')}</h1><button class="ghost" id="pick">${t('addExercise')}</button></div>
    ${blocks || `<p class="muted">${t('emptyWorkout')}</p>`}
    <button class="ghost" id="saveTpl" style="width:100%;margin-top:8px">${t('saveTemplate')}</button>
    <button class="primary" id="finish" style="margin-top:8px">${t('finish')}</button>
    ${state.restLeft > 0 ? `<div class="timer"><div><div class="muted" style="color:#d1d5db">${t('rest')}</div><b style="font-size:28px">${state.restLeft}s</b></div><button class="ghost" id="skip">${t('skip')}</button></div>` : ''}
  `
}

function templateView() {
  if (!state.draft) return `<button class="ghost" id="back">${t('back')}</button>`
  const items = state.draft.exercises.map((ex, i) => `
    <div class="row" style="margin-top:8px">
      <div class="list-btn" style="margin:0;flex:1"><b>${escapeHtml(exName(ex))}</b></div>
      <button class="danger tiny" data-del-draft="${i}">${t('removeTplEx')}</button>
    </div>
  `).join('')
  return `
    <div class="row"><h1>${t('newTemplate')}</h1><button class="ghost" id="back">${t('back')}</button></div>
    <input id="tplName" type="search" placeholder="${t('templatePh')}" value="${escapeHtml(state.draft.name || '')}" />
    ${items || `<p class="muted">${t('templateEmpty')}</p>`}
    <button class="ghost" id="pick" style="width:100%;margin-top:8px">${t('addToTemplate')}</button>
    <button class="primary" id="saveDraft" style="margin-top:8px">${t('saveTemplate')}</button>
  `
}

function detailView(store) {
  const w = store.workouts.find(item => item.id === state.openId)
  if (!w) return `<button class="ghost" id="back">${t('back')}</button><p>${t('notFound')}</p>`
  const blocks = w.exercises.map(ex => `
    <div class="card">
      <div class="card-head"><b>${escapeHtml(exName(ex))}</b>${gifBlock(ex.id)}</div>
      ${ex.sets.map((s, i) => `<div class="muted">${t('setLine', i + 1, s.kg, s.reps)}</div>`).join('')}
    </div>
  `).join('')
  const delLabel = state.confirmId === `wo:${w.id}` ? t('deleteConfirm') : t('deleteWorkout')
  const vol = workoutVolume(w)
  return `
    <div class="row"><h1>${fmt(w.started)}</h1><button class="ghost" id="back">${t('back')}</button></div>
    <p class="muted">${t('workoutVol', vol)}</p>
    ${blocks}
    <button class="danger" id="delWorkout" style="width:100%;margin-top:8px">${delLabel}</button>
  `
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
  on('startToday', () => {
    const tpl = todayTemplate(loadStore())
    if (tpl) startFromTemplate(tpl)
    else startSession()
  })
  on('check', checkUpdate)
  on('pick', () => { state.screen = 'pick'; render() })
  on('back', () => {
    if (state.screen === 'pick' && state.pickFor === 'template') {
      state.screen = 'template'
      render()
      return
    }
    if (state.screen === 'template') {
      state.draft = null
      state.pickFor = 'session'
      state.screen = state.session ? 'workout' : 'plan'
      render()
      return
    }
    if (state.screen === 'detail') {
      state.screen = 'history'
      render()
      return
    }
    if (state.screen === 'progress') {
      state.screen = 'stats'
      render()
      return
    }
    state.screen = state.session ? 'workout' : 'home'
    render()
  })
  on('finish', finishSession)
  on('skip', () => { clearInterval(state.restTimer); state.restLeft = 0; render() })
  on('newTpl', openNewTemplate)
  on('saveTpl', openSaveTemplate)
  on('saveDraft', saveDraft)
  on('delWorkout', () => deleteWorkout(state.openId))
  on('exportBtn', exportBackup)
  on('progressBtn', () => { state.screen = 'stats'; render() })
  on('importBtn', () => {
    if (!state.importArmed) {
      state.importArmed = true
      render()
      return
    }
    document.getElementById('importFile')?.click()
  })
  const importFile = document.getElementById('importFile')
  if (importFile) {
    importFile.onchange = () => {
      const file = importFile.files && importFile.files[0]
      importBackupFile(file)
      importFile.value = ''
    }
  }
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      state.screen = btn.dataset.tab
      state.importArmed = false
      render()
    }
  })
  document.querySelectorAll('[data-day]').forEach(sel => {
    sel.onchange = () => {
      setScheduleDay(sel.dataset.day, sel.value)
      render()
    }
  })
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.onclick = () => setLang(btn.dataset.lang)
  })
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.onclick = () => {
      if (typeof setTheme === 'function') setTheme(btn.dataset.theme)
    }
  })
  document.querySelectorAll('[data-rest]').forEach(btn => {
    btn.onclick = () => { setRestSec(btn.dataset.rest); render() }
  })
  document.querySelectorAll('[data-sound]').forEach(btn => {
    btn.onclick = () => { setRestSound(btn.dataset.sound === '1'); render() }
  })
  document.querySelectorAll('[data-prog]').forEach(btn => {
    btn.onclick = () => { state.progressId = btn.dataset.prog; render() }
  })
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.onclick = () => { state.openId = btn.dataset.open; state.confirmId = null; state.screen = 'detail'; render() }
  })
  document.querySelectorAll('[data-tpl]').forEach(btn => {
    btn.onclick = () => {
      const tpl = loadStore().templates.find(item => item.id === btn.dataset.tpl)
      if (tpl) startFromTemplate(tpl)
    }
  })
  document.querySelectorAll('[data-edit-tpl]').forEach(btn => {
    btn.onclick = () => {
      const tpl = loadStore().templates.find(item => item.id === btn.dataset.editTpl)
      if (!tpl) return
      state.draft = {
        name: tpl.name,
        exercises: tpl.exercises.map(ex => ({ id: ex.id, name: ex.name, zh: ex.zh || '' })),
        replaceId: tpl.id,
      }
      state.pickFor = 'template'
      state.screen = 'template'
      render()
    }
  })
  document.querySelectorAll('[data-del-tpl]').forEach(btn => {
    btn.onclick = () => deleteTemplate(btn.dataset.delTpl)
  })
  document.querySelectorAll('[data-del-ex]').forEach(btn => {
    btn.onclick = () => removeExercise(Number(btn.dataset.delEx))
  })
  document.querySelectorAll('[data-del-set]').forEach(btn => {
    btn.onclick = () => {
      const [i, j] = btn.dataset.delSet.split(':').map(Number)
      removeSet(i, j)
    }
  })
  document.querySelectorAll('[data-del-draft]').forEach(btn => {
    btn.onclick = () => {
      state.draft.exercises.splice(Number(btn.dataset.delDraft), 1)
      render()
    }
  })
  document.querySelectorAll('[data-gif]').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.gif
      state.openGif = state.openGif === id ? null : id
      render()
    }
  })
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.onclick = () => { state.filter = btn.dataset.filter; render() }
  })
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.onclick = () => addExercise(findExercise(btn.dataset.add))
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
  const tplName = document.getElementById('tplName')
  if (tplName) {
    tplName.oninput = () => { state.draft.name = tplName.value }
  }
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
