import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <p className="text-5xl font-bold text-brand-600 dark:text-brand-400">404</p>
      <p className="text-slate-500 dark:text-slate-400">ไม่พบหน้าที่คุณต้องการ</p>
      <Link to="/" className="btn-primary">
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
