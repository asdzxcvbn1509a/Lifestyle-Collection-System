import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/auth/AuthContext';
import AuthShell from '@/components/AuthShell';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Register() {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (values) => {
    try {
      await registerUser({
        email: values.email,
        username: values.username,
        displayName: values.displayName || values.username,
        password: values.password,
      });
      toast.success('สมัครสมาชิกสำเร็จ');
      navigate('/', { replace: true });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AuthShell title="สมัครสมาชิก" subtitle="สร้างบัญชีเพื่อเริ่มเก็บไลฟ์สไตล์ของคุณ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">อีเมล</label>
          <input
            type="email"
            className="input"
            {...register('email', {
              required: 'กรุณากรอกอีเมล',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'รูปแบบอีเมลไม่ถูกต้อง' },
            })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">ชื่อผู้ใช้</label>
          <input
            className="input"
            {...register('username', {
              required: 'กรุณากรอกชื่อผู้ใช้',
              minLength: { value: 3, message: 'อย่างน้อย 3 ตัวอักษร' },
            })}
          />
          {errors.username && <p className="field-error">{errors.username.message}</p>}
        </div>
        <div>
          <label className="label">ชื่อที่แสดง (ไม่บังคับ)</label>
          <input className="input" {...register('displayName')} />
        </div>
        <div>
          <label className="label">รหัสผ่าน</label>
          <input
            type="password"
            className="input"
            {...register('password', {
              required: 'กรุณากรอกรหัสผ่าน',
              minLength: { value: 6, message: 'อย่างน้อย 6 ตัวอักษร' },
            })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label">ยืนยันรหัสผ่าน</label>
          <input
            type="password"
            className="input"
            {...register('confirm', {
              required: 'กรุณายืนยันรหัสผ่าน',
              validate: (v) => v === watch('password') || 'รหัสผ่านไม่ตรงกัน',
            })}
          />
          {errors.confirm && <p className="field-error">{errors.confirm.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        </button>
      </form>
      <GoogleSignInButton />
      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        มีบัญชีอยู่แล้ว?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          เข้าสู่ระบบ
        </Link>
      </p>
    </AuthShell>
  );
}
