import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { updateProfile, changePassword } from '@/api/users';
import Avatar from '@/components/Avatar';
import { resizeImage } from '@/lib/resizeImage';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatarUrl || null);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileRef = useRef(null);

  const onPickFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const resized = await resizeImage(f, { maxDim: 512 });
    setFile(resized);
    setPreview(URL.createObjectURL(resized));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const fd = new FormData();
      fd.append('displayName', displayName);
      if (file) fd.append('avatar', file);
      const updated = await updateProfile(fd);
      setUser(updated);
      toast.success('บันทึกโปรไฟล์แล้ว');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onChangePassword = async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('เปลี่ยนรหัสผ่านแล้ว');
      reset();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">โปรไฟล์</h1>

      <form onSubmit={saveProfile} className="card space-y-4 p-5">
        <h2 className="font-semibold">ข้อมูลส่วนตัว</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar user={{ ...user, avatarUrl: preview }} size="lg" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full bg-brand-600 p-1.5 text-white shadow"
              aria-label="เปลี่ยนรูป"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p>{user?.email}</p>
            <p>@{user?.username}</p>
          </div>
        </div>
        <div>
          <label className="label">ชื่อที่แสดง</label>
          <input
            className="input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={60}
          />
        </div>
        <button className="btn-primary" disabled={savingProfile}>
          {savingProfile ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </form>

      <form onSubmit={handleSubmit(onChangePassword)} className="card space-y-4 p-5">
        <h2 className="font-semibold">เปลี่ยนรหัสผ่าน</h2>
        <div>
          <label className="label">รหัสผ่านปัจจุบัน</label>
          <input
            type="password"
            className="input"
            {...register('currentPassword', { required: 'กรุณากรอกรหัสผ่านปัจจุบัน' })}
          />
          {errors.currentPassword && <p className="field-error">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label className="label">รหัสผ่านใหม่</label>
          <input
            type="password"
            className="input"
            {...register('newPassword', {
              required: 'กรุณากรอกรหัสผ่านใหม่',
              minLength: { value: 6, message: 'อย่างน้อย 6 ตัวอักษร' },
            })}
          />
          {errors.newPassword && <p className="field-error">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="label">ยืนยันรหัสผ่านใหม่</label>
          <input
            type="password"
            className="input"
            {...register('confirm', {
              required: 'กรุณายืนยันรหัสผ่าน',
              validate: (v) => v === watch('newPassword') || 'รหัสผ่านไม่ตรงกัน',
            })}
          />
          {errors.confirm && <p className="field-error">{errors.confirm.message}</p>}
        </div>
        <button className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
        </button>
      </form>
    </div>
  );
}
