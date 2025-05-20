'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/app/providers';
import { ErrorBoundary } from 'react-error-boundary';

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div role="alert" className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h2>
      <pre className="text-sm text-red-700 mb-4 overflow-auto max-h-36 p-2 bg-red-100 rounded">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Try again
      </button>
    </div>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  // Create a client for React Query
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));
  
  // Add error logging
  useEffect(() => {
    // Global error handler
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      // You could also send to an error tracking service here
    };
    
    // Add listeners
    window.addEventListener('error', errorHandler);
    
    // Clean up
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error) => console.error('Error caught by ErrorBoundary:', error)}
      onReset={() => window.location.reload()}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
} 