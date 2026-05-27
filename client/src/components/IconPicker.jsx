import { ICON_NAMES, getIcon } from '@/lib/icons';
import { cn } from '@/lib/cn';

export default function IconPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {ICON_NAMES.map((name) => {
        const Icon = getIcon(name);
        const active = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              'flex items-center justify-center rounded-lg border p-2 transition',
              active
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
            aria-label={name}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
