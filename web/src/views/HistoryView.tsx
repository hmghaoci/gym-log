import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { WorkoutSession, WorkoutExercise, WorkoutSet } from '../types/gym';
import { formatVolume } from '../utils/calculations';
import { EXERCISE_MAP } from '../utils/storage';
import { getExerciseMediaUrl, getExerciseMediaFallbackUrl } from '../utils/translations';
import { ThemeConfig } from '../types/theme';

interface HistoryViewProps {
  sessions: WorkoutSession[];
  onDeleteSession: (sessionId: string) => void;
  onUpdateSession: (session: WorkoutSession) => void;
  onStartEmptyWorkout: () => void;
  onSeedSampleData: () => void;
  theme: ThemeConfig;
}

function dayKey(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function classifySession(session: WorkoutSession): { kind: string; tag: string } {
  const title = (session.title || '').toLowerCase();
  const zh = session.title || '';
  if (/推|push|胸|肩|三头/.test(zh) || /push|chest|shoulder/.test(title)) {
    return { kind: 'push', tag: '推' };
  }
  if (/拉|pull|背|二头/.test(zh) || /pull|back|bicep/.test(title)) {
    return { kind: 'pull', tag: '拉' };
  }
  if (/腿|leg|蹲/.test(zh) || /leg|squat/.test(title)) {
    return { kind: 'legs', tag: '腿' };
  }
  const parts = session.exercises.map((e) => (e.bodyPart || '').toLowerCase());
  if (parts.some((p) => p === 'chest' || p === 'shoulders')) return { kind: 'push', tag: '推' };
  if (parts.some((p) => p === 'back')) return { kind: 'pull', tag: '拉' };
  if (parts.some((p) => p.includes('leg'))) return { kind: 'legs', tag: '腿' };
  return { kind: 'other', tag: '练' };
}

function recomputeSession(session: WorkoutSession): WorkoutSession {
  let totalVolume = 0;
  let completedSets = 0;
  session.exercises.forEach((ex) => {
    ex.sets.forEach((s) => {
      if (s.completed) {
        totalVolume += (Number(s.kg) || 0) * (Number(s.reps) || 0);
        completedSets += 1;
      }
    });
  });
  return { ...session, totalVolume, completedSets };
}

function newSet(setNumber: number, kg = 20, reps = 8): WorkoutSet {
  return {
    id: `set-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    setNumber,
    type: 'normal',
    kg,
    reps,
    completed: true,
  };
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  onDeleteSession,
  onUpdateSession,
  onStartEmptyWorkout,
  onSeedSampleData,
  theme,
}) => {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState(dayKey(today));

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, WorkoutSession[]>();
    sessions.forEach((s) => {
      const key = dayKey(s.date);
      const list = map.get(key) || [];
      list.push(s);
      map.set(key, list);
    });
    return map;
  }, [sessions]);

  const selectedSessions = sessionsByDay.get(selectedKey) || [];
  const primary = selectedSessions[0];

  const calendarCells = useMemo(() => {
    const first = new Date(calYear, calMonth, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const prevDays = new Date(calYear, calMonth, 0).getDate();
    const cells: { key: string; day: number; out: boolean; tag?: string; kind?: string }[] = [];

    for (let i = 0; i < 42; i++) {
      let y = calYear;
      let m = calMonth;
      let d: number;
      let out = false;
      if (i < startOffset) {
        d = prevDays - startOffset + 1 + i;
        m = calMonth - 1;
        if (m < 0) {
          m = 11;
          y -= 1;
        }
        out = true;
      } else if (i >= startOffset + daysInMonth) {
        d = i - (startOffset + daysInMonth) + 1;
        m = calMonth + 1;
        if (m > 11) {
          m = 0;
          y += 1;
        }
        out = true;
      } else {
        d = i - startOffset + 1;
      }
      const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const daySessions = sessionsByDay.get(key);
      const tagInfo = daySessions?.[0] ? classifySession(daySessions[0]) : undefined;
      cells.push({
        key,
        day: d,
        out,
        tag: tagInfo?.tag,
        kind: tagInfo?.kind,
      });
    }
    return cells;
  }, [calYear, calMonth, sessionsByDay]);

  const todayKey = dayKey(today);

  const tagClass = (kind?: string) => {
    if (kind === 'push') return 'bg-sky-100 text-sky-700';
    if (kind === 'pull') return 'bg-violet-100 text-violet-700';
    if (kind === 'legs') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  const updatePrimary = (next: WorkoutSession) => {
    onUpdateSession(recomputeSession(next));
  };

  const patchExercise = (exIdx: number, patch: Partial<WorkoutExercise>) => {
    if (!primary) return;
    const exercises = primary.exercises.map((ex, i) => (i === exIdx ? { ...ex, ...patch } : ex));
    updatePrimary({ ...primary, exercises });
  };

  const patchSet = (exIdx: number, setIdx: number, patch: Partial<WorkoutSet>) => {
    if (!primary) return;
    const exercises = primary.exercises.map((ex, i) => {
      if (i !== exIdx) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s, j) => (j === setIdx ? { ...s, ...patch } : s)),
      };
    });
    updatePrimary({ ...primary, exercises });
  };

  const mediaFor = (ex: WorkoutExercise) => {
    const raw = EXERCISE_MAP.get(ex.exerciseId);
    return getExerciseMediaUrl(raw?.g || raw?.img);
  };
  const mediaFallbackFor = (ex: WorkoutExercise) => {
    const raw = EXERCISE_MAP.get(ex.exerciseId);
    return getExerciseMediaFallbackUrl(raw?.g || raw?.img);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-28 md:pb-16">
      <div>
        <h1 className={`text-2xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          历史
        </h1>
        <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          点某一天查看当天动作，可改重量、次数和组数
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className={`text-base font-black ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          {calYear}年{calMonth + 1}月
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              if (calMonth === 0) {
                setCalMonth(11);
                setCalYear((y) => y - 1);
              } else setCalMonth((m) => m - 1);
            }}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              theme.isDark ? 'border-white/10 text-zinc-300' : 'border-slate-200 text-slate-700 bg-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (calMonth === 11) {
                setCalMonth(0);
                setCalYear((y) => y + 1);
              } else setCalMonth((m) => m + 1);
            }}
            className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              theme.isDark ? 'border-white/10 text-zinc-300' : 'border-slate-200 text-slate-700 bg-white'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 text-[11px] font-bold text-slate-500">
        <span className={`px-2 py-0.5 rounded-full ${tagClass('push')}`}>推</span>
        <span className={`px-2 py-0.5 rounded-full ${tagClass('pull')}`}>拉</span>
        <span className={`px-2 py-0.5 rounded-full ${tagClass('legs')}`}>腿</span>
      </div>

      <div className={`grid grid-cols-7 gap-1 text-center text-[11px] font-bold ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
        {['一', '二', '三', '四', '五', '六', '日'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((cell) => {
          const selected = cell.key === selectedKey;
          const isToday = cell.key === todayKey;
          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => setSelectedKey(cell.key)}
              className={`min-h-[58px] rounded-2xl px-1 py-1.5 flex flex-col items-center gap-1 transition-all ${
                selected
                  ? theme.isDark
                    ? 'bg-white/10 ring-1'
                    : 'bg-slate-50 ring-1'
                  : ''
              } ${cell.out ? 'opacity-40' : ''}`}
              style={selected ? { boxShadow: `inset 0 0 0 1.5px ${theme.accentColor}` } : undefined}
            >
              <span
                className={`text-[13px] font-extrabold leading-none ${
                  isToday
                    ? 'w-5 h-5 rounded-full grid place-items-center text-slate-950'
                    : theme.isDark
                    ? 'text-white'
                    : 'text-slate-900'
                }`}
                style={isToday ? { backgroundColor: theme.accentColor } : undefined}
              >
                {cell.day}
              </span>
              {cell.tag ? (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${tagClass(cell.kind)}`}>
                  {cell.tag}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        className={`rounded-3xl border p-4 sm:p-5 space-y-3 ${
          theme.isDark ? 'bg-[#121218]/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {!primary ? (
          <div className="space-y-3">
            <h3 className={`font-black ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>这一天没练</h3>
            <p className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              {selectedKey.slice(5).replace('-', '月')}日 · 休息或未记录
            </p>
            <div className="flex gap-2">
              <button
                onClick={onStartEmptyWorkout}
                className="flex-1 py-3 rounded-2xl text-xs font-bold text-slate-950"
                style={{ backgroundColor: theme.accentColor }}
              >
                现在开练
              </button>
              {sessions.length === 0 ? (
                <button
                  onClick={onSeedSampleData}
                  className={`flex-1 py-3 rounded-2xl text-xs font-semibold border ${
                    theme.isDark ? 'border-white/10 text-zinc-300' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  加载示例
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className={`font-black text-base ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                  {primary.title}
                </h3>
                <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {selectedKey.slice(5).replace('-', '月')}日 · {primary.completedSets} 组 ·{' '}
                  {formatVolume(primary.totalVolume)} kg
                </p>
              </div>
              <button
                onClick={() => onDeleteSession(primary.id)}
                className="text-[11px] font-bold text-rose-500"
              >
                删除
              </button>
            </div>

            {primary.exercises.map((ex, ei) => {
              const media = mediaFor(ex);
              return (
                <div
                  key={`${ex.exerciseId}-${ei}`}
                  className={`pt-3 border-t space-y-2 ${theme.isDark ? 'border-white/10' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 ${
                        theme.isDark ? 'bg-black/40' : 'bg-slate-900'
                      }`}
                    >
                      {media ? (
                        <img
                          src={media}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const fb = mediaFallbackFor(ex);
                            if (fb && e.currentTarget.dataset.fallback !== '1') {
                              e.currentTarget.dataset.fallback = '1';
                              e.currentTarget.src = fb;
                            }
                          }}
                        />
                      ) : null}
                    </div>
                    <input
                      value={ex.exerciseZh || ex.exerciseName}
                      onChange={(e) =>
                        patchExercise(ei, {
                          exerciseZh: e.target.value,
                          exerciseName: e.target.value,
                        })
                      }
                      className={`flex-1 min-w-0 bg-transparent font-extrabold text-sm focus:outline-none ${
                        theme.isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => {
                        const exercises = primary.exercises.filter((_, i) => i !== ei);
                        if (!exercises.length) onDeleteSession(primary.id);
                        else updatePrimary({ ...primary, exercises });
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        theme.isDark ? 'bg-white/10 text-zinc-400' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className={`grid grid-cols-[1.4rem_1fr_1fr_1.75rem] gap-1.5 text-[11px] font-bold ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                    <span />
                    <span className="text-center">kg</span>
                    <span className="text-center">次数</span>
                    <span />
                  </div>

                  {ex.sets.map((set, si) => (
                    <div key={set.id} className="grid grid-cols-[1.4rem_1fr_1fr_1.75rem] gap-1.5 items-center">
                      <span className={`text-xs font-bold ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        {si + 1}
                      </span>
                      <input
                        inputMode="decimal"
                        value={set.kg}
                        onChange={(e) => patchSet(ei, si, { kg: Number(e.target.value) || 0 })}
                        className={`text-center text-xs font-bold rounded-xl border py-2 focus:outline-none ${
                          theme.isDark
                            ? 'bg-white/[0.04] border-white/10 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                      <input
                        inputMode="numeric"
                        value={set.reps}
                        onChange={(e) => patchSet(ei, si, { reps: Number(e.target.value) || 0 })}
                        className={`text-center text-xs font-bold rounded-xl border py-2 focus:outline-none ${
                          theme.isDark
                            ? 'bg-white/[0.04] border-white/10 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                      <button
                        onClick={() => {
                          const sets = ex.sets.filter((_, j) => j !== si).map((s, j) => ({ ...s, setNumber: j + 1 }));
                          patchExercise(ei, { sets });
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          theme.isDark ? 'bg-white/10 text-zinc-400' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const last = ex.sets[ex.sets.length - 1];
                      patchExercise(ei, {
                        sets: [...ex.sets, newSet(ex.sets.length + 1, last?.kg ?? 20, last?.reps ?? 8)],
                      });
                    }}
                    className="text-xs font-extrabold"
                    style={{ color: theme.accentColor }}
                  >
                    + 加一组
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => {
                const exercise: WorkoutExercise = {
                  exerciseId: `custom-${Date.now()}`,
                  exerciseName: '新动作',
                  exerciseZh: '新动作',
                  bodyPart: 'chest',
                  sets: [newSet(1)],
                };
                updatePrimary({ ...primary, exercises: [...primary.exercises, exercise] });
              }}
              className={`w-full mt-1 py-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-1 ${
                theme.isDark
                  ? 'border-white/10 text-zinc-200 bg-white/[0.03]'
                  : 'border-slate-200 text-slate-800 bg-slate-50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              添加动作
            </button>
          </>
        )}
      </div>
    </div>
  );
};
