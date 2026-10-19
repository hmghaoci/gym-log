export const APP_VERSION = '1.9.1'

const UPDATE_URLS = [
  'https://github.com/hmghaoci/gym-log/releases/latest/download/latest.json',
  'https://raw.githubusercontent.com/hmghaoci/gym-log/main/release/latest.json',
]

function cmpVer(a: string, b: string) {
  const pa = String(a).split('.').map((n) => Number(n) || 0)
  const pb = String(b).split('.').map((n) => Number(n) || 0)
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] > pb[i] ? 1 : -1
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
      lastError = err instanceof Error ? err.message : 'http'
    }
  }
  throw new Error(lastError)
}

export async function checkUpdate(): Promise<string> {
  if (navigator.onLine === false) return '当前没有网络'
  const cap = (window as any).Capacitor
  const data = await loadLatest()
  if (!data.version || cmpVer(data.version, APP_VERSION) <= 0) {
    return `已是最新版本 ${APP_VERSION}`
  }
  const updater = cap?.Plugins?.CapacitorUpdater
  if (!cap?.isNativePlatform?.() || !updater) {
    if (data.apk) window.location.href = data.apk
    return `发现 ${data.version}，开始下载安装包`
  }
  if (!data.url || !data.checksum) {
    if (data.apk) window.location.href = data.apk
    return `发现 ${data.version}，更新包还没上传`
  }
  const bundle = await updater.download({
    url: data.url,
    version: data.version,
    checksum: data.checksum,
  })
  await updater.set({ id: bundle.id })
  return `已更新到 ${data.version}`
}
