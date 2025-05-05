'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PrimaryNav from '@/components/ui/PrimaryNav';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would handle the password recovery process
    console.log('Password recovery attempt for:', email);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-300/10 rounded-full blur-3xl"></div>
      </div>

      <PrimaryNav />
      
      <section className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-md mx-auto">
          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
              <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password</p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
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

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow"
                >
                  Send Reset Link
                </button>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
                    Back to Log In
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  If there's an account associated with {email}, we've sent instructions for resetting your password.
                </p>
                <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
                  Back to Log In
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
} 