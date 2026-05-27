import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function AdminRoute() {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <Outlet />;
}
