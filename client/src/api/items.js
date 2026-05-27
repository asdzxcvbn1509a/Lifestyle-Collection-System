import { api } from './client';

export const listItems = (params = {}) => api.get('/items', { params }).then((r) => r.data.items);
export const getItem = (id) => api.get(`/items/${id}`).then((r) => r.data.item);

// createItem / updateItem take a FormData (supports the optional image upload).
export const createItem = (formData) => api.post('/items', formData).then((r) => r.data.item);
export const updateItem = (id, formData) => api.put(`/items/${id}`, formData).then((r) => r.data.item);

export const deleteItem = (id) => api.delete(`/items/${id}`).then((r) => r.data);
export const toggleFavorite = (id, isFavorite) =>
  api.patch(`/items/${id}/favorite`, { isFavorite }).then((r) => r.data.item);
