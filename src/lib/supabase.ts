import { createClient as createBrowserClient } from './supabase-browser';

// Creates a consistent supabase client across the application
// This helps prevent multiple GoTrueClient instances which can cause authentication errors
export const supabase = createBrowserClient();

// Export the create function in case it's needed elsewhere
export { createClient as createSupabaseClient } from './supabase-browser'; 