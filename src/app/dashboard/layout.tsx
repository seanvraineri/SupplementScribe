'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  
  // Check user authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client not available");
          router.replace('/reset-auth');
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          router.replace('/reset-auth');
          return;
        }
        
        const session = data.session;
        console.log("Dashboard layout auth check:", session ? "Authenticated" : "Not authenticated");
        
        if (!session) {
          console.log("No session found, redirecting to login");
          router.replace('/login');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Provide a recovery path to reset auth
        router.replace('/reset-auth');
      }
    };
    
    checkAuth();
    
    // Also set up subscription for auth changes with error handling
    try {
      if (!supabase) {
        console.error("Supabase client not available for auth subscription");
        return;
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event: string, session: any) => {
          console.log("Auth state changed:", event);
          
          if (event === 'SIGNED_OUT') {
            router.replace('/login');
          }
        }
      );
      
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      return () => {}; // Empty cleanup
    }
  }, [router, supabase]);
  
  // Check for dark mode preference on client-side
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex flex-col md:flex-row overflow-hidden relative">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-white dark:bg-gray-900 shadow dark:shadow-gray-800 p-4 sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image 
              src="/images/logo-colorful.svg" 
              width={40} 
              height={40} 
              alt="SupplementScribe Logo" 
              priority
              className="hover:scale-105 transition-transform"
            />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">SupplementScribe</span>
        </div>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Dashboard Sidebar - Adjusted for Mobile */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 frost-panel transform transition-transform duration-300 ease-in-out 
                  ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                  md:relative md:translate-x-0 md:flex-shrink-0 md:shadow-lg md:z-20 md:border-r border-gray-200 dark:border-gray-800`}
      >
        <div className="sticky top-0 p-6 h-full overflow-y-auto">
          {/* Sidebar Header with logo */}
          <div className="hidden md:flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image 
                src="/images/logo-colorful.svg" 
                width={40} 
                height={40} 
                alt="SupplementScribe Logo" 
                priority
                className="hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">SupplementScribe</span>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                JS
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">John Smith</h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Premium Plan</span>
                  <div className="ml-1.5 h-3 w-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse-slow"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Updated Nav links to close mobile sidebar on click */}
          <nav className="space-y-1">
            {[ // Array for easier mapping
              { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { href: "/dashboard/chat", label: "AI Assistant", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
              { href: "/dashboard/supplements", label: "My Supplements", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { href: "/dashboard/interactions", label: "Interactions", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
              { href: "/dashboard/refer", label: "Refer a Friend", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { href: "/dashboard/health-data", label: "Health Data", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { href: "/dashboard/tracking", label: "Tracking", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
              { href: "/dashboard/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsMobileSidebarOpen(false)} // Close sidebar on click
                className={`w-full flex items-center space-x-2 p-2.5 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
                           ${item.href === '/dashboard' && index === 0 ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : ''}`}
              >
                <svg className={`w-5 h-5 flex-shrink-0 ${item.href === '/dashboard' && index === 0 ? 'text-primary-600 dark:text-primary-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-10">
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100/30 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-primary-200/30 dark:border-gray-700">
              <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2">Need Help?</h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">Contact our support team or chat with our AI assistant.</p>
              <Link 
                href="/dashboard/chat" 
                onClick={() => setIsMobileSidebarOpen(false)} // Close sidebar on click
                className="text-xs px-3 py-1.5 bg-primary-600 dark:bg-primary-700 text-white rounded-lg inline-block hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main Content Area with Beautiful Background */}
      {/* Added pt for mobile header space */}
      <div className="flex-1 relative overflow-hidden overflow-y-auto h-screen md:pt-0 pt-[72px]">
        {/* Global Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 z-0"></div>
        
        {/* Premium animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient blobs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100/30 dark:bg-blue-900/20 blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob"></div>
          <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-purple-100/30 dark:bg-purple-900/20 blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-1/4 w-96 h-96 rounded-full bg-amber-100/30 dark:bg-amber-900/20 blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-4000"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 dashboard-grid-bg opacity-[0.3] dark:opacity-[0.05]"></div>
          
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 dashboard-dot-pattern opacity-[0.2] dark:opacity-[0.03]"></div>
          
          {/* Linear gradient top to bottom overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-950/80"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 opacity-70 animate-pulse-slow">
          <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M165.963 37.3064C182.373 60.5484 192.889 87.9355 181.996 108.839C171.103 129.742 138.799 144.161 110.537 149.995C82.2758 155.829 58.0572 153.077 36.8413 138.742C15.6253 124.408 -2.58534 98.4909 0.378318 73.6128C3.34197 48.7347 27.4891 24.8954 54.0894 14.0162C80.6897 3.13702 109.743 5.21773 133.707 13.9871C157.672 22.7565 176.546 38.2147 176.048 44.8584C175.55 51.5022 155.678 49.3323 135.786 59.8162C115.893 70.3001 95.9812 93.4378 90.7977 111.387C85.6143 129.336 95.1594 142.096 112.171 145.856C129.183 149.616 153.663 144.376 165.963 127.75C178.264 111.124 178.384 83.1118 165.963 64.0643C153.542 45.0168 128.581 34.934 114.147 34.3097C99.7133 33.6855 95.8051 42.5198 95.8051 48.1057C95.8051 53.6916 99.7133 56.0293 105.611 55.9647C111.51 55.9 119.399 53.4331 122.335 37.5148C125.272 21.5965 123.256 -7.73005 107.124 -13.8022C90.9913 -19.8743 60.7418 -2.70031 47.1916 17.3392C33.6413 37.3787 36.7904 60.2837 36.7904 67.7629C36.7904 75.2421 33.6413 67.2951 30.4921 39.0803C27.3429 10.8655 48.9972 -12.2935 64.7101 -16.7123C80.423 -21.1311 112.091 -16.7123 132.509 1.97018C152.926 20.6527 165.963 25.9684 165.963 37.3064Z" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="100" y1="0" x2="100" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d1d5db"/>
                <stop offset="1" stopColor="#9ca3af"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="absolute bottom-40 left-20 opacity-60 animate-pulse-slow">
          <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="url(#paint1_radial)"/>
            <defs>
              <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) rotate(90) scale(80)">
                <stop stopColor="#d1d5db"/>
                <stop offset="1" stopColor="#9ca3af" stopOpacity="0.6"/>
              </radialGradient>
            </defs>
          </svg>
        </div>
        
        {/* Subtle floating particles */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-primary-300/40 dark:bg-primary-600/30 animate-pulse-slow" style={{ animationDuration: '7s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-300/40 dark:bg-amber-600/30 animate-pulse-slow" style={{ animationDuration: '8s', animationDelay: '1.2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-purple-300/40 dark:bg-purple-600/30 animate-pulse-slow" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
        
        {/* Shimmer effect line */}
        <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/20 dark:via-primary-600/20 to-transparent animate-shimmer"></div>
        <div className="absolute bottom-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/10 dark:via-primary-600/10 to-transparent animate-shimmer" style={{ animationDelay: '1s' }}></div>
        
        {/* Content goes here, with z-index to appear above the background */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
} 