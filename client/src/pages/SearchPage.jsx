import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useItems, useToggleFavorite, useDeleteItem } from '@/hooks/useItems';
import { useCategories } from '@/hooks/useCategories';
import ItemCard from '@/components/ItemCard';
import ItemFormModal from '@/components/ItemFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import SortSelect from '@/components/SortSelect';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [sort, setSort] = useState('newest');

  const { data: categories } = useCategories();
  const { data: items, isLoading } = useItems({ q: q || undefined, sort });

  const fav = useToggleFavorite();
  const del = useDeleteItem();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const confirmDelete = async () => {
    await del.mutateAsync(deleting.id);
    setDeleting(null);
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold">
            <Search className="h-6 w-6" /> ผลการค้นหา
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">คำค้นหา: “{q}”</p>
        </div>
        <SortSelect value={sort} onChange={setSort} />
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
        <EmptyState icon={Search} title="ไม่พบผลลัพธ์" message={`ไม่พบไอเทมที่ตรงกับ “${q}”`} />
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
