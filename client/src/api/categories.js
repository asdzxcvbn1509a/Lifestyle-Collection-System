import { api } from './client';

export const listCategories = () => api.get('/categories').then((r) => r.data.categories);
export const getCategory = (id) => api.get(`/categories/${id}`).then((r) => r.data.category);
export const createCategory = (payload) => api.post('/categories', payload).then((r) => r.data.category);
export const updateCategory = (id, payload) =>
  api.put(`/categories/${id}`, payload).then((r) => r.data.category);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);
