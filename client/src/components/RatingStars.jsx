import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function RatingStars({ value = 0, onChange, size = 'sm', readOnly = false }) {
  const px = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n === value ? 0 : n)}
          className={cn(readOnly ? 'cursor-default' : 'cursor-pointer')}
          aria-label={`${n} ดาว`}
        >
          <Star
            className={cn(
              px,
              n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  );
}
