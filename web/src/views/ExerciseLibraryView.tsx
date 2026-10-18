import React, { useState, useMemo } from 'react';
import { Search, Dumbbell, Filter, Eye, ChevronRight, X, Play } from 'lucide-react';
import { RawExercise, WorkoutSession } from '../types/gym';
import { RAW_EXERCISES } from '../utils/storage';
import { BODY_PARTS_ZH, EQUIPMENT_ZH, getBodyPartName, getEquipmentName, getMuscleTargetName, getExerciseMediaUrl } from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface ExerciseLibraryViewProps {
  onSelectExerciseToPreview: (exercise: RawExercise) => void;
  historySessions: WorkoutSession[];
  theme: ThemeConfig;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onSelectExerciseToPreview,
  historySessions,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 36;

  // Track which exercises user has performed in history
  const performedExerciseIds = useMemo(() => {
    const ids = new Set<string>();
    historySessions.forEach((s) => {
      s.exercises.forEach((e) => ids.add(e.exerciseId));
    });
    return ids;
  }, [historySessions]);

  const filteredExercises = useMemo(() => {
    let list = RAW_EXERCISES;

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((ex) => {
        const matchZh = ex.zh && ex.zh.toLowerCase().includes(q);
        const matchEn = ex.n.toLowerCase().includes(q);
        const matchTarget = ex.t && ex.t.toLowerCase().includes(q);
        const matchBody = ex.b && ex.b.toLowerCase().includes(q);
        return matchZh || matchEn || matchTarget || matchBody;
      });
    }

    if (selectedBodyPart !== 'all') {
      list = list.filter((ex) => ex.b.toLowerCase() === selectedBodyPart.toLowerCase());
    }

    if (selectedEquipment !== 'all') {
      list = list.filter((ex) => ex.eq.toLowerCase() === selectedEquipment.toLowerCase());
    }

    return list;
  }, [searchTerm, selectedBodyPart, selectedEquipment]);

  const paginatedList = filteredExercises.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedList.length < filteredExercises.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-28 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            动作百科指南
          </h1>
          <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            收录 1,300+ 个标准力量与健身动作，包含精准肌群定位与离线动画图解
          </p>
        </div>
        <div
          className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto border"
          style={{
            backgroundColor: `${theme.accentColor}15`,
            color: theme.accentColor,
            borderColor: `${theme.accentColor}30`,
          }}
        >
          已收录 {RAW_EXERCISES.length} 个动作
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div
        className={`p-5 rounded-3xl border space-y-4 shadow-xl transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="搜索动作中文名、英文名、肌群（如：卧推、深蹲、硬拉、腹肌、bench）..."
            className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none border transition-colors ${
              theme.isDark
                ? 'bg-white/[0.04] border-white/10 text-white placeholder-zinc-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Muscle / Body Part Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => {
              setSelectedBodyPart('all');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
              selectedBodyPart === 'all'
                ? 'text-slate-950 shadow-md'
                : theme.isDark
                ? 'bg-white/[0.03] text-zinc-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            style={selectedBodyPart === 'all' ? { backgroundColor: theme.accentColor } : {}}
          >
            全部部位 ({RAW_EXERCISES.length})
          </button>
          {Object.entries(BODY_PARTS_ZH).map(([key, label]) => {
            const isSelected = selectedBodyPart === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedBodyPart(key);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                  isSelected
                    ? 'text-slate-950 shadow-md'
                    : theme.isDark
                    ? 'bg-white/[0.03] text-zinc-400 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                style={isSelected ? { backgroundColor: theme.accentColor } : {}}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Equipment Selector */}
        <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
          <span>器械:</span>
          <select
            value={selectedEquipment}
            onChange={(e) => {
              setSelectedEquipment(e.target.value);
              setPage(1);
            }}
            className={`rounded-xl px-3 py-1 text-xs focus:outline-none border ${
              theme.isDark
                ? 'bg-white/[0.04] border-white/10 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="all">全部器械</option>
            {Object.entries(EQUIPMENT_ZH).map(([eqKey, eqLabel]) => (
              <option key={eqKey} value={eqKey} className={theme.isDark ? 'bg-zinc-900' : 'bg-white'}>
                {eqLabel}
              </option>
            ))}
          </select>

          <span className="ml-auto text-zinc-500 font-mono text-[11px]">
            筛选结果: {filteredExercises.length}
          </span>
        </div>
      </div>

      {/* Grid of Exercises */}
      {filteredExercises.length === 0 ? (
        <div
          className={`p-16 text-center rounded-3xl border ${
            theme.isDark ? 'bg-[#121218]/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <Dumbbell className="w-12 h-12 text-zinc-500 mx-auto mb-3 opacity-60" />
          <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            未找到相关动作
          </h3>
          <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            请尝试更换搜索词或重置筛选条件
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {paginatedList.map((ex) => {
            const hasPracticed = performedExerciseIds.has(ex.id);
            const mediaUrl = getExerciseMediaUrl(ex.img || ex.g);

            return (
              <div
                key={ex.id}
                onClick={() => onSelectExerciseToPreview(ex)}
                className={`group p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between gap-3 shadow-md ${
                  theme.isDark
                    ? 'bg-[#121218]/90 border-white/10 hover:border-white/25 hover:bg-[#161622]'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-slate-200/40 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div
                    className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 border flex items-center justify-center transition-colors ${
                      theme.isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    {mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt={ex.zh || ex.n}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Dumbbell className="w-6 h-6 text-zinc-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-bold text-sm truncate transition-colors ${
                          theme.isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {ex.zh || ex.n}
                      </h3>
                      {hasPracticed && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: theme.accentColor }}
                          title="曾练过"
                        />
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 truncate mt-0.5">{ex.n}</div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1 truncate">
                      <span>{getBodyPartName(ex.b)}</span>
                      <span>·</span>
                      <span>{getEquipmentName(ex.eq)}</span>
                      <span>·</span>
                      <span style={{ color: theme.accentColor }}>{getMuscleTargetName(ex.t)}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Load More */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={() => setPage((p) => p + 1)}
            className={`px-6 py-3 rounded-2xl text-xs font-bold border transition-colors ${
              theme.isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
            }`}
          >
            加载更多动作 ({filteredExercises.length - paginatedList.length} 个剩余)
          </button>
        </div>
      )}
    </div>
  );
};
