import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, PackagePlus, Search } from 'lucide-react';
import { useCategory, useCategories } from '@/hooks/useCategories';
import { useItems, useDeleteItem, useToggleFavorite } from '@/hooks/useItems';
import CategoryIcon from '@/components/CategoryIcon';
import ItemCard from '@/components/ItemCard';
import ItemFormModal from '@/components/ItemFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import SortSelect from '@/components/SortSelect';
import { useDebounce } from '@/hooks/useDebounce';

export default function CategoryPage() {
  const { id } = useParams();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('newest');
  const debouncedQ = useDebounce(q, 300);

  const { data: category } = useCategory(id);
  const { data: allCategories } = useCategories();
  const { data: items, isLoading } = useItems({
    categoryId: Number(id),
    q: debouncedQ || undefined,
    sort,
  });

  const del = useDeleteItem();
  const fav = useToggleFavorite();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (it) => {
    setEditing(it);
    setFormOpen(true);
  };
  const confirmDelete = async () => {
    await del.mutateAsync(deleting.id);
    setDeleting(null);
  };

  return (
    <div>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> หน้าหลัก
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <CategoryIcon name={category?.icon} className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{category?.name || '...'}</h1>
            {category?.detail && <p className="text-sm text-slate-500 dark:text-slate-400">{category.detail}</p>}
          </div>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" /> เพิ่มไอเทม
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            className="input pl-8"
            placeholder="ค้นหาในหมวดนี้..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
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
              onToggleFavorite={(item) => fav.mutate({ id: item.id, isFavorite: !item.isFavorite })}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackagePlus}
          title={q ? 'ไม่พบไอเทมที่ค้นหา' : 'ยังไม่มีไอเทมในหมวดนี้'}
          message={q ? undefined : 'เพิ่มไอเทมแรกของคุณลงในหมวดนี้'}
          action={
            !q && (
              <button className="btn-primary" onClick={openCreate}>
                <Plus className="h-4 w-4" /> เพิ่มไอเทม
              </button>
            )
          }
        />
      )}

      <ItemFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        item={editing}
        categoryId={Number(id)}
        categories={allCategories}
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
