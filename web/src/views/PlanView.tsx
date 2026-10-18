import React, { useState } from 'react';
import { Calendar, Plus, Play, Edit3, Trash2, Dumbbell, Clock, Check, ChevronRight, X } from 'lucide-react';
import { RawExercise, WeekSchedule, WorkoutTemplate } from '../types/gym';
import { DAYS_ZH, SHORT_DAYS_ZH } from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface PlanViewProps {
  schedule: WeekSchedule;
  templates: WorkoutTemplate[];
  onUpdateSchedule: (newSchedule: WeekSchedule) => void;
  onSaveTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onStartTemplateWorkout: (template: WorkoutTemplate) => void;
  onOpenExerciseSelector: () => void;
  theme: ThemeConfig;
}

export const PlanView: React.FC<PlanViewProps> = ({
  schedule,
  templates,
  onUpdateSchedule,
  onSaveTemplate,
  onDeleteTemplate,
  onStartTemplateWorkout,
  onOpenExerciseSelector,
  theme,
}) => {
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [assigningDayIndex, setAssigningDayIndex] = useState<number | null>(null);

  // Handle assigning a template to a day of the week
  const handleAssignDay = (dayIndex: number, templateId: string | null) => {
    onUpdateSchedule({
      ...schedule,
      [dayIndex]: templateId,
    });
    setAssigningDayIndex(null);
  };

  // Start new template
  const handleStartCreateTemplate = () => {
    setEditingTemplate({
      id: `tpl-${Date.now()}`,
      name: '',
      description: '',
      exercises: [],
    });
    setIsCreatingNew(true);
  };

  // Save template edit
  const handleSaveEdit = () => {
    if (!editingTemplate || !editingTemplate.name.trim()) return;
    onSaveTemplate(editingTemplate);
    setEditingTemplate(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-28 md:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
            周计划与训练模板
          </h1>
          <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            为一周 7 天编排训练日与休息日，首页将按当天排期自动载入
          </p>
        </div>
        <button
          onClick={handleStartCreateTemplate}
          className="flex items-center gap-1.5 px-5 py-3 rounded-2xl text-slate-950 font-bold text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
          style={{ backgroundColor: theme.accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>新建训练模板</span>
        </button>
      </div>

      {/* Weekly Schedule Section */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 shadow-xl ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: theme.accentColor }} />
            <h2 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              七天周期安排
            </h2>
          </div>
          <span className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            点击任意一天更换模板
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
            const tplId = schedule[dayIdx];
            const tpl = templates.find((t) => t.id === tplId);
            const isToday = new Date().getDay() === dayIdx;

            return (
              <div
                key={dayIdx}
                onClick={() => setAssigningDayIndex(dayIdx)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isToday
                    ? theme.isDark
                      ? 'bg-white/10 border-white/30 text-white shadow-md'
                      : 'bg-white text-slate-900 shadow-md ring-2 ring-sky-500/25'
                    : theme.isDark
                    ? 'bg-white/[0.02] border-white/5 hover:border-white/15'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
                style={
                  isToday
                    ? {
                        borderTop: `3px solid ${theme.accentColor}`,
                        borderColor: !theme.isDark ? `${theme.accentColor}50` : undefined,
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold ${
                      theme.isDark ? 'text-zinc-300' : 'text-slate-800'
                    }`}
                  >
                    {DAYS_ZH[dayIdx]}
                  </span>
                  {isToday && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold"
                      style={{
                        backgroundColor: `${theme.accentColor}20`,
                        color: theme.accentColor,
                      }}
                    >
                      今天
                    </span>
                  )}
                </div>

                <div className="my-2">
                  {tpl ? (
                    <div>
                      <div
                        className={`font-bold text-xs truncate ${
                          theme.isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {tpl.name.replace(/\s*\([a-zA-Z\s]+\)/g, '')}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          theme.isDark ? 'text-zinc-400' : 'text-slate-500'
                        }`}
                      >
                        {tpl.exercises.length} 个动作
                      </div>
                    </div>
                  ) : (
                    <div className={`text-xs font-medium py-1 ${theme.isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      休息日
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-medium flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span style={{ color: theme.accentColor }}>更换</span>
                  <ChevronRight className="w-3 h-3 text-zinc-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        <h2 className={`text-base font-bold flex items-center gap-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          <Dumbbell className="w-4 h-4" style={{ color: theme.accentColor }} />
          <span>训练模板库 ({templates.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-lg ${
                theme.isDark
                  ? 'bg-[#121218]/90 border-white/10 hover:border-white/20'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-slate-200/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                      {tpl.name}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      {tpl.description || '精心安排的专项力量与形体雕刻'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTemplate({ ...tpl })}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                      title="编辑模板"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(tpl.id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="删除模板"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Exercises in Template */}
                <div className="space-y-1.5 mt-3 pt-3 border-t border-white/[0.07]">
                  {tpl.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-xs py-1.5 px-3 rounded-xl border ${
                        theme.isDark
                          ? 'bg-white/[0.02] border-white/5 text-zinc-300'
                          : 'bg-slate-50 border-slate-200/60 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{ex.exerciseZh || ex.exerciseName}</span>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        {ex.defaultSets || 4} 组 · {ex.targetReps || 8} 次
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Workout Action */}
              <div className="pt-4 mt-4 border-t border-white/[0.07] flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">共 {tpl.exercises.length} 个动作</span>
                <button
                  onClick={() => onStartTemplateWorkout(tpl)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 shadow-md transition-all hover:scale-105"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>使用此模板开练</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Assignment Drawer / Modal */}
      {assigningDayIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
              theme.isDark ? 'bg-[#121218] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">
                安排 {DAYS_ZH[assigningDayIndex]}
              </h3>
              <button
                onClick={() => setAssigningDayIndex(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              <button
                onClick={() => handleAssignDay(assigningDayIndex, null)}
                className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-colors ${
                  theme.isDark
                    ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 text-zinc-400'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                设为休息日 (Rest Day)
              </button>

              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleAssignDay(assigningDayIndex, tpl.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-colors flex items-center justify-between ${
                    theme.isDark
                      ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{tpl.name}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {tpl.exercises.length} 个动作
                    </div>
                  </div>
                  {schedule[assigningDayIndex] === tpl.id && (
                    <Check className="w-4 h-4" style={{ color: theme.accentColor }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col border ${
              theme.isDark ? 'bg-[#121218] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold">
                {isCreatingNew ? '新建训练模板' : '编辑训练模板'}
              </h3>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">模板名称</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  placeholder="例如：推日 (Push Day)"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none border ${
                    theme.isDark ? 'bg-white/[0.04] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">模板描述 / 训练重点</label>
                <input
                  type="text"
                  value={editingTemplate.description || ''}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, description: e.target.value })
                  }
                  placeholder="例如：胸大肌与肩部力量强化"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none border ${
                    theme.isDark ? 'bg-white/[0.04] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-zinc-400">动作清单 ({editingTemplate.exercises.length})</label>
                  <button
                    onClick={onOpenExerciseSelector}
                    className="text-xs font-semibold flex items-center gap-1 hover:underline"
                    style={{ color: theme.accentColor }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加动作</span>
                  </button>
                </div>

                {editingTemplate.exercises.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-white/10 text-xs text-zinc-500">
                    点击右上角“添加动作”从库中加入动作
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editingTemplate.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                          theme.isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className="truncate">{ex.exerciseZh || ex.exerciseName}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = [...editingTemplate.exercises];
                              updated.splice(idx, 1);
                              setEditingTemplate({ ...editingTemplate, exercises: updated });
                            }}
                            className="p-1 text-zinc-400 hover:text-rose-400"
                            title="拿掉此动作"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <button
                onClick={() => setEditingTemplate(null)}
                className={`px-4 py-2 rounded-xl text-xs ${
                  theme.isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editingTemplate.name.trim()}
                className="px-5 py-2 rounded-xl font-bold text-xs text-slate-950 disabled:opacity-50"
                style={{ backgroundColor: theme.accentColor }}
              >
                保存模板
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
