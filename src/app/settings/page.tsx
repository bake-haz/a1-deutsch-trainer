"use client";

import AppFrame from "@/components/AppFrame";
import { useStore } from "@/components/StoreProvider";
import { useTts } from "@/components/TtsProvider";

export default function SettingsPage() {
  const { store, updateSettings, resetAll } = useStore();
  const tts = useTts();
  if (!store) return <AppFrame title="设置"><div className="text-muted">加载中…</div></AppFrame>;

  const s = store.settings;

  return (
    <AppFrame title="设置" subtitle="慢学习节奏由你掌控">
      <div className="space-y-4">
        {/* Audio */}
        <div className="card">
          <div className="font-semibold text-ink mb-2">德语语音 (TTS)</div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ink">启用朗读</span>
            <input
              type="checkbox"
              checked={s.audioEnabled}
              onChange={(e) => updateSettings({ audioEnabled: e.target.checked })}
              className="w-5 h-5"
            />
          </div>
          <div className="text-xs text-muted mb-2">
            语音状态：
            {tts.germanVoiceAvailable ? (
              <span className="text-good"> 已检测到德语语音（de-DE），将用于朗读。</span>
            ) : (
              <span className="text-warn"> 未检测到德语语音包。请在系统设置中安装德语语音；绝不会用英语语音冒充。</span>
            )}
          </div>
          <label className="text-sm text-ink flex items-center justify-between gap-2">
            <span>朗读语速（慢一点更好）</span>
            <span className="text-muted">{s.audioRate.toFixed(2)}x</span>
          </label>
          <input
            type="range"
            min={0.6}
            max={1}
            step={0.05}
            value={s.audioRate}
            onChange={(e) => updateSettings({ audioRate: Number(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        {/* Daily pacing */}
        <div className="card">
          <div className="font-semibold text-ink mb-2">每日节奏</div>
          <label className="text-sm text-ink flex items-center justify-between gap-2">
            <span>每天新内容上限</span>
            <span className="text-muted">{s.dailyNewLimit} 个</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={s.dailyNewLimit}
            onChange={(e) => updateSettings({ dailyNewLimit: Number(e.target.value) })}
            className="w-full mt-1"
          />
          <p className="text-xs text-muted mt-1">成人慢学习：默认很少。若最近失败变多，系统会自动再减少。</p>

          <label className="text-sm text-ink flex items-center justify-between gap-2 mt-3">
            <span>状态不好模式上限</span>
            <span className="text-muted">{s.lowModeLimit} 个</span>
          </label>
          <input
            type="range"
            min={2}
            max={12}
            step={1}
            value={s.lowModeLimit}
            onChange={(e) => updateSettings({ lowModeLimit: Number(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        {/* Data */}
        <div className="card">
          <div className="font-semibold text-ink mb-2">学习数据</div>
          <p className="text-xs text-muted mb-2">
            数据仅保存在本机浏览器（localStorage）：刷新、关闭重开后不会丢；
            但不会跨设备同步（换手机 / 换浏览器是各自独立的数据）。
          </p>
          <button
            className="tap btn-danger w-full !min-h-[48px]"
            onClick={() => {
              if (confirm("确定要清空全部学习记录吗？此操作不可恢复。")) resetAll();
            }}
          >
            清空全部学习数据
          </button>
        </div>
      </div>
    </AppFrame>
  );
}
