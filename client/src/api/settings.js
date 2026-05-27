import { api } from './client';

// Public settings (siteName, maintenanceMode) — no auth required.
export const getPublicSettings = () => api.get('/settings/public').then((r) => r.data.settings);
