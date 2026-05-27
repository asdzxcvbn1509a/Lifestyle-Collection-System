import { useState, useEffect } from 'react';
import Modal from './Modal';
import IconPicker from './IconPicker';
import { DEFAULT_ICON } from '@/lib/icons';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';

export default function CategoryFormModal({ open, onClose, category }) {
  const isEdit = !!category;
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [icon, setIcon] = useState(DEFAULT_ICON);

  const create = useCreateCategory();
  const update = useUpdateCategory();
  const saving = create.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setName(category?.name || '');
      setDetail(category?.detail || '');
      setIcon(category?.icon || DEFAULT_ICON);
    }
  }, [open, category]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const payload = { name: name.trim(), detail: detail.trim() || undefined, icon };
    try {
      if (isEdit) await update.mutateAsync({ id: category.id, ...payload });
      else await create.mutateAsync(payload);
      onClose();
    } catch {
      /* error toast handled in the mutation hook */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            ยกเลิก
          </button>
          <button className="btn-primary" onClick={submit} disabled={saving || !name.trim()}>
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">ไอคอน</label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>
        <div>
          <label className="label">ชื่อหมวดหมู่</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={80}
            placeholder="เช่น ร้านกาแฟ, หนังสือ, การออกกำลังกาย"
          />
        </div>
        <div>
          <label className="label">รายละเอียด (ไม่บังคับ)</label>
          <textarea
            className="input"
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            maxLength={2000}
          />
        </div>
      </form>
    </Modal>
  );
}
