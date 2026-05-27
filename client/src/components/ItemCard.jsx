import { Heart, Pencil, Trash2 } from 'lucide-react';
import RatingStars from './RatingStars';
import CategoryIcon from './CategoryIcon';
import { cn } from '@/lib/cn';

export default function ItemCard({ item, onToggleFavorite, onEdit, onDelete, showCategory = false }) {
  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600">
            <CategoryIcon name={item.category?.icon} className="h-10 w-10" />
          </div>
        )}
        <button
          onClick={() => onToggleFavorite(item)}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900"
          title="รายการโปรด"
        >
          <Heart
            className={cn(
              'h-4 w-4',
              item.isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 dark:text-slate-500'
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-medium text-slate-800 dark:text-slate-100">{item.name}</h3>
        {showCategory && item.category && (
          <span className="chip">
            <CategoryIcon name={item.category.icon} className="h-3 w-3" /> {item.category.name}
          </span>
        )}
        {item.detail && (
          <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
        )}
        {item.rating > 0 && <RatingStars value={item.rating} readOnly />}

        <div className="mt-2 flex items-center gap-1 border-t border-slate-100 pt-2 dark:border-slate-800">
          <button onClick={() => onEdit(item)} className="btn-ghost flex-1 py-1.5 text-xs">
            <Pencil className="h-3.5 w-3.5" /> แก้ไข
          </button>
          <button
            onClick={() => onDelete(item)}
            className="btn-ghost flex-1 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> ลบ
          </button>
        </div>
      </div>
    </div>
  );
}
