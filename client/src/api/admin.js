import { api } from './client';

export const listUsers = () => api.get('/admin/users').then((r) => r.data.users);
export const createUser = (payload) => api.post('/admin/users', payload).then((r) => r.data.user);
export const updateUser = (id, payload) =>
  api.put(`/admin/users/${id}`, payload).then((r) => r.data.user);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);

export const getSettings = () => api.get('/admin/settings').then((r) => r.data.settings);
export const updateSettings = (payload) =>
  api.put('/admin/settings', payload).then((r) => r.data.settings);
