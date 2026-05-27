import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { cn } from '@/lib/cn';

// Static accent classes (kept literal so Tailwind keeps them) picked per category.
const ACCENTS = [
  'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
  'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
  'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
];

export default function CategoryCard({ category, onEdit, onDelete }) {
  const [menu, setMenu] = useState(false);
  const accent = ACCENTS[category.id % ACCENTS.length];

  return (
    <div className="card card-hover group relative flex flex-col p-4">
      <div className="absolute right-2 top-2">
        <button
          onClick={() => setMenu((m) => !m)}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800"
          aria-label="ตัวเลือก"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menu && (
          <div
            className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
            onMouseLeave={() => setMenu(false)}
          >
            <button
              onClick={() => {
                setMenu(false);
                onEdit();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Pencil className="h-4 w-4" /> แก้ไข
            </button>
            <button
              onClick={() => {
                setMenu(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" /> ลบ
            </button>
          </div>
        )}
      </div>

      <Link to={`/categories/${category.id}`} className="flex flex-col items-start gap-3">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', accent)}>
          <CategoryIcon name={category.icon} className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{category.name}</h3>
          {category.detail && (
            <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{category.detail}</p>
          )}
        </div>
        <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {category._count?.items ?? 0} ไอเทม
        </span>
      </Link>
    </div>
  );
}
