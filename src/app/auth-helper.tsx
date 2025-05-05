'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { useAuth } from '@/context/AuthContext';
import { Session } from '@supabase/supabase-js';

// Define the Auth type based on what's expected from useAuth
type Auth = {
  clearAuthState: () => Promise<void>;
  // Add other auth properties if needed
};

export function AuthDebugger() {
  const [authStatus, setAuthStatus] = useState<string>('Loading...');
  const [hasCookies, setHasCookies] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();
  
  // Use auth in a try/catch block to handle potential errors
  let auth: Auth | undefined;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error:", error);
    // Don't fail if auth context fails to load
  }
  
  // Create Supabase client - guaranteed to exist in browser
  const supabase = createClient();
  
  useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined') return;
    
    const checkAuth = async () => {
      try {
        // Check cookies
        const cookieExists = document.cookie.includes('sb-');
        setHasCookies(cookieExists);
        
        // Check session - supabase is guaranteed to exist in browser environment
        if (!supabase) {
          setAuthStatus('No Supabase client');
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setAuthStatus(`Error: ${error.message}`);
          return;
        }
        
        if (data.session) {
          setAuthStatus('Authenticated');
          setSessionId(data.session.user.id);
          
          // User is authenticated but on login page? Redirect to dashboard
          if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
            console.log('Auth helper: redirecting to dashboard');
            router.push('/dashboard');
          }
        } else {
          setAuthStatus('Not authenticated');
          
          // User is not authenticated but on protected page? Redirect to login
          if (window.location.pathname.startsWith('/dashboard')) {
            console.log('Auth helper: redirecting to login');
            router.push('/login');
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthStatus('Auth check error');
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    if (!supabase) return;
    
    try {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event: string, session: Session | null) => {
          console.log('Auth state change:', event);
          
          if (event === 'SIGNED_IN' && session) {
            setAuthStatus('Authenticated');
            setSessionId(session.user.id);
            if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
              console.log('Auth listener: redirecting to dashboard');
              router.push('/dashboard');
            }
          }
          
          if (event === 'SIGNED_OUT') {
            setAuthStatus('Not authenticated');
            setSessionId(null);
            if (window.location.pathname.startsWith('/dashboard')) {
              console.log('Auth listener: redirecting to login');
              router.push('/login');
            }
          }
        }
      );
      
      return () => {
        if (authListener?.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("Auth listener error:", error);
      setAuthStatus('Auth listener error');
      return () => {}; // Return empty cleanup function
    }
  }, [supabase, router]);
  
  // Function to reset auth state
  const handleResetAuth = () => {
    if (!auth || !auth.clearAuthState) {
      // Fallback if auth context not available
      if (typeof window !== 'undefined') {
        // Clear cookies
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name.includes('sb-')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          }
        });
        
        // Clear localStorage
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-auth-token');
        
        // Redirect to login
        window.location.href = '/login';
      }
    } else {
      // Use the auth context method
      auth.clearAuthState();
    }
  };
  
  // For debugging only
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
      }}>
        <div>Auth Status: {authStatus}</div>
        <div>Cookies: {hasCookies ? 'Yes' : 'No'}</div>
        <div>Session ID: {sessionId || 'None'}</div>
        <div>
          <button 
            onClick={handleResetAuth}
            style={{
              marginTop: '8px',
              backgroundColor: '#DC2626',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Reset Auth State
          </button>
        </div>
      </div>
    );
  }
  
  return null;
} 