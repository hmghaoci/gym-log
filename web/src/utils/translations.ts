export const BODY_PARTS_ZH: Record<string, string> = {
  chest: '胸部',
  back: '背部',
  shoulders: '肩部',
  'upper arms': '大臂',
  'lower arms': '前臂',
  'upper legs': '大腿',
  'lower legs': '小腿',
  waist: '核心/腹部',
  cardio: '有氧',
  neck: '颈部',
};

export const EQUIPMENT_ZH: Record<string, string> = {
  barbell: '杠铃',
  dumbbell: '哑铃',
  'body weight': '自重',
  cable: '绳索',
  machine: '固定器械',
  'leverage machine': '器械',
  'smith machine': '史密斯机',
  'olympic barbell': '奥林匹克杠铃',
  'ez barbell': '曲柄杠',
  kettlebell: '壶铃',
  band: '弹力带',
  'medicine ball': '药球',
  weighted: '负重',
  assisted: '辅助器械',
  roller: '泡沫轴',
  rope: '战绳',
  'stability ball': '瑜伽球',
  bosu: '博速球',
};

export const TARGET_MUSCLES_ZH: Record<string, string> = {
  abs: '腹肌',
  biceps: '肱二头肌',
  triceps: '肱三头肌',
  lats: '背阔肌',
  delts: '三角肌',
  pectorals: '胸大肌',
  quads: '股四头肌',
  hamstrings: '腘绳肌',
  glutes: '臀大肌',
  calves: '小腿肌群',
  traps: '斜方肌',
  forearms: '前臂肌群',
  spine: '竖脊肌',
  adductors: '内收肌群',
  abductors: '外展肌群',
  cardiovascular: '心肺系统',
  'upper back': '上背肌群',
  serratus: '前锯肌',
};

export function getBodyPartName(part: string, lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'en') return part.charAt(0).toUpperCase() + part.slice(1);
  return BODY_PARTS_ZH[part.toLowerCase()] || part;
}

export function getEquipmentName(eq: string, lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'en') return eq.charAt(0).toUpperCase() + eq.slice(1);
  return EQUIPMENT_ZH[eq.toLowerCase()] || eq;
}

export function getMuscleTargetName(target: string, lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'en') return target.charAt(0).toUpperCase() + target.slice(1);
  return TARGET_MUSCLES_ZH[target.toLowerCase()] || target;
}

export const CDN_BASE = 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/';

export function getExerciseMediaUrl(path?: string): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${CDN_BASE}${path}`;
}

export const DAYS_ZH = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SHORT_DAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'];
export const SHORT_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
