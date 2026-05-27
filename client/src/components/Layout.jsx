import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Maintenance from './Maintenance';
import { usePublicSettings } from '@/hooks/usePublicSettings';
import { useAuth } from '@/auth/AuthContext';

export default function Layout() {
  const { data: settings } = usePublicSettings();
  const { user } = useAuth();

  useEffect(() => {
    if (settings?.siteName) document.title = settings.siteName;
  }, [settings?.siteName]);

  // Maintenance mode blocks the app for everyone except admins.
  if (settings?.maintenanceMode === 'true' && user?.role !== 'ADMIN') {
    return <Maintenance siteName={settings.siteName} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
