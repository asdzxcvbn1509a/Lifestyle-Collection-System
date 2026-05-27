export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center dark:border-slate-700 dark:bg-slate-900">
      {Icon && <Icon className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />}
      <p className="font-medium text-slate-700 dark:text-slate-200">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
