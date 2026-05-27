import { api } from './client';

// updateProfile takes a FormData (displayName and/or avatar file).
export const updateProfile = (formData) => api.put('/users/me', formData).then((r) => r.data.user);
export const changePassword = (payload) =>
  api.put('/users/me/password', payload).then((r) => r.data);
