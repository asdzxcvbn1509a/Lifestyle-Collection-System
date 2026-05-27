import { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { useAuth } from '@/auth/AuthContext';
import CategoryCard from '@/components/CategoryCard';
import CategoryFormModal from '@/components/CategoryFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';

export default function Home() {
  const { user } = useAuth();
  const { data: categories, isLoading } = useCategories();
  const del = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setFormOpen(true);
  };
  const confirmDelete = async () => {
    await del.mutateAsync(deleting.id);
    setDeleting(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">สวัสดี, {user?.displayName || user?.username}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">จัดการคอลเลกชันไลฟ์สไตล์ของคุณ</p>
        </div>
        <button className="btn-primary shrink-0" onClick={openCreate}>
          <Plus className="h-4 w-4" /> เพิ่มหมวดหมู่
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : categories?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={() => openEdit(c)}
              onDelete={() => setDeleting(c)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderPlus}
          title="ยังไม่มีหมวดหมู่"
          message="เริ่มต้นด้วยการเพิ่มหมวดหมู่แรกของคุณ"
          action={
            <button className="btn-primary" onClick={openCreate}>
              <Plus className="h-4 w-4" /> เพิ่มหมวดหมู่
            </button>
          }
        />
      )}

      <CategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} category={editing} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={del.isPending}
        message={`ต้องการลบหมวด "${deleting?.name}" และไอเทมทั้งหมดในหมวดนี้หรือไม่?`}
      />
    </div>
  );
}
