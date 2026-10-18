import React, { useState } from 'react';
import { History, Calendar, Clock, Flame, Dumbbell, Trash2, ChevronDown, ChevronUp, Search, Plus, Award } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { formatDurationHuman, formatVolume } from '../utils/calculations';
import { getBodyPartName } from '../utils/translations';

interface HistoryViewProps {
  sessions: WorkoutSession[];
  onDeleteSession: (sessionId: string) => void;
  onStartEmptyWorkout: () => void;
  onSeedSampleData: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onDeleteSession,
  onStartEmptyWorkout,
  onSeedSampleData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSessionIds, setExpandedSessionIds] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSessionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSessions = sessions.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchTitle = s.title.toLowerCase().includes(q);
    const matchExercises = s.exercises.some(
      (e) =>
        e.exerciseName.toLowerCase().includes(q) ||
        (e.exerciseZh && e.exerciseZh.toLowerCase().includes(q))
    );
    return matchTitle || matchExercises;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">训练历史记录</h1>
          <p className="text-xs text-slate-400 mt-1">
            累计完成 {sessions.length} 次训练，记录只安全留存在本机浏览器
          </p>
        </div>

        {sessions.length === 0 && (
          <button
            onClick={onSeedSampleData}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
          >
            生成 8 周模拟训练数据
          </button>
        )}
      </div>

      {/* Search Input */}
      {sessions.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索历史训练或动作名称（如：推日、卧推、深蹲）..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      )}

      {/* History List */}
      {filteredSessions.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#0f172a] border border-slate-800">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">暂无历史训练记录</h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            完成一次训练后，数据将完整记录在此处，供随时复盘分析
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onStartEmptyWorkout}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              开启首次训练
            </button>
            <button
              onClick={onSeedSampleData}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              加载示例演示数据
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const isExpanded = expandedSessionIds.has(session.id);
            const dateObj = new Date(session.date);
            const dateStr = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
            const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

            return (
              <div
                key={session.id}
                className="rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden shadow-lg"
              >
                {/* Session Header / Card */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="p-4 sm:p-5 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white truncate">{session.title}</h3>
                      {session.newPrs && session.newPrs.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-600/30 px-2 py-0.5 rounded-md">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>{session.newPrs.length} PR</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {dateStr} {timeStr}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {formatDurationHuman(session.duration)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold tabular-nums">
                        <Flame className="w-3.5 h-3.5" />
                        {formatVolume(session.totalVolume)} kg
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-400">
                        {session.completedSets} 组
                      </span>
                    </div>

                    {/* Summary list of exercises */}
                    <div className="text-xs text-slate-500 truncate pt-1">
                      {session.exercises.map((e) => e.exerciseZh || e.exerciseName).join(' · ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(session.id);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="删除记录"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 bg-slate-900/40 space-y-4">
                    <div className="space-y-3 pt-3">
                      {session.exercises.map((ex, exIdx) => {
                        const completedSets = ex.sets.filter((s) => s.completed);

                        return (
                          <div
                            key={exIdx}
                            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-white">
                                {ex.exerciseZh || ex.exerciseName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {getBodyPartName(ex.bodyPart)} · 完成 {completedSets.length} 组
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {ex.sets.map((set, setIdx) => (
                                <div
                                  key={setIdx}
                                  className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between ${
                                    set.completed
                                      ? 'bg-slate-800/80 text-slate-200'
                                      : 'bg-slate-950/50 text-slate-600'
                                  }`}
                                >
                                  <span className="text-[10px] text-slate-500">
                                    第 {set.setNumber} 组
                                  </span>
                                  <span className="font-bold tabular-nums">
                                    {set.kg}kg × {set.reps}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-700 rounded-2xl p-5 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">确定删除这次训练吗？</h3>
            <p className="text-xs text-slate-400 mb-5">
              删除后历史容量与进度统计将重新计算，此操作不可撤销。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onDeleteSession(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
