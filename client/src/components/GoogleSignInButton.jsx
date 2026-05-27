import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/auth/AuthContext';

// "Login with Google" button (shared by Login + Register).
// Renders nothing when VITE_GOOGLE_CLIENT_ID is not configured.
export default function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;

  const onSuccess = async (cred) => {
    try {
      await loginWithGoogle(cred.credential);
      toast.success('เข้าสู่ระบบสำเร็จ');
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        หรือ
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => toast.error('เข้าสู่ระบบด้วย Google ไม่สำเร็จ')}
          width="320"
        />
      </div>
    </div>
  );
}
