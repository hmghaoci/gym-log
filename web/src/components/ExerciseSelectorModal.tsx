import React, { useState, useMemo } from 'react';
import { Search, X, Check, Dumbbell, Filter, Eye } from 'lucide-react';
import { RawExercise } from '../types/gym';
import { RAW_EXERCISES } from '../utils/storage';
import { BODY_PARTS_ZH, EQUIPMENT_ZH, getBodyPartName, getEquipmentName, getMuscleTargetName, getExerciseMediaUrl } from '../utils/translations';

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: RawExercise) => void;
  onPreviewExercise?: (exercise: RawExercise) => void;
  alreadySelectedIds?: string[];
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  onPreviewExercise,
  alreadySelectedIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 30;

  const filteredExercises = useMemo(() => {
    let list = RAW_EXERCISES;

    // Search query
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

    // Body Part Filter
    if (selectedBodyPart !== 'all') {
      list = list.filter((ex) => ex.b.toLowerCase() === selectedBodyPart.toLowerCase());
    }

    // Equipment Filter
    if (selectedEquipment !== 'all') {
      list = list.filter((ex) => ex.eq.toLowerCase() === selectedEquipment.toLowerCase());
    }

    return list;
  }, [searchTerm, selectedBodyPart, selectedEquipment]);

  if (!isOpen) return null;

  const paginatedExercises = filteredExercises.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedExercises.length < filteredExercises.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-white">选择动作</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                包含 1,300+ 个专业动作，带图解指南与部位分类
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="搜索动作中文名、英文名、肌群（如：卧推、胸、bench）..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Segmented Filter: Body Parts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              onClick={() => {
                setSelectedBodyPart('all');
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
                selectedBodyPart === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              全部部位
            </button>
            {Object.entries(BODY_PARTS_ZH).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedBodyPart(key);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
                  selectedBodyPart === key
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {paginatedExercises.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Dumbbell className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="text-sm">未找到匹配的动作</p>
              <p className="text-xs text-slate-500 mt-1">请尝试更换关键词或清除筛选</p>
            </div>
          ) : (
            paginatedExercises.map((ex) => {
              const isAlreadyAdded = alreadySelectedIds.includes(ex.id);
              const previewImg = getExerciseMediaUrl(ex.img || ex.g);

              return (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all gap-3"
                >
                  {/* Left: Thumbnail + Title & metadata */}
                  <div
                    onClick={() => {
                      onSelectExercise(ex);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-700/50">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt={ex.zh || ex.n}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">
                          {ex.zh || ex.n}
                        </span>
                        {isAlreadyAdded && (
                          <span className="text-[10px] text-emerald-400 font-mono">已在列表中</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
                        <span className="truncate">{ex.n}</span>
                        <span>·</span>
                        <span>{getBodyPartName(ex.b)}</span>
                        <span>·</span>
                        <span className="text-emerald-400/90">{getMuscleTargetName(ex.t)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Preview Details & Add */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {onPreviewExercise && (
                      <button
                        onClick={() => onPreviewExercise(ex)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors"
                        title="查看动作要领与动画"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onSelectExercise(ex);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-sm transition-colors whitespace-nowrap"
                    >
                      选择
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {hasMore && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                加载更多动作 ({filteredExercises.length - paginatedExercises.length} 个剩余)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
