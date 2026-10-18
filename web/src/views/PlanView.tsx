import React, { useState } from 'react';
import { Calendar, Plus, Play, Edit3, Trash2, Dumbbell, Clock, Check, ChevronRight, X } from 'lucide-react';
import { RawExercise, WeekSchedule, WorkoutTemplate } from '../types/gym';
import { DAYS_ZH, SHORT_DAYS_ZH } from '../utils/translations';

interface PlanViewProps {
  schedule: WeekSchedule;
  templates: WorkoutTemplate[];
  onUpdateSchedule: (newSchedule: WeekSchedule) => void;
  onSaveTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onStartTemplateWorkout: (template: WorkoutTemplate) => void;
  onOpenExerciseSelector: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  schedule,
  templates,
  onUpdateSchedule,
  onSaveTemplate,
  onDeleteTemplate,
  onStartTemplateWorkout,
  onOpenExerciseSelector,
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
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">周计划与训练模板</h1>
          <p className="text-xs text-slate-400 mt-1">
            为一周 7 天编排训练日与休息日，首页将按当天排期自动载入
          </p>
        </div>
        <button
          onClick={handleStartCreateTemplate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>新建训练模板</span>
        </button>
      </div>

      {/* Weekly Schedule Section */}
      <div className="p-5 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">七天周期安排</h2>
          </div>
          <span className="text-xs text-slate-400">点击任意一天更换模板</span>
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
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-emerald-950/20 border-emerald-500/80 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${isToday ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {DAYS_ZH[dayIdx]}
                  </span>
                  {isToday && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md font-mono">
                      今天
                    </span>
                  )}
                </div>

                <div className="my-2">
                  {tpl ? (
                    <div>
                      <div className="font-bold text-xs text-white truncate">{tpl.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {tpl.exercises.length} 个动作
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 font-medium py-1">休息日 (Rest)</div>
                  )}
                </div>

                <div className="text-[11px] text-emerald-400/80 font-medium flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span>更换</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-emerald-400" />
          <span>训练模板库 ({templates.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{tpl.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {tpl.description || '精心安排的专项力量与形体雕刻'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTemplate({ ...tpl })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="编辑模板"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(tpl.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="删除模板"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Exercises in Template */}
                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  {tpl.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-900/60"
                    >
                      <span className="text-slate-300 truncate">{ex.exerciseZh || ex.exerciseName}</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {ex.defaultSets || 4} 组 · {ex.targetReps || 8} 次
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Workout Action */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">共 {tpl.exercises.length} 个动作</span>
                <button
                  onClick={() => onStartTemplateWorkout(tpl)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
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
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-700 rounded-2xl p-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                安排 {DAYS_ZH[assigningDayIndex]}
              </h3>
              <button
                onClick={() => setAssigningDayIndex(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              <button
                onClick={() => handleAssignDay(assigningDayIndex, null)}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                设为休息日 (Rest Day)
              </button>

              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleAssignDay(assigningDayIndex, tpl.id)}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{tpl.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {tpl.exercises.length} 个动作
                    </div>
                  </div>
                  {schedule[assigningDayIndex] === tpl.id && (
                    <Check className="w-4 h-4 text-emerald-400" />
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
          <div className="w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl p-5 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {isCreatingNew ? '新建训练模板' : '编辑训练模板'}
              </h3>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="text-xs text-slate-400 block mb-1">模板名称</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  placeholder="例如：推日 (Push Day)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">模板描述 / 训练重点</label>
                <input
                  type="text"
                  value={editingTemplate.description || ''}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, description: e.target.value })
                  }
                  placeholder="例如：胸大肌与肩部力量强化"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400">动作清单 ({editingTemplate.exercises.length})</label>
                  <button
                    onClick={onOpenExerciseSelector}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加动作</span>
                  </button>
                </div>

                {editingTemplate.exercises.length === 0 ? (
                  <div className="p-6 text-center rounded-xl bg-slate-900 border border-dashed border-slate-800 text-xs text-slate-500">
                    点击右上角“添加动作”从库中加入动作
                  </div>
                ) : (
                  <div className="space-y-2">
                    {editingTemplate.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                      >
                        <span className="text-slate-200 truncate">{ex.exerciseZh || ex.exerciseName}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = [...editingTemplate.exercises];
                              updated.splice(idx, 1);
                              setEditingTemplate({ ...editingTemplate, exercises: updated });
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400"
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

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editingTemplate.name.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs"
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
