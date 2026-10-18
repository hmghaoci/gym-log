import React, { useState } from 'react';
import { History, Calendar, Clock, Flame, Dumbbell, Trash2, ChevronDown, ChevronUp, Search, Plus, Award } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { formatDurationHuman, formatVolume } from '../utils/calculations';
import { getBodyPartName } from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface HistoryViewProps {
  sessions: WorkoutSession[];
  onDeleteSession: (sessionId: string) => void;
  onStartEmptyWorkout: () => void;
  onSeedSampleData: () => void;
  theme: ThemeConfig;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onDeleteSession,
  onStartEmptyWorkout,
  onSeedSampleData,
  theme,
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
    <div className="space-y-6 max-w-4xl mx-auto pb-28 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            训练历史记录
          </h1>
          <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            累计完成 {sessions.length} 次训练，记录只安全留存在本机浏览器
          </p>
        </div>

        {sessions.length === 0 && (
          <button
            onClick={onSeedSampleData}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors self-start sm:self-auto ${
              theme.isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border-white/10'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            生成 8 周模拟训练数据
          </button>
        )}
      </div>

      {/* Search Input */}
      {sessions.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索历史训练或动作名称（如：推日、卧推、深蹲）..."
            className={`w-full pl-10 pr-4 py-3 rounded-2xl text-xs focus:outline-none border transition-colors ${
              theme.isDark
                ? 'bg-[#121218]/90 border-white/10 text-white placeholder-zinc-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
            }`}
          />
        </div>
      )}

      {/* History List */}
      {filteredSessions.length === 0 ? (
        <div
          className={`p-16 text-center rounded-3xl border ${
            theme.isDark ? 'bg-[#121218]/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <History className="w-12 h-12 mx-auto mb-3 text-zinc-500 opacity-60" />
          <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            暂无历史训练记录
          </h3>
          <p className={`text-xs mt-1 mb-5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            完成一次训练后，数据将完整记录在此处，供随时复盘分析
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onStartEmptyWorkout}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: theme.accentColor }}
            >
              开启首次训练
            </button>
            <button
              onClick={onSeedSampleData}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                theme.isDark
                  ? 'bg-white/[0.04] text-zinc-300 border-white/10'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
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
                className={`rounded-3xl border transition-all overflow-hidden ${
                  theme.isDark
                    ? 'bg-[#121218]/90 border-white/10 hover:border-white/20'
                    : 'bg-white border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-slate-300'
                }`}
              >
                {/* Session Header / Card */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="p-5 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-black text-base truncate ${
                          theme.isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {session.title}
                      </h3>
                      {session.newPrs && session.newPrs.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>{session.newPrs.length} PR</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {dateStr} {timeStr}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {formatDurationHuman(session.duration)}
                      </span>
                      <span>·</span>
                      <span
                        className="flex items-center gap-1 font-mono font-bold tabular-nums"
                        style={{ color: theme.accentColor }}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        {formatVolume(session.totalVolume)} kg
                      </span>
                      <span>·</span>
                      <span className="font-mono">
                        {session.completedSets} 组
                      </span>
                    </div>

                    {/* Summary list of exercises */}
                    <div className={`text-xs truncate pt-1 ${theme.isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      {session.exercises.map((e) => e.exerciseZh || e.exerciseName).join(' · ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(session.id);
                      }}
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="删除记录"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    className={`p-5 pt-0 border-t space-y-4 ${
                      theme.isDark
                        ? 'bg-white/[0.015] border-white/[0.07]'
                        : 'bg-slate-50/70 border-slate-100'
                    }`}
                  >
                    <div className="space-y-3 pt-3">
                      {session.exercises.map((ex, exIdx) => {
                        const completedSets = ex.sets.filter((s) => s.completed);

                        return (
                          <div
                            key={exIdx}
                            className={`p-4 rounded-2xl border ${
                              theme.isDark
                                ? 'bg-white/[0.02] border-white/5'
                                : 'bg-white border-slate-200/80 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`font-bold text-xs ${
                                  theme.isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {ex.exerciseZh || ex.exerciseName}
                              </span>
                              <span
                                className={`text-[11px] ${
                                  theme.isDark ? 'text-zinc-500' : 'text-slate-400'
                                }`}
                              >
                                {getBodyPartName(ex.bodyPart)} · 完成 {completedSets.length} 组
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {ex.sets.map((set, setIdx) => (
                                <div
                                  key={setIdx}
                                  className={`p-2.5 rounded-xl text-xs font-mono flex items-center justify-between border ${
                                    set.completed
                                      ? theme.isDark
                                        ? 'bg-white/[0.04] border-white/10 text-white'
                                        : 'bg-slate-100 border-slate-200 text-slate-800'
                                      : 'opacity-40'
                                  }`}
                                >
                                  <span className="text-[10px] text-zinc-500">
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
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
              theme.isDark ? 'bg-[#121218] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="text-base font-bold mb-2">确定删除这次训练吗？</h3>
            <p className={`text-xs mb-5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              删除后历史容量与进度统计将重新计算，此操作不可撤销。
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium ${
                  theme.isDark ? 'bg-white/10 hover:bg-white/15 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                取消
              </button>
              <button
                onClick={() => {
                  onDeleteSession(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
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
