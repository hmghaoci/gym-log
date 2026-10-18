/**
 * 把动作缩略图 / GIF 同步到 web/public，构建后进入 www 离线可用。
 * 优先复制本机 ../exercises-dataset，否则从 jsDelivr 下载。
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'web', 'public')
const exercises = JSON.parse(fs.readFileSync(path.join(root, 'web', 'src', 'data', 'exercises.json'), 'utf8'))
const localDataset = path.join(root, '..', 'exercises-dataset')
const CDN = 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/'

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    ensureDir(path.dirname(dest))
    const file = fs.createWriteStream(dest)
    https.get(url, { headers: { 'User-Agent': 'gym-log-media-sync' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close()
        fs.unlinkSync(dest)
        download(res.headers.location, dest).then(resolve, reject)
        return
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        reject(new Error(`${res.statusCode} ${url}`))
        return
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
    }).on('error', (err) => {
      file.close()
      try { fs.unlinkSync(dest) } catch {}
      reject(err)
    })
  })
}

async function mapPool(items, limit, worker) {
  let i = 0
  const runners = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++
      await worker(items[idx], idx)
    }
  })
  await Promise.all(runners)
}

async function main() {
  const paths = []
  for (const ex of exercises) {
    if (ex.img) paths.push(ex.img)
    if (ex.g) paths.push(ex.g)
  }
  const unique = [...new Set(paths)]
  let copied = 0
  let downloaded = 0
  let skipped = 0
  const useLocal = fs.existsSync(path.join(localDataset, 'images'))

  console.log(`sync ${unique.length} files (${useLocal ? 'local dataset' : 'cdn'})`)

  await mapPool(unique, useLocal ? 8 : 16, async (rel) => {
    const dest = path.join(publicDir, rel)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      skipped++
      return
    }
    const localSrc = path.join(localDataset, rel)
    if (useLocal && fs.existsSync(localSrc)) {
      copyFile(localSrc, dest)
      copied++
      return
    }
    await download(CDN + rel, dest)
    downloaded++
    if ((copied + downloaded) % 100 === 0) {
      console.log(`progress ${copied + downloaded + skipped}/${unique.length}`)
    }
  })

  console.log(`done copied=${copied} downloaded=${downloaded} skipped=${skipped}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
