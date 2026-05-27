import { useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useUsers, useDeleteUser } from '@/hooks/useAdmin';
import { useAuth } from '@/auth/AuthContext';
import UserFormModal from '@/components/UserFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import Spinner from '@/components/Spinner';
import { cn } from '@/lib/cn';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { data: users, isLoading } = useUsers();
  const del = useDeleteUser();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const confirmDelete = async () => {
    await del.mutateAsync(deleting.id);
    setDeleting(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> เพิ่มผู้ใช้
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">ผู้ใช้</th>
                <th className="px-4 py-3">บทบาท</th>
                <th className="hidden px-4 py-3 sm:table-cell">หมวด / ไอเทม</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users?.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800 dark:text-slate-100">{u.displayName || u.username}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                        u.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      )}
                    >
                      {u.role === 'ADMIN' ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 sm:table-cell dark:text-slate-400">
                    {u._count.categories} / {u._count.items}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        className="btn-ghost px-2 py-1"
                        onClick={() => {
                          setEditing(u);
                          setFormOpen(true);
                        }}
                        aria-label="แก้ไข"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="btn-ghost px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-30 dark:text-red-400 dark:hover:bg-red-500/10"
                        disabled={u.id === me?.id}
                        onClick={() => setDeleting(u)}
                        title={u.id === me?.id ? 'ลบบัญชีตัวเองไม่ได้' : 'ลบ'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal open={formOpen} onClose={() => setFormOpen(false)} user={editing} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={del.isPending}
        message={`ต้องการลบผู้ใช้ "${deleting?.displayName || deleting?.username}" หรือไม่?`}
      />
    </div>
  );
}
