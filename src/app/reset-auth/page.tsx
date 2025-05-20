'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ResetAuthPage() {
  const { clearAuthState } = useAuth();
  const [status, setStatus] = useState('Resetting authentication...');
  const router = useRouter();

  useEffect(() => {
    async function resetAuth() {
      try {
        // Clear all auth state
        await clearAuthState();
        
        // Clear all cookies related to auth
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });
        
        // Clear localStorage
        localStorage.clear();
        
        setStatus('Authentication reset successful! Redirecting...');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Error resetting auth:', error);
        setStatus('Error resetting authentication. Please try again.');
      }
    }
    
    resetAuth();
  }, [clearAuthState, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Authentication Reset
        </h1>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-center">{status}</p>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go to login page
          </button>
        </div>
      </div>
    </div>
  );
} 