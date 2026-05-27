import { Wrench } from 'lucide-react';

export default function Maintenance({ siteName }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center dark:bg-slate-950">
      <Wrench className="h-12 w-12 text-amber-500" />
      <h1 className="text-2xl font-bold">{siteName || 'ระบบ'} กำลังปิดปรับปรุง</h1>
      <p className="max-w-sm text-slate-500 dark:text-slate-400">
        ขออภัยในความไม่สะดวก ระบบกำลังอยู่ระหว่างการปรับปรุง กรุณากลับมาใหม่ภายหลัง
      </p>
    </div>
  );
}
