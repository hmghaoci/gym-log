import React, { useState, useMemo } from 'react';
import { Search, X, Check, Dumbbell, Filter, Eye } from 'lucide-react';
import { RawExercise } from '../types/gym';
import { RAW_EXERCISES } from '../utils/storage';
import { BODY_PARTS_ZH, EQUIPMENT_ZH, getBodyPartName, getEquipmentName, getMuscleTargetName, getExerciseMediaUrl, getExerciseMediaFallbackUrl } from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: RawExercise) => void;
  onPreviewExercise?: (exercise: RawExercise) => void;
  alreadySelectedIds?: string[];
  theme: ThemeConfig;
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  onPreviewExercise,
  alreadySelectedIds = [],
  theme,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl max-h-[92vh] flex flex-col overflow-hidden transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 sm:p-6 border-b ${
            theme.isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h2 className="text-lg font-bold tracking-tight">选择训练动作</h2>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  theme.isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                从 1,300+ 个标准力量动作中筛选加入训练
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors ${
                theme.isDark
                  ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="搜索动作中文名、英文名、肌群（如：卧推、胸、bench）..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none border transition-colors ${
                theme.isDark
                  ? 'bg-white/[0.04] border-white/10 text-white placeholder-zinc-500 focus:border-white/30'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
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
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                selectedBodyPart === 'all'
                  ? 'text-slate-950 shadow-sm'
                  : theme.isDark
                  ? 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={
                selectedBodyPart === 'all'
                  ? { backgroundColor: theme.accentColor }
                  : undefined
              }
            >
              全部部位
            </button>
            {Object.entries(BODY_PARTS_ZH).map(([key, label]) => {
              const isActive = selectedBodyPart.toLowerCase() === key.toLowerCase();
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedBodyPart(key);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold ${
                    isActive
                      ? 'text-slate-950 shadow-sm'
                      : theme.isDark
                      ? 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: theme.accentColor }
                      : undefined
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercises Grid List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-2">
          {paginatedExercises.length === 0 ? (
            <div className="py-16 text-center">
              <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: theme.accentColor }} />
              <p className={`text-sm ${theme.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>未找到匹配的动作</p>
              <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                尝试更换关键词或部位筛选条件
              </p>
            </div>
          ) : (
            paginatedExercises.map((ex) => {
              const isSelected = alreadySelectedIds.includes(ex.id);
              const jpgUrl = getExerciseMediaUrl(ex.img);

              return (
                <div
                  key={ex.id}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                    isSelected
                      ? theme.isDark
                        ? 'bg-white/[0.06] border-white/20'
                        : 'bg-slate-100 border-slate-300'
                      : theme.isDark
                      ? 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden ${
                        theme.isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'
                      }`}
                    >
                      {jpgUrl ? (
                        <img
                          src={jpgUrl}
                          alt={ex.zh || ex.n}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const fb = getExerciseMediaFallbackUrl(ex.img)
                            if (fb && e.currentTarget.dataset.fallback !== '1') {
                              e.currentTarget.dataset.fallback = '1'
                              e.currentTarget.src = fb
                            }
                          }}
                        />
                      ) : (
                        <Dumbbell className="w-5 h-5 opacity-40" style={{ color: theme.accentColor }} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-sm font-bold truncate ${
                          theme.isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {ex.zh || ex.n}
                        </span>
                        {isSelected && (
                          <span
                            className="text-[10px] px-1.5 py-0.2 rounded font-semibold font-mono"
                            style={{
                              backgroundColor: `${theme.accentColor}25`,
                              color: theme.accentColor,
                            }}
                          >
                            已在本次训练
                          </span>
                        )}
                      </div>
                      <div className={`text-xs truncate mt-0.5 ${
                        theme.isDark ? 'text-zinc-400' : 'text-slate-500'
                      }`}>
                        <span>{getBodyPartName(ex.b)}</span>
                        <span> · </span>
                        <span>{getEquipmentName(ex.eq)}</span>
                        <span> · </span>
                        <span style={{ color: theme.accentColor }}>{getMuscleTargetName(ex.t)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {onPreviewExercise && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewExercise(ex);
                        }}
                        className={`p-2 rounded-xl transition-colors ${
                          theme.isDark
                            ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                            : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                        }`}
                        title="查看动作要领图解"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onSelectExercise(ex);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl font-bold text-xs text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                      style={{
                        backgroundColor: theme.accentColor,
                        boxShadow: `0 4px 12px ${theme.accentColor}30`,
                      }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>选择</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {hasMore && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                  theme.isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                加载更多动作...
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-between text-xs ${
            theme.isDark ? 'border-white/[0.08] bg-white/[0.02] text-zinc-400' : 'border-slate-100 bg-slate-50/70 text-slate-500'
          }`}
        >
          <span>匹配结果: {filteredExercises.length} 个动作</span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              theme.isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
