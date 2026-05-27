import { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useAdmin';
import Spinner from '@/components/Spinner';
import { cn } from '@/lib/cn';

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <span className="block font-medium text-slate-700 dark:text-slate-200">{label}</span>
        {desc && <span className="block text-xs text-slate-500 dark:text-slate-400">{desc}</span>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition',
          checked ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
            checked ? 'left-[22px]' : 'left-0.5'
          )}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName ?? '',
        allowRegistration: settings.allowRegistration === 'true',
        maintenanceMode: settings.maintenanceMode === 'true',
      });
    }
  }, [settings]);

  if (isLoading || !form) return <Spinner />;

  const save = async (e) => {
    e.preventDefault();
    await update.mutateAsync({
      siteName: form.siteName,
      allowRegistration: form.allowRegistration,
      maintenanceMode: form.maintenanceMode,
    });
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">ตั้งค่าระบบ</h1>
      <form onSubmit={save} className="card space-y-2 p-5">
        <div className="pb-2">
          <label className="label">ชื่อระบบ</label>
          <input
            className="input"
            value={form.siteName}
            onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
            maxLength={120}
          />
        </div>
        <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
          <Toggle
            label="เปิดให้สมัครสมาชิก"
            desc="ถ้าปิด ผู้ใช้ใหม่จะสมัครไม่ได้ (UC-01 ถูกบล็อก)"
            checked={form.allowRegistration}
            onChange={(v) => setForm((f) => ({ ...f, allowRegistration: v }))}
          />
          <Toggle
            label="โหมดปิดปรับปรุง"
            desc="ใช้แจ้งสถานะกำลังปรับปรุงระบบ"
            checked={form.maintenanceMode}
            onChange={(v) => setForm((f) => ({ ...f, maintenanceMode: v }))}
          />
        </div>
        <div className="pt-3">
          <button className="btn-primary" disabled={update.isPending}>
            {update.isPending ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </button>
        </div>
      </form>
    </div>
  );
}
