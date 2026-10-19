import React, { useMemo, useState } from 'react';
import { Search, X, Dumbbell } from 'lucide-react';
import { RawExercise, WorkoutSession } from '../types/gym';
import { RAW_EXERCISES } from '../utils/storage';
import {
  BODY_PARTS_ZH,
  EQUIPMENT_ZH,
  getBodyPartName,
  getEquipmentName,
  getExerciseMediaUrl,
  getExerciseMediaFallbackUrl,
} from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface ExerciseLibraryViewProps {
  onSelectExerciseToPreview: (exercise: RawExercise) => void;
  historySessions: WorkoutSession[];
  theme: ThemeConfig;
}

const BODY_ORDER = [
  'chest',
  'back',
  'upper legs',
  'shoulders',
  'upper arms',
  'lower legs',
  'waist',
  'cardio',
  'lower arms',
  'neck',
];

const BODY_SHORT: Record<string, string> = {
  chest: '胸',
  back: '背',
  'upper legs': '腿',
  shoulders: '肩',
  'upper arms': '手臂',
  'lower legs': '小腿',
  waist: '腹部',
  cardio: '有氧',
  'lower arms': '前臂',
  neck: '颈',
};

const EQ_SHORT: { id: string; label: string; title: string }[] = [
  { id: 'all', label: '常', title: '常用' },
  { id: 'barbell', label: '杠', title: '杠铃' },
  { id: 'dumbbell', label: '哑', title: '哑铃' },
  { id: 'smith machine', label: '史', title: '史密斯' },
  { id: 'leverage machine', label: '器', title: '器械' },
  { id: 'cable', label: '绳', title: '绳索' },
  { id: 'body weight', label: '自', title: '自重' },
  { id: 'band', label: '带', title: '弹力带' },
  { id: 'other', label: '其', title: '其他' },
];

const KNOWN_EQ = new Set(EQ_SHORT.map((e) => e.id).filter((id) => id !== 'all' && id !== 'other'));

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onSelectExerciseToPreview,
  historySessions,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('chest');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 48;

  const bodyTabs = useMemo(() => {
    const present = new Set(RAW_EXERCISES.map((e) => e.b.toLowerCase()));
    const ordered = BODY_ORDER.filter((k) => present.has(k));
    Object.keys(BODY_PARTS_ZH).forEach((k) => {
      if (present.has(k) && !ordered.includes(k)) ordered.push(k);
    });
    return ordered;
  }, []);

  const filteredExercises = useMemo(() => {
    let list = RAW_EXERCISES;
    const body = selectedBodyPart.toLowerCase();
    list = list.filter((ex) => ex.b.toLowerCase() === body);

    if (selectedEquipment === 'other') {
      list = list.filter((ex) => !KNOWN_EQ.has(ex.eq.toLowerCase()));
    } else if (selectedEquipment !== 'all') {
      list = list.filter((ex) => ex.eq.toLowerCase() === selectedEquipment.toLowerCase());
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((ex) => {
        const matchZh = ex.zh && ex.zh.toLowerCase().includes(q);
        const matchEn = ex.n.toLowerCase().includes(q);
        const matchTarget = ex.t && ex.t.toLowerCase().includes(q);
        return matchZh || matchEn || matchTarget;
      });
    }
    return list;
  }, [searchTerm, selectedBodyPart, selectedEquipment]);

  const paginatedList = filteredExercises.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedList.length < filteredExercises.length;
  const eqTitle =
    EQ_SHORT.find((e) => e.id === selectedEquipment)?.title ||
    EQUIPMENT_ZH[selectedEquipment] ||
    '动作';

  return (
    <div
      className={`-mx-4 sm:-mx-6 -mt-5 sm:-mt-6 mb-0 pb-28 md:pb-16 min-h-[calc(100vh-4rem)] flex flex-col ${
        theme.isDark ? 'bg-[#0a0a0e]' : 'bg-[#f2f3f5]'
      }`}
    >
      <div className="flex items-center gap-2 px-3 pt-3 pb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="输入动作名字搜索"
            className={`w-full pl-10 pr-9 py-2.5 rounded-full text-sm focus:outline-none border ${
              theme.isDark
                ? 'bg-[#15151c] border-white/10 text-white placeholder-zinc-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[4.5rem_1fr_1.75rem] gap-0">
        <aside className={`overflow-y-auto ${theme.isDark ? 'bg-[#0a0a0e]' : 'bg-[#f2f3f5]'}`}>
          {bodyTabs.map((key) => {
            const active = selectedBodyPart === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedBodyPart(key);
                  setPage(1);
                }}
                className={`w-full text-left px-2.5 py-3 text-xs font-bold transition-colors ${
                  active
                    ? theme.isDark
                      ? 'bg-[#15151c] text-white border-l-[3px]'
                      : 'bg-white text-slate-900 border-l-[3px]'
                    : theme.isDark
                    ? 'text-zinc-500 hover:text-zinc-300'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={active ? { borderColor: theme.accentColor } : undefined}
              >
                {BODY_SHORT[key] || getBodyPartName(key)}
              </button>
            );
          })}
        </aside>

        <main
          className={`overflow-y-auto rounded-tl-2xl px-2.5 pt-3 pb-8 ${
            theme.isDark ? 'bg-[#121218]' : 'bg-white'
          }`}
        >
          <h2 className={`text-base font-black mb-3 px-0.5 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            {eqTitle} · {filteredExercises.length} 个
          </h2>

          {paginatedList.length === 0 ? (
            <div className="py-16 text-center">
              <Dumbbell className="w-10 h-10 mx-auto mb-2 text-zinc-400 opacity-50" />
              <p className={`text-xs ${theme.isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                该分类下暂无动作，试试右侧换器械
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {paginatedList.map((ex) => {
                const mediaUrl = getExerciseMediaUrl(ex.g || ex.img);
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onSelectExerciseToPreview(ex)}
                    className={`text-left rounded-xl overflow-hidden border transition-all ${
                      theme.isDark
                        ? 'bg-[#16161e] border-white/10 hover:border-white/25'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="relative aspect-square bg-[#0b1220]">
                      <span
                        className="absolute left-1.5 top-1.5 z-10 text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: '#3b82f6' }}
                      >
                        3D
                      </span>
                      {mediaUrl ? (
                        <img
                          src={mediaUrl}
                          alt={ex.zh || ex.n}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const fb = getExerciseMediaFallbackUrl(ex.g || ex.img);
                            if (fb && e.currentTarget.dataset.fallback !== '1') {
                              e.currentTarget.dataset.fallback = '1';
                              e.currentTarget.src = fb;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Dumbbell className="w-8 h-8 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <div className={`text-xs font-extrabold leading-snug line-clamp-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                        {ex.zh || ex.n}
                      </div>
                      <div className={`text-[10px] ${theme.isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        {getBodyPartName(ex.b)} · {getEquipmentName(ex.eq)}
                      </div>
                      <div
                        className={`w-full text-center text-[11px] font-bold py-1.5 rounded-lg ${
                          theme.isDark ? 'bg-white/[0.06] text-zinc-400' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        查看动作要点
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {hasMore ? (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full mt-4 py-3 rounded-xl text-xs font-bold"
              style={{ color: theme.accentColor }}
            >
              加载更多
            </button>
          ) : null}
        </main>

        <nav
          className={`overflow-y-auto flex flex-col items-center gap-0.5 pt-2 pb-8 border-l ${
            theme.isDark ? 'bg-[#121218] border-white/5' : 'bg-white border-slate-100'
          }`}
        >
          {EQ_SHORT.map((eq) => {
            const active = selectedEquipment === eq.id;
            return (
              <button
                key={eq.id}
                title={eq.title}
                onClick={() => {
                  setSelectedEquipment(eq.id);
                  setPage(1);
                }}
                className={`w-7 min-h-7 text-xs font-bold ${
                  active
                    ? 'font-black'
                    : theme.isDark
                    ? 'text-zinc-500'
                    : 'text-slate-400'
                }`}
                style={active ? { color: theme.accentColor } : undefined}
              >
                {eq.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
