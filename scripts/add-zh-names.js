const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'www', 'data', 'exercises.json')
const list = JSON.parse(fs.readFileSync(file, 'utf8'))

const bodyZh = {
  chest: '胸部', back: '背部', shoulders: '肩部', 'upper arms': '手臂', 'lower arms': '前臂',
  'upper legs': '大腿', 'lower legs': '小腿', waist: '核心', cardio: '有氧', neck: '颈部',
}
const eqZh = {
  'body weight': '自重', dumbbell: '哑铃', barbell: '杠铃', cable: '绳索',
  'leverage machine': '器械', band: '弹力带', kettlebell: '壶铃',
  'stability ball': '稳定球', 'medicine ball': '药球', 'smith machine': '史密斯机',
  'ez barbell': '曲杆', 'olympic barbell': '奥杠', rope: '绳索', sled: '雪橇',
  assisted: '辅助', 'wheel roller': '健腹轮',
}

const exact = {
  '3/4 sit-up': '四分之三仰卧起坐',
  '45° side bend': '45度侧屈',
  'air bike': '空中自行车',
  'ankle circles': '脚踝绕环',
  'archer pull up': '射箭式引体向上',
  'all fours squad stretch': '跪撑大腿拉伸',
  'alternate heel touchers': '交替触踵',
  'alternate lateral pulldown': '交替高位下拉',
  'back extension': '背部伸展',
  'bicycle crunch': '自行车卷腹',
  burpee: '波比跳',
  butterfly: '蝴蝶机夹胸',
  'cat stretch': '猫式伸展',
  'clean and jerk': '挺举',
  'clean and press': '高翻推举',
  'dead bug': '死虫式',
  'farmer walk': '农夫行走',
  'farmers walk': '农夫行走',
  hyperextension: '山羊挺身',
  'mountain climber': '登山跑',
  'muscle up': '双力臂',
  'nordic hamstring curl': '北欧腿弯举',
  'push press': '借力推举',
  'russian twist': '俄罗斯转体',
  snatch: '抓举',
  'turkish get-up': '土耳其起立',
  'turkish get up': '土耳其起立',
  'v-up': 'V字起身',
  'barbell bench press': '杠铃平板卧推',
  'barbell full squat': '杠铃深蹲',
  'barbell deadlift': '杠铃硬拉',
  'dumbbell curl': '哑铃弯举',
  'pull-up': '引体向上',
  'push-up': '俯卧撑',
}

const dict = [
  ['romanian deadlift', '罗马尼亚硬拉'], ['sumo deadlift', '相扑硬拉'], ['stiff leg deadlift', '直腿硬拉'],
  ['behind the neck', '颈后'], ['behind neck', '颈后'], ['front raise', '前平举'], ['lateral raise', '侧平举'],
  ['rear delt fly', '后束飞鸟'], ['rear delt', '后束'], ['bench press', '卧推'], ['chest press', '推胸'],
  ['shoulder press', '推肩'], ['military press', '军事推举'], ['overhead press', '过头推举'],
  ['leg press', '腿举'], ['leg curl', '腿弯举'], ['leg extension', '腿屈伸'], ['calf raise', '提踵'],
  ['hip thrust', '臀推'], ['glute bridge', '臀桥'], ['lat pulldown', '高位下拉'], ['face pull', '面拉'],
  ['cable fly', '绳索夹胸'], ['chest fly', '夹胸'], ['preacher curl', '牧师弯举'],
  ['concentration curl', '集中弯举'], ['hammer curl', '锤式弯举'], ['biceps curl', '肱二头弯举'],
  ['tricep extension', '肱三头伸展'], ['triceps extension', '肱三头伸展'], ['skull crusher', '躺式臂屈伸'],
  ['close-grip', '窄握'], ['close grip', '窄握'], ['wide-grip', '宽握'], ['wide grip', '宽握'],
  ['neutral grip', '对握'], ['split squat', '分腿蹲'], ['hack squat', '哈克深蹲'],
  ['front squat', '颈前深蹲'], ['back squat', '颈后深蹲'], ['goblet squat', '高脚杯深蹲'],
  ['single-leg', '单腿'], ['single leg', '单腿'], ['one-arm', '单臂'], ['one arm', '单臂'],
  ['one-hand', '单手'], ['one hand', '单手'], ['pull-up', '引体向上'], ['pull up', '引体向上'],
  ['chin-up', '反手引体向上'], ['chin up', '反手引体向上'], ['push-up', '俯卧撑'], ['push up', '俯卧撑'],
  ['sit-up', '仰卧起坐'], ['sit up', '仰卧起坐'], ['step-up', '登箱'], ['step up', '登箱'],
  ['deadlift', '硬拉'], ['bent-over', '俯身'], ['bent over', '俯身'], ['good morning', '早安式'],
  ['resistance band', '弹力带'], ['body weight', '自重'], ['bodyweight', '自重'],
  ['medicine ball', '药球'], ['stability ball', '稳定球'], ['exercise ball', '健身球'],
  ['battle rope', '战绳'], ['battling ropes', '战绳'], ['smith machine', '史密斯机'],
  ['ez bar', '曲杆'], ['ez-bar', '曲杆'], ['trap bar', '六角杠'], ['t-bar', 'T杠'], ['t bar', 'T杠'],
  ['all fours', '跪撑'], ['heel touchers', '触踵'], ['heel touch', '触踵'], ['side bend', '侧屈'],
  ['air bike', '空中自行车'], ['ankle circles', '脚踝绕环'], ['archer', '射箭式'],
  ['mountain climber', '登山跑'], ['russian twist', '俄罗斯转体'], ['dead bug', '死虫式'],
  ['muscle up', '双力臂'], ['farmer walk', '农夫行走'], ['farmers walk', '农夫行走'],
  ['turkish get up', '土耳其起立'], ['turkish get-up', '土耳其起立'], ['nordic', '北欧'],
  ['kettlebell', '壶铃'], ['dumbbell', '哑铃'], ['barbell', '杠铃'], ['cable', '绳索'],
  ['machine', '器械'], ['band', '弹力带'], ['assisted', '辅助'], ['weighted', '负重'],
  ['alternating', '交替'], ['alternate', '交替'], ['seated', '坐姿'], ['standing', '站姿'],
  ['lying', '卧姿'], ['prone', '俯卧'], ['supine', '仰卧'], ['incline', '上斜'], ['decline', '下斜'],
  ['kneeling', '跪姿'], ['hanging', '悬垂'], ['inverted', '倒立'], ['reverse', '反向'],
  ['upright', '直立'], ['bulgarian', '保加利亚'], ['parallel', '平行'], ['overhead', '过头'],
  ['straight arm', '直臂'], ['straight-arm', '直臂'], ['straight back', '直背'],
  ['straight leg', '直腿'], ['stiff leg', '直腿'], ['narrow grip', '窄握'], ['hammer grip', '锤握'],
  ['pronated', '正手'], ['supinated', '反手'], ['underhand', '反手'], ['overhand', '正手'],
  ['single arm', '单臂'], ['single-arm', '单臂'], ['two arm', '双臂'], ['two-arm', '双臂'],
  ['high bar', '高杠'], ['low bar', '低杠'], ['sumo', '相扑'], ['arnold', '阿诺德'],
  ['squat', '深蹲'], ['squad', '大腿'], ['lunge', '弓步'], ['shrug', '耸肩'], ['press', '推举'],
  ['curl', '弯举'], ['row', '划船'], ['fly', '飞鸟'], ['flye', '飞鸟'], ['raise', '抬举'],
  ['pulldown', '下拉'], ['pull-down', '下拉'], ['pullover', '过顶拉'], ['extension', '伸展'],
  ['crunch', '卷腹'], ['plank', '平板支撑'], ['twist', '转体'], ['dip', '臂屈伸'],
  ['kickback', '后踢'], ['jump', '跳跃'], ['stretch', '拉伸'], ['rotation', '旋转'],
  ['abduction', '外展'], ['adduction', '内收'], ['flexion', '屈曲'], ['hyperextension', '超伸'],
  ['pushdown', '下压'], ['thruster', '推举深蹲'], ['clean', '高翻'], ['jerk', '挺举'],
  ['snatch', '抓举'], ['swing', '摆动'], ['carry', '行走'], ['walk', '行走'], ['march', '踏步'],
  ['run', '跑'], ['sprint', '冲刺'], ['climb', '攀爬'], ['rollout', '滚动'], ['roller', '滚轮'],
  ['bridge', '桥式'], ['pike', '屈体'], ['tuck', '团身'], ['twisting', '扭转'],
  ['side', '侧向'], ['front', '前方'], ['rear', '后方'], ['upper', '上方'], ['lower', '下方'],
  ['inner', '内侧'], ['outer', '外侧'], ['left', '左侧'], ['right', '右侧'],
  ['high', '高位'], ['low', '低位'], ['full', '完'], ['half', '半'], ['double', '双'],
  ['single', '单'], ['wide', '宽'], ['narrow', '窄'], ['deep', '深'], ['floor', '地板'],
  ['wall', '靠墙'], ['bench', '凳上'], ['box', '箱子'], ['chair', '椅子'], ['rope', '绳'],
  ['lever', '器械'], ['sled', '雪橇'], ['smith', '史密斯'], ['landmine', '地雷架'],
  ['glute', '臀部'], ['hamstring', '腘绳'], ['calf', '小腿'], ['hip', '髋'], ['knee', '膝'],
  ['elbow', '肘'], ['wrist', '腕'], ['shoulder', '肩'], ['chest', '胸'], ['back', '背'],
  ['neck', '颈'], ['abs', '腹'], ['oblique', '斜腹'], ['tricep', '肱三头'], ['triceps', '肱三头'],
  ['bicep', '肱二头'], ['biceps', '肱二头'], ['deltoid', '三角肌'], ['delts', '三角肌'],
  ['lat', '背阔'], ['quad', '股四头'], ['quads', '股四头'], ['trap', '斜方'], ['traps', '斜方'],
  ['forearm', '前臂'], ['grip', '握法'], ['push', '推'], ['pull', '拉'], ['lift', '提'],
  ['kick', '踢'], ['tap', '点触'], ['hold', '静力'], ['iso', '静力'], ['isometric', '静力'],
  ['circle', '绕环'], ['circles', '绕环'], ['touch', '触'], ['touchers', '触'],
  ['lateral', '侧向'], ['vertical', '垂直'], ['horizontal', '水平'], ['diagonal', '斜向'],
  ['cross', '交叉'], ['crossed', '交叉'], ['crossed arms', '交叉臂'],
  ['close', '窄'], ['open', '开'], ['palms', '掌心'], ['hands', '双手'], ['hand', '手'],
  ['arms', '双臂'], ['arm', '臂'], ['legs', '双腿'], ['leg', '腿'], ['foot', '脚'], ['feet', '双脚'],
  ['heels', '脚跟'], ['heel', '脚跟'], ['toes', '脚尖'], ['toe', '脚尖'],
  ['sitting', '坐姿'], ['standing', '站姿'], ['knees', '膝'],
  ['elevation', '抬高'], ['elevated', '抬高'], ['decline', '下斜'],
  ['rotation', '旋转'], ['rotations', '旋转'], ['rotate', '旋转'],
  ['flexion', '屈曲'], ['extension', '伸展'], ['abductor', '外展'], ['adductor', '内收'],
  ['burpee', '波比跳'], ['butterfly', '蝴蝶'], ['jack', '开合'], ['jumping jack', '开合跳'],
  ['climber', '登山'], ['skater', '滑冰'], ['shuttle', '折返'],
  ['press', '推举'], ['presses', '推举'], ['raises', '抬举'], ['curls', '弯举'],
  ['rows', '划船'], ['flies', '飞鸟'], ['flyes', '飞鸟'], ['extensions', '伸展'],
  ['crunches', '卷腹'], ['lunges', '弓步'], ['squats', '深蹲'], ['dips', '臂屈伸'],
  ['shrugs', '耸肩'], ['twists', '转体'], ['planks', '平板支撑'],
  ['get up', '起立'], ['get-up', '起立'], ['v up', 'V字起身'], ['v-up', 'V字起身'],
  ['female', ''], ['male', ''], ['with', ''], ['and', ''], ['from', ''], ['into', ''],
  ['against', '靠'], ['across', '过'], ['over', '过'], ['under', '下'], ['between', '间'],
  ['the', ''], ['a', ''], ['an', ''], ['of', ''], ['to', ''], ['on', ''], ['in', ''],
  ['up', ''], ['down', ''], ['out', ''], ['off', ''], ['for', ''], ['by', ''],
].sort((a, b) => b[0].length - a[0].length)

function translatePhrase(name) {
  const key = name.toLowerCase().trim()
  if (exact[key]) return exact[key]
  let rest = key.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim()
  let out = ''
  while (rest.length) {
    let hit = false
    for (const [en, zh] of dict) {
      if (!rest.startsWith(en)) continue
      const next = rest[en.length]
      if (next && /[a-z0-9]/i.test(next) && /[a-z0-9]/i.test(en.at(-1))) continue
      out += zh
      rest = rest.slice(en.length).replace(/^[\s\-_/,]+/, '')
      hit = true
      break
    }
    if (!hit) {
      const m = rest.match(/^[0-9]+(?:\/[0-9]+)?°?/)
      if (m) {
        out += m[0].replace('°', '度')
        rest = rest.slice(m[0].length).replace(/^[\s\-_/,]+/, '')
        continue
      }
      const word = rest.match(/^[a-z0-9°]+/i)
      if (!word) { rest = rest.slice(1); continue }
      return null
    }
  }
  return out || null
}

const targetZh = {
  abs: '腹肌', lats: '背阔肌', quads: '股四头肌',
  biceps: '肱二头肌', triceps: '肱三头肌', delts: '三角肌', deltoids: '三角肌',
  glutes: '臀肌', hamstrings: '腘绳肌', calves: '小腿', traps: '斜方肌',
  chest: '胸肌', pecs: '胸肌', forearms: '前臂', shoulders: '肩',
  adductors: '内收肌', abductors: '外展肌', spine: '脊柱',
  cardiovascular: '心肺', 'cardiovascular system': '心肺',
  'serratus anterior': '前锯肌', serratus: '前锯肌', obliques: '腹斜肌',
  pectorals: '胸肌', 'upper back': '上背', 'lower back': '下背',
  'levator scapulae': '肩胛提肌',
}

function fallbackName(ex) {
  const parts = [
    eqZh[ex.eq] || '',
    bodyZh[ex.b] || '',
    targetZh[String(ex.t || '').toLowerCase()] || '',
  ].filter(Boolean)
  return parts.join('') || (bodyZh[ex.b] || '训练动作')
}

for (const ex of list) {
  const zh = translatePhrase(ex.n)
  let name = zh && !/[a-zA-Z]/.test(zh) ? zh : fallbackName(ex)
  if (/[a-zA-Z]/.test(name)) name = fallbackName(ex)
  ex.zh = name
}

fs.writeFileSync(file, JSON.stringify(list))
const bad = list.filter(e => /[a-zA-Z]/.test(e.zh))
const total = list.length
const translated = list.filter(e => e.zh && e.zh !== fallbackName(e)).length
console.log('total', total, 'remaining latin', bad.length)
console.log(list.slice(0, 8).map(e => `${e.n} => ${e.zh}`).join('\n'))
console.log('---')
console.log(list.filter(e => /bench press|squat|deadlift|pull-up|push-up|curl/i.test(e.n)).slice(0, 15).map(e => `${e.n} => ${e.zh}`).join('\n'))
if (bad.length) console.log('bad samples:\n' + bad.slice(0, 10).map(e => `${e.n} => ${e.zh}`).join('\n'))
