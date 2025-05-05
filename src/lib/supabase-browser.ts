import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// We need a singleton to prevent multiple instances of GoTrueClient
let supabaseInstance: any = null;

export const createClient = () => {
  // Only run in browser
  if (typeof window === 'undefined') return null;
  
  try {
    // Don't recreate if we already have an instance
    if (supabaseInstance) {
      return supabaseInstance;
    }
    
    // Get environment variables with fallbacks
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    // Validate required environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003';
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    // Initialize with explicit error handling
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
      cookieOptions: {
        name: 'sb-auth',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        domain: isLocalhost ? 'localhost' : undefined,
        path: '/',
        sameSite: 'lax',
        secure: siteUrl.startsWith('https')
      }
    });
    
    return supabaseInstance;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null;
  }
};