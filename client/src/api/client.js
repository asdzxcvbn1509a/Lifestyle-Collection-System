import axios from 'axios';

// In dev, calls go to "/api/*" and are proxied to the Express server by Vite.
// In production (split deploy), set VITE_API_URL to the backend origin + "/api".
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

const TOKEN_KEY = 'lcs_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

// Attach the JWT to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise errors into Error(message) carrying status + field errors,
// and bounce to /login when a previously valid session expires.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401 && getToken() && !location.pathname.startsWith('/login')) {
      setToken(null);
      location.href = '/login';
    }

    const err = new Error(data?.message || error.message || 'Request failed');
    err.status = status;
    err.fieldErrors = data?.errors;
    return Promise.reject(err);
  }
);
