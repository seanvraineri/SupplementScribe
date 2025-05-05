'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResetAuthPage() {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const resetAuth = async () => {
      try {
        setStatus('Clearing session data...');
        
        // Clear cookies
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name.includes('sb-')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          }
        });
        
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('sb-refresh-token');
          // Clear any other auth-related items
          Object.keys(localStorage).forEach(key => {
            if (key.includes('supabase') || key.includes('sb-')) {
              localStorage.removeItem(key);
            }
          });
        }
        
        setStatus('Authentication data cleared successfully.');
      } catch (error) {
        console.error('Error resetting auth:', error);
        setStatus('Error clearing authentication data. Please try again.');
      }
    };
    
    resetAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Authentication Reset</h1>
            <p className="mt-2 text-gray-600">
              This page will help fix authentication issues by clearing stored session data.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              {status === 'Authentication data cleared successfully.' ? (
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : status === 'Error clearing authentication data. Please try again.' ? (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className="text-center text-gray-800 font-medium">{status}</div>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/login"
              className="block w-full py-3 px-4 text-center text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition duration-150"
            >
              Go to Login
            </Link>
            
            <Link 
              href="/"
              className="block w-full py-3 px-4 text-center text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150"
            >
              Return to Home
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>If you continue to experience issues, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 