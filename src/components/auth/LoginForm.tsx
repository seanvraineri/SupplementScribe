'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

/**
 * LoginForm - Handles user authentication
 * 
 * This implementation uses direct Supabase auth calls and
 * provides a clean, minimal interface for user login.
 */
export default function LoginForm({ redirectPath = '/dashboard' }: { redirectPath?: string }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResendOption, setShowResendOption] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Resend email confirmation handler
  const resendEmailConfirmation = async (email: string) => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error resending confirmation:', error);
      return { error };
    }
  };

  // Handle resend confirmation button click
  const handleResendConfirmation = async () => {
    try {
      setResendMessage(null);
      setIsLoading(true);
      const { error } = await resendEmailConfirmation(email);
      if (error) throw error;
      setResendMessage('Confirmation email has been resent. Please check your inbox and spam folder.');
    } catch (err: any) {
      setResendMessage('Failed to resend confirmation email. Please try again later.');
      console.error('Error resending confirmation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      setError(null);
      setIsLoading(true);
      
      // Call Supabase OAuth directly
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      
      if (error) throw error;
      
      setSuccess('Initiating Google sign in...');
    } catch (err: any) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Email/password login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      if (!supabase) {
        setError('Supabase client not available. This might be due to authentication issues. Try resetting your auth state.');
        return;
      }
      
      setError(null);
      setSuccess(null);
      setShowResendOption(false);
      setResendMessage(null);
      setIsLoading(true);
      
      // Show immediate feedback while logging in
      setSuccess('Signing in...');
      
      // Call Supabase auth directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        
        // Handle email confirmation errors
        if (error.message?.includes('Email not confirmed') || 
            error.message?.toLowerCase().includes('email confirmation') ||
            error.message?.toLowerCase().includes('not confirmed') ||
            error.message?.includes('Invalid login credentials')) {
          
          // Check if this is an unconfirmed email issue
          if (error.message?.includes('Email not confirmed') || 
              error.message?.toLowerCase().includes('email confirmation') ||
              error.message?.toLowerCase().includes('not confirmed')) {
            setError('Please confirm your email address before logging in.');
            setShowResendOption(true);
          } else {
            setError('Invalid email or password. Please try again.');
          }
        } else {
          setError(error.message || 'Failed to sign in. Please try again.');
        }
        setIsLoading(false);
        return;
      }
      
      // Success - manually redirect to dashboard
      setSuccess('Sign in successful! Redirecting...');
      
      // Force redirect to dashboard after successful login
      console.log('Login successful, redirecting to:', redirectPath);
      setTimeout(() => {
        router.push(redirectPath);
      }, 500); // Small delay to show success message
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. You may need to reset your authentication state.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your SupplementScribe account</p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
          
          {showResendOption && (
            <button 
              onClick={handleResendConfirmation}
              disabled={isLoading}
              className="ml-2 underline font-medium hover:text-red-800"
            >
              Resend confirmation email
            </button>
          )}
          
          {error.includes('Supabase client not available') || error.includes('unexpected error') ? (
            <div className="mt-2">
              <Link href="/reset-auth" className="underline font-medium hover:text-red-800">
                Reset authentication state
              </Link>
            </div>
          ) : null}
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {success}
        </div>
      )}

      {resendMessage && (
        <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {resendMessage}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M21.35 11.1H12v3.75h5.71c-.54 2.86-2.94 4.15-5.71 4.15-3.45 0-6.25-2.8-6.25-6.25s2.8-6.25 6.25-6.25c1.59 0 3.03.67 4.13 1.77l2.65-2.65C17.12 4.06 14.67 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.75-3.65 8.75-8.87 0-.35-.03-.69-.1-1.03z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account?</span>{' '}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
} 