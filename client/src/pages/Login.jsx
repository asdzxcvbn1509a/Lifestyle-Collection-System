import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/auth/AuthContext';
import AuthShell from '@/components/AuthShell';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (values) => {
    try {
      await login(values.identifier, values.password);
      toast.success('เข้าสู่ระบบสำเร็จ');
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AuthShell title="เข้าสู่ระบบ" subtitle="ยินดีต้อนรับกลับ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">อีเมลหรือชื่อผู้ใช้</label>
          <input
            className="input"
            autoFocus
            {...register('identifier', { required: 'กรุณากรอกอีเมลหรือชื่อผู้ใช้' })}
          />
          {errors.identifier && <p className="field-error">{errors.identifier.message}</p>}
        </div>
        <div>
          <label className="label">รหัสผ่าน</label>
          <input
            type="password"
            className="input"
            {...register('password', { required: 'กรุณากรอกรหัสผ่าน' })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
      <GoogleSignInButton />
      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        ยังไม่มีบัญชี?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
          สมัครสมาชิก
        </Link>
      </p>
    </AuthShell>
  );
}
