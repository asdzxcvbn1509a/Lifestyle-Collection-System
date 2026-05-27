import { Boxes } from 'lucide-react';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-amber-50 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2 text-brand-700 dark:text-brand-400">
            <Boxes className="h-7 w-7" />
            <span className="text-xl font-bold">Lifestyle</span>
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
