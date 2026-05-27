import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Spinner from './components/Spinner';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminRoute from './auth/AdminRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Favorites from './pages/Favorites';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Code-split heavier / less-frequent routes into their own chunks.
const Stats = lazy(() => import('./pages/Stats'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

export default function App() {
  return (
    <Suspense fallback={<Spinner full />}>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
