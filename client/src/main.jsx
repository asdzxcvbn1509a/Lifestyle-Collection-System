import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import ThemedToaster from './components/ThemedToaster';
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
            <ThemedToaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
