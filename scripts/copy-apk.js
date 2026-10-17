const fs = require('fs')
const path = require('path')
const src = path.join(__dirname, '..', 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
const dest = path.join('C:\\Users\\up\\Desktop', '健身记录-1.1.0.apk')
if (!fs.existsSync(src)) {
  console.error('找不到 APK，请先运行 npm run android')
  process.exit(1)
}
fs.copyFileSync(src, dest)
console.log(dest)
