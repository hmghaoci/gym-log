import React, { useRef, useState } from 'react';
import { Settings, Volume2, Smartphone, Clock, Download, Upload, Trash2, Sparkles, Check, Info, ShieldCheck, Heart, Palette } from 'lucide-react';
import { UserSettings, WorkoutSession, WorkoutTemplate, WeekSchedule } from '../types/gym';
import { playRestCompleteSound } from '../utils/audio';
import { THEMES, ThemeConfig, ThemeStyle } from '../types/theme';
import { APP_VERSION, checkUpdate } from '../utils/update';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onExportData: () => void;
  onImportData: (file: File) => Promise<boolean>;
  onSeedSampleData: () => void;
  onClearAllData: () => void;
  theme: ThemeConfig;
  currentTheme: ThemeStyle;
  onSelectTheme: (theme: ThemeStyle) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onSeedSampleData,
  onClearAllData,
  theme,
  currentTheme,
  onSelectTheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSeedSuccess, setShowSeedSuccess] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  const handleTestSound = () => {
    playRestCompleteSound();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const ok = await onImportData(file);
      if (ok) {
        setImportStatus('导入成功！所有记录已恢复');
      } else {
        setImportStatus('导入失败：文件格式不正确');
      }
    } catch {
      setImportStatus('导入发生错误');
    }

    setTimeout(() => setImportStatus(null), 3000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerSeed = () => {
    onSeedSampleData();
    setShowSeedSuccess(true);
    setTimeout(() => setShowSeedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-28 md:pb-16">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-black tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          应用设置与偏好
        </h1>
        <p className={`text-xs mt-1 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          个性化主题视觉、休息计时器与离线数据备份
        </p>
      </div>

      {/* Theme Selection Section (Right in Settings!) */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" style={{ color: theme.accentColor }} />
            <h2 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              界面主题风格 (4款精选美学)
            </h2>
          </div>
          <span className="text-xs font-semibold" style={{ color: theme.accentColor }}>
            当前: {theme.name.split(' ')[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {(Object.keys(THEMES) as ThemeStyle[]).map((key) => {
            const t = THEMES[key];
            const isSelected = currentTheme === key;

            return (
              <button
                key={key}
                onClick={() => onSelectTheme(key)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-white/40 ring-2 shadow-lg'
                    : 'border-white/10 hover:border-white/20'
                }`}
                style={{
                  backgroundColor: t.isDark ? t.bgSurface : '#ffffff',
                  borderColor: isSelected ? t.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 15px ${t.accentColor}30` : undefined,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        t.isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {t.name}
                    </span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: t.accentColor }}
                    />
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed line-clamp-2 ${
                      t.isDark ? 'text-zinc-400' : 'text-slate-500'
                    }`}
                  >
                    {t.description}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono ${
                      t.isDark ? 'text-zinc-500' : 'text-slate-400'
                    }`}
                  >
                    {t.isDark ? '深色氛围' : '极简明亮'}
                  </span>
                  {isSelected && (
                    <span
                      className="text-[11px] font-bold flex items-center gap-1"
                      style={{ color: t.accentColor }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      已启用
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rest Timer Settings */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-5 transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <h2 className={`text-sm font-bold flex items-center gap-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          <Clock className="w-4 h-4" style={{ color: theme.accentColor }} />
          <span>组间休息计时器设置</span>
        </h2>

        {/* Default duration options */}
        <div>
          <label className={`text-xs block mb-2 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            默认休息时长
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[30, 60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => onUpdateSettings({ ...settings, defaultRestSeconds: sec })}
                className={`py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
                  settings.defaultRestSeconds === sec
                    ? 'text-slate-950 shadow-md'
                    : theme.isDark
                    ? 'bg-white/[0.03] border border-white/5 text-zinc-300 hover:text-white'
                    : 'bg-slate-100 border border-slate-200 text-slate-700'
                }`}
                style={
                  settings.defaultRestSeconds === sec
                    ? { backgroundColor: theme.accentColor }
                    : {}
                }
              >
                {sec}秒
              </button>
            ))}
          </div>
        </div>

        {/* Auto start rest toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
          <div>
            <div className={`text-xs font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              完成组数后自动开启休息计时
            </div>
            <div className={`text-[11px] mt-0.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              点击打勾完成某一组时，立即启动浮动倒计时
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateSettings({ ...settings, autoStartRest: !settings.autoStartRest })
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.autoStartRest ? '' : 'bg-zinc-700'
            }`}
            style={settings.autoStartRest ? { backgroundColor: theme.accentColor } : {}}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                settings.autoStartRest ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Sound toggle & Test */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
          <div>
            <div className={`text-xs font-bold flex items-center gap-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>休息结束提示音 (Web Audio)</span>
            </div>
            <div className={`text-[11px] mt-0.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              倒计时归零时播放清脆悦耳的双音和弦提示
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSound}
              className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                theme.isDark
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              试听
            </button>
            <button
              onClick={() =>
                onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.soundEnabled ? '' : 'bg-zinc-700'
              }`}
              style={settings.soundEnabled ? { backgroundColor: theme.accentColor } : {}}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.soundEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Vibration toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
          <div>
            <div className={`text-xs font-bold flex items-center gap-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
              <span>手机震动反馈</span>
            </div>
            <div className={`text-[11px] mt-0.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              移动端浏览器支持振动时提供触觉反馈
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateSettings({ ...settings, vibrateEnabled: !settings.vibrateEnabled })
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.vibrateEnabled ? '' : 'bg-zinc-700'
            }`}
            style={settings.vibrateEnabled ? { backgroundColor: theme.accentColor } : {}}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                settings.vibrateEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 transition-all duration-300 ${
          theme.isDark
            ? 'bg-[#121218]/90 border-white/10'
            : 'bg-white border-slate-200/90 shadow-slate-200/60'
        }`}
      >
        <h2 className={`text-sm font-bold flex items-center gap-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          <ShieldCheck className="w-4 h-4" style={{ color: theme.accentColor }} />
          <span>本地数据安全与备份</span>
        </h2>
        <p className={`text-xs ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          所有健身训练记录严格保存在你的本地浏览器中，绝不上传第三方服务器，保护你的隐私。当前版本 {APP_VERSION}。
        </p>
        <button
          onClick={async () => {
            setCheckingUpdate(true)
            setUpdateStatus('正在检查更新…')
            try {
              setUpdateStatus(await checkUpdate())
            } catch (err) {
              setUpdateStatus(`检查更新失败${err instanceof Error ? ` (${err.message})` : ''}`)
            } finally {
              setCheckingUpdate(false)
            }
          }}
          disabled={checkingUpdate}
          className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-colors disabled:opacity-60 ${
            theme.isDark
              ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
          }`}
        >
          <span>{checkingUpdate ? '检查中…' : '检查更新'}</span>
        </button>
        {updateStatus && (
          <div
            className={`p-3 rounded-xl border text-xs text-center font-medium ${
              theme.isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
            style={{ color: theme.accentColor }}
          >
            {updateStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onExportData}
            className={`flex items-center justify-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-colors ${
              theme.isDark
                ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" style={{ color: theme.accentColor }} />
            <span>导出训练记录备份 (.json)</span>
          </button>

          <label
            className={`flex items-center justify-center gap-2 p-4 rounded-2xl border text-xs font-bold transition-colors cursor-pointer ${
              theme.isDark
                ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" style={{ color: theme.accentColor }} />
            <span>从备份文件导入记录</span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div
            className="p-3.5 rounded-2xl text-xs text-center font-bold border"
            style={{
              backgroundColor: `${theme.accentColor}15`,
              color: theme.accentColor,
              borderColor: `${theme.accentColor}30`,
            }}
          >
            {importStatus}
          </div>
        )}

        {/* Demo Seed Data */}
        <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between">
          <div>
            <div className={`text-xs font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              加载 8 周示例演示数据
            </div>
            <div className={`text-[11px] mt-0.5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              立即填充推日、拉日、腿日完整记录，体验热力图与 1RM 统计
            </div>
          </div>
          <button
            onClick={handleTriggerSeed}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors whitespace-nowrap ${
              theme.isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
            style={{ color: theme.accentColor }}
          >
            {showSeedSuccess ? '已加载！' : '生成数据'}
          </button>
        </div>

        {/* Clear Data */}
        <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-500">清空本机所有记录</div>
            <div className={`text-[11px] mt-0.5 ${theme.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
              重置历史训练、计划排期与自定义模板
            </div>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors"
          >
            清空重置
          </button>
        </div>
      </div>

      {/* Credits & Open Source Info */}
      <div
        className={`p-5 rounded-3xl border text-xs space-y-2 ${
          theme.isDark
            ? 'bg-white/[0.02] border-white/5 text-zinc-400'
            : 'bg-slate-100/80 border-slate-200 text-slate-600'
        }`}
      >
        <div className="font-semibold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>关于健身记录</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          基于开源项目 <span className="font-mono">hmghaoci/gym-log</span> 深度重构与美化。动作数据集来自{' '}
          <span className="font-mono">hasaneyldrm/exercises-dataset</span>，动作演示媒体版权归属于{' '}
          <span className="font-mono">Gym visual</span>。
        </p>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
              theme.isDark ? 'bg-[#121218] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="text-base font-bold mb-2">确认清空所有数据？</h3>
            <p className={`text-xs mb-5 ${theme.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              该操作将清除浏览器中的所有训练记录、周计划和自定义模板，不可撤销。建议在清空前先导出备份。
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium ${
                  theme.isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                取消
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
