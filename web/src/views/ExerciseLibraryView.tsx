import React, { useState, useMemo } from 'react';
import { Search, Dumbbell, Filter, Eye, ChevronRight, X, Play } from 'lucide-react';
import { RawExercise, WorkoutSession } from '../types/gym';
import { RAW_EXERCISES } from '../utils/storage';
import { BODY_PARTS_ZH, EQUIPMENT_ZH, getBodyPartName, getEquipmentName, getMuscleTargetName, getExerciseMediaUrl } from '../utils/translations';

interface ExerciseLibraryViewProps {
  onSelectExerciseToPreview: (exercise: RawExercise) => void;
  historySessions: WorkoutSession[];
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onSelectExerciseToPreview,
  historySessions,
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
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">动作百科指南</h1>
          <p className="text-xs text-slate-400 mt-1">
            收录 1,300+ 个标准力量与健身动作，包含精准肌群定位与离线动画图解
          </p>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          已收录 {RAW_EXERCISES.length} 个动作
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3.5 shadow-xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="搜索动作中文名、英文名、肌群（如：卧推、深蹲、硬拉、腹肌、bench）..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedBodyPart === 'all'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            全部部位 ({RAW_EXERCISES.length})
          </button>
          {Object.entries(BODY_PARTS_ZH).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedBodyPart(key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBodyPart === key
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Equipment Selector */}
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
          <span>器械:</span>
          <select
            value={selectedEquipment}
            onChange={(e) => {
              setSelectedEquipment(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">全部器械</option>
            {Object.entries(EQUIPMENT_ZH).map(([eqKey, eqLabel]) => (
              <option key={eqKey} value={eqKey}>
                {eqLabel}
              </option>
            ))}
          </select>

          <span className="ml-auto text-slate-500 font-mono text-[11px]">
            筛选结果: {filteredExercises.length}
          </span>
        </div>
      </div>

      {/* Grid of Exercises */}
      {filteredExercises.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#0f172a] border border-slate-800">
          <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">未找到相关动作</h3>
          <p className="text-xs text-slate-400 mt-1">请尝试更换搜索词或重置筛选条件</p>
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
                className="group p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                    {mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt={ex.zh || ex.n}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Dumbbell className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                        {ex.zh || ex.n}
                      </h3>
                      {hasPracticed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="曾练过" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">{ex.n}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 truncate">
                      <span>{getBodyPartName(ex.b)}</span>
                      <span>·</span>
                      <span>{getEquipmentName(ex.eq)}</span>
                      <span>·</span>
                      <span className="text-emerald-400/90">{getMuscleTargetName(ex.t)}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
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
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            加载更多动作 ({filteredExercises.length - paginatedList.length} 个剩余)
          </button>
        </div>
      )}
    </div>
  );
};
