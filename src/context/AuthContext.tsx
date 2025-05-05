import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase-browser';

/**
 * AuthContextType - Defines the shape of our auth context
 */
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<{ error?: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  clearAuthState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Manages authentication state and provides auth methods
 * 
 * This implementation follows React best practices:
 * 1. Single source of truth for auth state
 * 2. Proper loading states and error handling
 * 3. Efficient state updates with proper dependencies
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Use the singleton Supabase client - won't be null in browser
  const supabase = createClient();

  // Initialize auth state - this runs ONCE on mount
  useEffect(() => {
    // Safety check - ensure we're not server-side rendering
    if (typeof window === 'undefined') return;
    
    let mounted = true;
    console.log('AuthContext: Initializing', document.cookie);
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Gracefully handle null supabase client
        if (!supabase) {
          console.error('Supabase client not available');
          if (mounted) {
            setInitError(new Error('Supabase client not available'));
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        // Get the initial session - with error handling
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Failed to get session:', error.message);
            if (mounted) {
              setInitError(error);
              setIsLoading(false);
              setIsInitialized(true);
            }
            return;
          }
          
          console.log('Auth: Session data initially:', data?.session?.user?.email || 'No session');
          
          if (mounted) {
            handleAuthChange(data.session);
          }
        } catch (sessionError) {
          console.error('Exception getting session:', sessionError);
          if (mounted) {
            setInitError(sessionError instanceof Error ? sessionError : new Error('Session error'));
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }

        // Set up auth listener with error handling
        try {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, newSession: Session | null) => {
            console.log(`AuthContext: Auth state changed: ${event}`, newSession?.user?.email || 'No user');
            
            if (mounted) {
              handleAuthChange(newSession);
            }
            
            // Handle sign in event
            if (event === 'SIGNED_IN' && newSession) {
              console.log('Auth: Signed in with session', newSession.user.email);
              queryClient.invalidateQueries();
              
              // Force redirect to dashboard after sign in
              const current = window.location.pathname;
              console.log('Current path:', current);
              
              // Always redirect to dashboard on sign in, regardless of current page
              if (current !== '/dashboard') {
                console.log('AuthContext: Redirecting to dashboard from', current);
                // Use setTimeout to ensure the redirect happens after state is updated
                setTimeout(() => {
                  router.push('/dashboard');
                }, 100);
              }
            }
            
            // Handle sign out
            if (event === 'SIGNED_OUT') {
              console.log('Auth: Signed out, clearing queries');
              queryClient.clear();
            }
          });

          if (mounted) {
            setIsInitialized(true);
          }
          
          // Cleanup subscription on unmount
          return () => {
            console.log('AuthContext: Cleaning up subscription');
            if (subscription && typeof subscription.unsubscribe === 'function') {
              subscription.unsubscribe();
            }
          };
        } catch (subscriptionError) {
          console.error('Error setting up auth subscription:', subscriptionError);
          if (mounted) {
            setInitError(subscriptionError instanceof Error ? subscriptionError : new Error('Subscription error'));
            setIsLoading(false);
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setInitError(error instanceof Error ? error : new Error('Initialization error'));
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();
    
    return () => {
      mounted = false;
    };
  }, [queryClient, router]);

  // Helper function to handle auth state changes
  const handleAuthChange = (newSession: Session | null) => {
    console.log('Auth: Handling auth change, new session:', newSession?.user?.email || 'No session');
    setSession(newSession);
    setUser(newSession?.user || null);
    setIsLoading(false);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: new Error('Supabase client not initialized') };
    }
    
    try {
      console.log('AuthContext: Starting Google sign-in');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error in Google sign-in:', error);
      return { error: error instanceof Error ? error : new Error('Google sign-in error') };
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: new Error('Supabase client not initialized') };
    }
    
    try {
      console.log('AuthContext: Starting email sign-in');
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Email sign-in error:', error);
        return { error };
      }
      
      // Manually check for session after sign in
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session after login:', sessionError);
        return { error: sessionError };
      }
      
      console.log('Email sign-in session:', sessionData.session?.user.email || 'No session');
      
      // Force redirect to dashboard - middleware should handle this too
      if (sessionData.session) {
        router.push('/dashboard');
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error in email sign-in:', error);
      return { error: error instanceof Error ? error : new Error('Email sign-in error') };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { data: null, error: new Error('Supabase client not initialized') };
    }
    
    try {
      console.log('AuthContext: Starting sign-up');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}` }
      });
      
      if (error) {
        console.error('Sign-up error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in sign-up:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Sign-up error') };
    }
  };

  // Sign out
  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    
    try {
      console.log('AuthContext: Starting sign-out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign-out error:', error);
        return;
      }
      
      // Navigate to the homepage
      router.push('/');
    } catch (error) {
      console.error('Error in sign-out:', error);
    }
  };
  
  // Clear auth state (for debugging/fixing issues)
  const clearAuthState = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }
    
    try {
      console.log('AuthContext: Clearing auth state');
      
      // Sign out first
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear cookies manually
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name.includes('sb-')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
      
      // Clear localStorage
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');
      
      // Clear any other auth-related items
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset state
      setSession(null);
      setUser(null);
      
      // Clear React Query cache
      queryClient.clear();
      
      // Redirect to login
      router.push('/login');
      
      console.log('Auth state cleared');
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading: isLoading || !isInitialized,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    clearAuthState
  };

  // Show error state only in development
  if (process.env.NODE_ENV === 'development' && initError) {
    console.error('Auth initialization error:', initError);
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 