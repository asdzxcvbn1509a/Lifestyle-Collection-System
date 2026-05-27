import { api } from './client';

export const getStats = () => api.get('/stats').then((r) => r.data);
