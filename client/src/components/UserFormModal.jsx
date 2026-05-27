import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useCreateUser, useUpdateUser } from '@/hooks/useAdmin';

const EMPTY = { email: '', username: '', displayName: '', password: '', role: 'USER' };

export default function UserFormModal({ open, onClose, user }) {
  const isEdit = !!user;
  const [form, setForm] = useState(EMPTY);

  const create = useCreateUser();
  const update = useUpdateUser();
  const saving = create.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setForm({
        email: user?.email || '',
        username: user?.username || '',
        displayName: user?.displayName || '',
        password: '',
        role: user?.role || 'USER',
      });
    }
  }, [open, user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const payload = { id: user.id, displayName: form.displayName, role: form.role };
        if (form.password) payload.password = form.password;
        await update.mutateAsync(payload);
      } else {
        await create.mutateAsync({
          email: form.email,
          username: form.username,
          displayName: form.displayName || undefined,
          password: form.password,
          role: form.role,
        });
      }
      onClose();
    } catch {
      /* error toast handled in the mutation hook */
    }
  };

  const valid = isEdit || (form.email && form.username.length >= 3 && form.password.length >= 6);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้'}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            ยกเลิก
          </button>
          <button className="btn-primary" onClick={submit} disabled={saving || !valid}>
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        {isEdit ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {form.email} (@{form.username})
          </p>
        ) : (
          <>
            <div>
              <label className="label">อีเมล</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="label">ชื่อผู้ใช้</label>
              <input className="input" value={form.username} onChange={set('username')} />
            </div>
          </>
        )}
        <div>
          <label className="label">ชื่อที่แสดง</label>
          <input className="input" value={form.displayName} onChange={set('displayName')} />
        </div>
        <div>
          <label className="label">
            {isEdit ? 'รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)' : 'รหัสผ่าน'}
          </label>
          <input className="input" type="password" value={form.password} onChange={set('password')} />
        </div>
        <div>
          <label className="label">บทบาท</label>
          <select className="input" value={form.role} onChange={set('role')}>
            <option value="USER">ผู้ใช้งาน (USER)</option>
            <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
