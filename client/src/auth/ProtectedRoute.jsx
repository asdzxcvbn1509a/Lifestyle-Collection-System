import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Spinner from '@/components/Spinner';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner full />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
