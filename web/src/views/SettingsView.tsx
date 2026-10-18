import React, { useRef, useState } from 'react';
import { Settings, Volume2, Smartphone, Clock, Download, Upload, Trash2, Sparkles, Check, Info, ShieldCheck, Heart } from 'lucide-react';
import { UserSettings, WorkoutSession, WorkoutTemplate, WeekSchedule } from '../types/gym';
import { playRestCompleteSound } from '../utils/audio';
import { APP_VERSION, checkUpdate } from '../utils/update';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onExportData: () => void;
  onImportData: (file: File) => Promise<boolean>;
  onSeedSampleData: () => void;
  onClearAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onSeedSampleData,
  onClearAllData,
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
    <div className="space-y-6 max-w-3xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">应用设置与偏好</h1>
        <p className="text-xs text-slate-400 mt-1">
          个性化休息计时器、音频反馈与离线数据备份
        </p>
      </div>

      {/* Rest Timer Settings */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>组间休息计时器设置</span>
        </h2>

        {/* Default duration options */}
        <div>
          <label className="text-xs text-slate-400 block mb-2">默认休息时长</label>
          <div className="grid grid-cols-5 gap-2">
            {[30, 60, 90, 120, 180].map((sec) => (
              <button
                key={sec}
                onClick={() => onUpdateSettings({ ...settings, defaultRestSeconds: sec })}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  settings.defaultRestSeconds === sec
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {sec}秒
              </button>
            ))}
          </div>
        </div>

        {/* Auto start rest toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <div className="text-xs font-medium text-white">完成组数后自动开启休息计时</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              点击打勾完成某一组时，立即启动浮动倒计时
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateSettings({ ...settings, autoStartRest: !settings.autoStartRest })
            }
            className={`w-11 h-6 rounded-full transition-colors relative ${
              settings.autoStartRest ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                settings.autoStartRest ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Sound toggle & Test */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <div className="text-xs font-medium text-white flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <span>休息结束提示音 (Web Audio)</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              倒计时归零时播放清脆悦耳的双音和弦提示
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSound}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
            >
              试听
            </button>
            <button
              onClick={() =>
                onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
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
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <div className="text-xs font-medium text-white flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>手机震动反馈</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              移动端浏览器支持振动时提供触觉反馈
            </div>
          </div>
          <button
            onClick={() =>
              onUpdateSettings({ ...settings, vibrateEnabled: !settings.vibrateEnabled })
            }
            className={`w-11 h-6 rounded-full transition-colors relative ${
              settings.vibrateEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
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
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>本地数据安全与备份</span>
        </h2>
        <p className="text-xs text-slate-400">
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
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-medium transition-colors disabled:opacity-60"
        >
          <span>{checkingUpdate ? '检查中…' : '检查更新'}</span>
        </button>
        {updateStatus && (
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-400 text-center font-medium">
            {updateStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onExportData}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-medium transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>导出训练记录备份 (.json)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-medium transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
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
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-400 text-center font-medium">
            {importStatus}
          </div>
        )}

        {/* Demo Seed Data */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-white">加载 8 周示例演示数据</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              立即填充推日、拉日、腿日完整记录，体验热力图与 1RM 统计
            </div>
          </div>
          <button
            onClick={handleTriggerSeed}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 transition-colors whitespace-nowrap"
          >
            {showSeedSuccess ? '已加载！' : '生成数据'}
          </button>
        </div>

        {/* Clear Data */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-rose-400">清空本机所有记录</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              重置历史训练、计划排期与自定义模板
            </div>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-medium border border-rose-900/50 transition-colors"
          >
            清空重置
          </button>
        </div>
      </div>

      {/* Credits & Open Source Info */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <div className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>关于 GymLog</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          基于开源项目 <span className="text-slate-300 font-mono">hmghaoci/gym-log</span> 深度重构与界面美化。动作数据集来自{' '}
          <span className="text-slate-300 font-mono">hasaneyldrm/exercises-dataset</span>，动作演示媒体版权归属于{' '}
          <span className="text-slate-300 font-mono">Gym visual</span>。
        </p>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-700 rounded-2xl p-5 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">确认清空所有数据？</h3>
            <p className="text-xs text-slate-400 mb-5">
              该操作将清除浏览器中的所有训练记录、周计划和自定义模板，不可撤销。建议在清空前先导出备份。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
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
