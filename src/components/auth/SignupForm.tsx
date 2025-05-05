'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function SignupForm({ redirectPath = '/dashboard' }: { redirectPath?: string }) {
  const { isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleSignUp = async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      setError(null);
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      
      if (error) throw error;
      
      setSuccess('Initiating Google sign up...');
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      if (!supabase) {
        setError('Supabase client not available. This might be due to authentication issues. Try resetting your auth state.');
        return;
      }
      
      setError(null);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          emailRedirectTo: `${window.location.origin}${redirectPath}`,
          data: {
            email_confirmed: false
          }
        }
      });
      
      if (error) {
        if (error.message?.includes('email already')) {
          throw new Error('This email is already registered. Please try logging in instead.');
        }
        throw error;
      }
      
      // Check if confirmation is needed
      if (data?.user?.identities?.length === 0 || 
          data?.user?.confirmation_sent_at || 
          data?.user?.email_confirmed_at === null) {
        setSuccess(
          'Registration successful! Please check your email to confirm your account. ' +
          'Check your spam/junk folder if you don\'t see it within a few minutes.'
        );
      } else {
        // User is already confirmed or confirmation not required
        setSuccess('Registration successful! Redirecting...');
        
        // Auto-redirect to dashboard
        router.push(redirectPath);
      }
      
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message || 'Failed to sign up. There might be authentication issues. You can try resetting your auth state.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
        <p className="text-gray-600">Join SupplementScribe for personalized supplement recommendations</p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
          
          {error.includes('Supabase client not available') || error.includes('Failed to sign up') ? (
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

      <form onSubmit={handleSignUp}>
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
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

        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? 'Creating account...' : 'Sign Up'}
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
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M21.35 11.1H12v3.75h5.71c-.54 2.86-2.94 4.15-5.71 4.15-3.45 0-6.25-2.8-6.25-6.25s2.8-6.25 6.25-6.25c1.59 0 3.03.67 4.13 1.77l2.65-2.65C17.12 4.06 14.67 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.75-3.65 8.75-8.87 0-.35-.03-.69-.1-1.03z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{' '}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  );
} 