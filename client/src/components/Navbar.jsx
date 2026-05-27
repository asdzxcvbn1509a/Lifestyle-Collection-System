import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Users, Settings, Boxes } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { usePublicSettings } from '@/hooks/usePublicSettings';
import SearchBar from './SearchBar';
import Avatar from './Avatar';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/cn';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { data: settings } = usePublicSettings();
  const siteName = settings?.siteName || 'Lifestyle';
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    cn(
      'rounded-lg px-3 py-1.5 text-sm font-medium transition',
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-400">
          <Boxes className="h-6 w-6" />
          <span className="hidden sm:inline">{siteName}</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            หน้าหลัก
          </NavLink>
          <NavLink to="/favorites" className={navClass}>
            โปรด
          </NavLink>
          <NavLink to="/stats" className={navClass}>
            สถิติ
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBar />
          {user?.role === 'ADMIN' && (
            <>
              <NavLink to="/admin/users" className={navClass} title="จัดการผู้ใช้">
                <Users className="h-4 w-4" />
              </NavLink>
              <NavLink to="/admin/settings" className={navClass} title="ตั้งค่าระบบ">
                <Settings className="h-4 w-4" />
              </NavLink>
            </>
          )}
          <ThemeToggle />
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="โปรไฟล์"
          >
            <Avatar user={user} />
            <span className="hidden text-sm font-medium md:inline">
              {user?.displayName || user?.username}
            </span>
          </Link>
          <button onClick={handleLogout} className="btn-ghost px-2" title="ออกจากระบบ">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
