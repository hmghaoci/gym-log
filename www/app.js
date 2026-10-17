const APP_VERSION = '1.0.0'
const UPDATE_URL = 'https://raw.githubusercontent.com/hmghaoci/gym-log/main/release/latest.json'
const STORE_KEY = 'gymlog.v1'
const REST_KEY = 'gymlog.rest'

const BODY = {
  chest: '胸',
  back: '背',
  shoulders: '肩',
  'upper arms': '手臂',
  'lower arms': '前臂',
  'upper legs': '大腿',
  'lower legs': '小腿',
  waist: '核心',
  cardio: '有氧',
  neck: '颈部',
}
const FILTERS = [
  ['', '全部'],
  ['chest', '胸'],
  ['back', '背'],
  ['shoulders', '肩'],
  ['upper arms', '手臂'],
  ['upper legs', '腿'],
  ['waist', '核心'],
]

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
    toast('手机离线，训练记录仍在本机')
    return
  }
  try {
    const res = await fetch(`${UPDATE_URL}?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('http')
    const data = await res.json()
    if (!data.version || cmpVer(data.version, APP_VERSION) <= 0) {
      toast(`已是最新版本 ${APP_VERSION}`)
      return
    }
    const updater = window.Capacitor?.Plugins?.CapacitorUpdater
    if (!window.Capacitor?.isNativePlatform?.() || !updater) {
      toast(`发现 ${data.version}。请安装新的 APK`)
      return
    }
    if (!data.url || !data.checksum) {
      toast(`发现 ${data.version}，更新包还没上传`)
      return
    }
    await applyBundle(updater, data)
  } catch {
    toast('检查更新失败。训练记录仍在本机，可以继续练')
  }
}

async function applyBundle(CapacitorUpdater, data) {
  toast('正在下载更新，不用重装')
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
    toast('还没有完成任何一组')
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
  toast('这次训练已保存')
  render()
}

function fmt(ts) {
  const d = new Date(ts)
  const p = n => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`
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
  const items = store.workouts.map(w => {
    const names = w.exercises.map(e => e.name).slice(0, 3).join('、')
    return `<button class="list-btn" data-open="${w.id}"><b>${fmt(w.started)}</b><div class="muted">${w.exercises.length} 个动作 · ${names}</div></button>`
  }).join('')
  return `
    <div class="row"><h1>健身记录</h1><button class="ghost" id="check">检查更新</button></div>
    <p class="muted">版本 ${APP_VERSION}。记录只存在这台手机里。</p>
    <button class="primary" id="start">开始训练</button>
    <div class="card">
      <b>组间休息</b>
      <div class="chips" style="margin-top:8px">
        ${[60, 90, 120, 180].map(n => `<button class="chip ${restSec() === n ? 'on' : ''}" data-rest="${n}">${n} 秒</button>`).join('')}
      </div>
    </div>
    <h2 style="font-size:16px">历史</h2>
    ${items || '<p class="muted">还没有训练记录。</p>'}
    <p class="muted">动作数据来自 hasaneyldrm/exercises-dataset。</p>
  `
}

function pickView() {
  const q = state.query.trim().toLowerCase()
  const list = state.exercises.filter(ex => {
    if (state.filter && ex.b !== state.filter && !(state.filter === 'upper arms' && ex.b === 'lower arms') && !(state.filter === 'upper legs' && ex.b === 'lower legs')) return false
    if (!q) return true
    return ex.n.toLowerCase().includes(q) || (BODY[ex.b] || '').includes(q) || (ex.t || '').toLowerCase().includes(q)
  }).slice(0, 40)
  return `
    <div class="row"><h1>选择动作</h1><button class="ghost" id="back">返回</button></div>
    <input id="q" type="search" placeholder="搜索英文名或部位" value="${escapeHtml(state.query)}" />
    <div class="chips" style="margin-top:8px">
      ${FILTERS.map(([id, label]) => `<button class="chip ${state.filter === id ? 'on' : ''}" data-filter="${id}">${label}</button>`).join('')}
    </div>
    ${list.map(ex => `<button class="list-btn" data-add="${ex.id}"><b>${escapeHtml(ex.n)}</b><div class="muted">${BODY[ex.b] || ex.b} · ${escapeHtml(ex.eq)} · ${escapeHtml(ex.t)}</div></button>`).join('') || '<p class="muted">没有匹配的动作。</p>'}
  `
}

function workoutView() {
  const blocks = state.session.exercises.map((ex, i) => `
    <div class="card">
      <b>${escapeHtml(ex.name)}</b>
      ${ex.sets.map((set, j) => `
        <div class="set ${set.done ? 'done' : ''}">
          <span>${j + 1}</span>
          <input data-kg="${i}:${j}" type="number" inputmode="decimal" placeholder="公斤" value="${set.kg}" ${set.done ? 'disabled' : ''} />
          <input data-reps="${i}:${j}" type="number" inputmode="numeric" placeholder="次数" value="${set.reps}" ${set.done ? 'disabled' : ''} />
          ${set.done ? '<span>完成</span>' : `<button class="ghost" data-done="${i}:${j}">完成</button>`}
        </div>
      `).join('')}
    </div>
  `).join('')
  return `
    <div class="row"><h1>训练中</h1><button class="ghost" id="pick">加动作</button></div>
    ${blocks || '<p class="muted">先添加一个动作。</p>'}
    <button class="primary" id="finish">结束并保存</button>
    ${state.restLeft > 0 ? `<div class="timer"><div><div class="muted" style="color:#d1d5db">休息</div><b style="font-size:28px">${state.restLeft}s</b></div><button class="ghost" id="skip">跳过</button></div>` : ''}
  `
}

function detailView(store) {
  const w = store.workouts.find(item => item.id === state.openId)
  if (!w) return `<button class="ghost" id="back">返回</button><p>找不到这次训练。</p>`
  const blocks = w.exercises.map(ex => `
    <div class="card"><b>${escapeHtml(ex.name)}</b>
      ${ex.sets.map((s, i) => `<div class="muted">第 ${i + 1} 组 · ${s.kg || 0} 公斤 × ${s.reps || 0} 次</div>`).join('')}
    </div>
  `).join('')
  return `<div class="row"><h1>${fmt(w.started)}</h1><button class="ghost" id="back">返回</button></div>${blocks}`
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
  render()
  if (window.Capacitor?.isNativePlatform?.()) {
    window.Capacitor.Plugins.CapacitorUpdater?.notifyAppReady?.().catch(() => {})
  }
}

boot()
