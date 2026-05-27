import { Loader2 } from 'lucide-react';

export default function Spinner({ full = false, label }) {
  const content = (
    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
  if (full) return <div className="flex min-h-screen items-center justify-center">{content}</div>;
  return <div className="py-10">{content}</div>;
}
