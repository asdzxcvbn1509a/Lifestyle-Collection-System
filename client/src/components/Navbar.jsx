import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Users, Settings, Boxes, Menu, X } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { usePublicSettings } from '@/hooks/usePublicSettings';
import SearchBar from './SearchBar';
import Avatar from './Avatar';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/cn';

const ACTIVE = 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300';
const INACTIVE = 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { data: settings } = usePublicSettings();
  const siteName = settings?.siteName || 'Lifestyle';
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    cn('rounded-lg px-3 py-1.5 text-sm font-medium transition', isActive ? ACTIVE : INACTIVE);
  const mobileNavClass = ({ isActive }) =>
    cn(
      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
      isActive ? ACTIVE : INACTIVE
    );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-400">
          <Boxes className="h-6 w-6" />
          <span className="hidden sm:inline">{siteName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
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
          <SearchBar className="hidden w-44 md:block lg:w-56" />
          {user?.role === 'ADMIN' && (
            <div className="hidden items-center gap-2 md:flex">
              <NavLink to="/admin/users" className={navClass} title="จัดการผู้ใช้">
                <Users className="h-4 w-4" />
              </NavLink>
              <NavLink to="/admin/settings" className={navClass} title="ตั้งค่าระบบ">
                <Settings className="h-4 w-4" />
              </NavLink>
            </div>
          )}
          <ThemeToggle />
          <Link
            to="/profile"
            className="hidden items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100 md:flex dark:hover:bg-slate-800"
            title="โปรไฟล์"
          >
            <Avatar user={user} />
            <span className="hidden text-sm font-medium md:inline">
              {user?.displayName || user?.username}
            </span>
          </Link>
          <button onClick={handleLogout} className="btn-ghost hidden px-2 md:inline-flex" title="ออกจากระบบ">
            <LogOut className="h-4 w-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost px-2 md:hidden"
            aria-label="เมนู"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="space-y-2 border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          <SearchBar className="w-full" onSubmit={() => setOpen(false)} />
          <nav className="grid gap-1" onClick={() => setOpen(false)}>
            <NavLink to="/" end className={mobileNavClass}>
              หน้าหลัก
            </NavLink>
            <NavLink to="/favorites" className={mobileNavClass}>
              โปรด
            </NavLink>
            <NavLink to="/stats" className={mobileNavClass}>
              สถิติ
            </NavLink>
            {user?.role === 'ADMIN' && (
              <>
                <NavLink to="/admin/users" className={mobileNavClass}>
                  <Users className="h-4 w-4" /> จัดการผู้ใช้
                </NavLink>
                <NavLink to="/admin/settings" className={mobileNavClass}>
                  <Settings className="h-4 w-4" /> ตั้งค่าระบบ
                </NavLink>
              </>
            )}
            <NavLink to="/profile" className={mobileNavClass}>
              <Avatar user={user} /> {user?.displayName || user?.username}
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" /> ออกจากระบบ
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
