import { useState, useEffect, useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import Modal from './Modal';
import RatingStars from './RatingStars';
import { useCreateItem, useUpdateItem } from '@/hooks/useItems';
import { resizeImage } from '@/lib/resizeImage';

export default function ItemFormModal({ open, onClose, item, categoryId, categories }) {
  const isEdit = !!item;
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [rating, setRating] = useState(0);
  const [catId, setCatId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const create = useCreateItem();
  const update = useUpdateItem();
  const saving = create.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setName(item?.name || '');
      setDetail(item?.detail || '');
      setRating(item?.rating || 0);
      setCatId(String(item?.categoryId || categoryId || ''));
      setFile(null);
      setPreview(item?.imageUrl || null);
    }
  }, [open, item, categoryId]);

  const onPickFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const resized = await resizeImage(f, { maxDim: 1600 });
    setFile(resized);
    setPreview(URL.createObjectURL(resized));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !catId) return;
    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('detail', detail.trim());
    fd.append('rating', String(rating || 0));
    fd.append('categoryId', String(catId));
    if (file) fd.append('image', file);
    try {
      if (isEdit) await update.mutateAsync({ id: item.id, formData: fd });
      else await create.mutateAsync(fd);
      onClose();
    } catch {
      /* error toast handled in the mutation hook */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'แก้ไขไอเทม' : 'เพิ่มไอเทม'}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            ยกเลิก
          </button>
          <button className="btn-primary" onClick={submit} disabled={saving || !name.trim() || !catId}>
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">รูปภาพ (ไม่บังคับ)</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500 dark:hover:bg-slate-800"
          >
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-sm">
                <ImagePlus className="h-6 w-6" /> เลือกรูปภาพ
              </span>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
        </div>

        <div>
          <label className="label">ชื่อไอเทม</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={120}
          />
        </div>

        {categories && (
          <div>
            <label className="label">หมวดหมู่</label>
            <select className="input" value={catId} onChange={(e) => setCatId(e.target.value)}>
              <option value="" disabled>
                เลือกหมวดหมู่
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label">รายละเอียด (ไม่บังคับ)</label>
          <textarea
            className="input"
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            maxLength={4000}
          />
        </div>

        <div>
          <label className="label">คะแนน</label>
          <RatingStars value={rating} onChange={setRating} size="lg" />
        </div>
      </form>
    </Modal>
  );
}
