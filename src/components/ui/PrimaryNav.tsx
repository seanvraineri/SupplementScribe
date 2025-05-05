'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PrimaryNav() {
  const [solid, setSolid] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const router = useRouter();
  
  // Force loading to end after a timeout
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setLoadingTimedOut(true);
      }, 1500);
      
      return () => clearTimeout(timeout);
    } else {
      setLoadingTimedOut(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate whether to show loading state
  const showLoading = isLoading && !loadingTimedOut;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      solid ? "apple-glass backdrop-blur-lg shadow-sm" : "bg-transparent"
    )}>
      <div className="apple-container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and text on the left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center mr-2">
                <Image 
                  src="/images/logo-colorful.svg" 
                  width={40} 
                  height={40} 
                  alt="SupplementScribe Logo" 
                  priority
                  className="hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-lg font-semibold text-apple-black dark:text-white hidden sm:inline-block">
                SupplementScribe
              </span>
            </Link>
          </motion.div>

          {/* Centered navigation links with Apple styling */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex flex-1 justify-center"
          >
            <div className="flex space-x-12">
              <Link 
                href="/features" 
                className="text-apple-black dark:text-white hover:text-apple-blue dark:hover:text-apple-blue-light transition-colors font-medium"
              >
                Features
              </Link>
              <Link 
                href="/genetic-testing-guide" 
                className="text-apple-black dark:text-white hover:text-apple-blue dark:hover:text-apple-blue-light transition-colors font-medium"
              >
                Genetic Testing
              </Link>
              <Link 
                href="/pricing" 
                className="text-apple-black dark:text-white hover:text-apple-blue dark:hover:text-apple-blue-light transition-colors font-medium"
              >
                Pricing
              </Link>
              <Link 
                href="/science" 
                className="text-apple-black dark:text-white hover:text-apple-blue dark:hover:text-apple-blue-light transition-colors font-medium"
              >
                Our Science
              </Link>
            </div>
          </motion.nav>

          {/* CTA buttons with Apple styling */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4 flex-shrink-0"
          >
            {showLoading ? (
              <div className="w-8 h-8 rounded-full border-2 border-apple-blue border-t-transparent animate-spin"></div>
            ) : user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="apple-button-small text-apple-black dark:text-white hover:text-apple-blue dark:hover:text-apple-blue-light transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="apple-button-small apple-button-secondary"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-apple-black dark:text-white hover:text-apple-blue dark:hover:text-apple-blue-light transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link 
                  href="/onboarding" 
                  className="apple-button-small"
                >
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
} 