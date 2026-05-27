import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useItems, useToggleFavorite, useDeleteItem } from '@/hooks/useItems';
import { useCategories } from '@/hooks/useCategories';
import ItemCard from '@/components/ItemCard';
import ItemFormModal from '@/components/ItemFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import SortSelect from '@/components/SortSelect';
import { cn } from '@/lib/cn';

export default function Favorites() {
  const [activeCat, setActiveCat] = useState('all');
  const [sort, setSort] = useState('newest');
  const { data: categories } = useCategories();

  const params = { favorite: true, sort };
  if (activeCat !== 'all') params.categoryId = Number(activeCat);
  const { data: items, isLoading } = useItems(params);

  const fav = useToggleFavorite();
  const del = useDeleteItem();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const confirmDelete = async () => {
    await del.mutateAsync(deleting.id);
    setDeleting(null);
  };

  const tabClass = (active) =>
    cn(
      'whitespace-nowrap rounded-full px-3 py-1 text-sm transition',
      active
        ? 'bg-brand-600 text-white dark:bg-brand-500'
        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
    );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Heart className="h-6 w-6 text-red-500" /> รายการโปรด
        </h1>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        <button className={tabClass(activeCat === 'all')} onClick={() => setActiveCat('all')}>
          ทั้งหมด
        </button>
        {categories?.map((c) => (
          <button
            key={c.id}
            className={tabClass(activeCat === String(c.id))}
            onClick={() => setActiveCat(String(c.id))}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner />
      ) : items?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <ItemCard
              key={it.id}
              item={it}
              showCategory
              onToggleFavorite={(item) => fav.mutate({ id: item.id, isFavorite: !item.isFavorite })}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="ยังไม่มีรายการโปรด"
          message="กดรูปหัวใจที่ไอเทมเพื่อเพิ่มเข้ารายการโปรด"
        />
      )}

      <ItemFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        item={editing}
        categories={categories}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={del.isPending}
        message={`ต้องการลบไอเทม "${deleting?.name}" หรือไม่?`}
      />
    </div>
  );
}
