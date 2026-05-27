import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import ThemedToaster from './components/ThemedToaster';
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const tree = (
  <>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <ThemedToaster />
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            {/* Only wrap with the Google provider when a client ID is configured. */}
            {googleClientId ? (
              <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider>
            ) : (
              tree
            )}
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
