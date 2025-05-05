'use client';

import { motion } from 'framer-motion';
import PrimaryNav from '@/components/ui/PrimaryNav';
import SignupForm from '@/components/auth/SignupForm';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const supabase = createClient();
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client not available");
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }
        
        const session = data.session;
        console.log("Signup page auth check:", session ? "Already logged in" : "Not logged in");
        
        if (session) {
          // User is already logged in, redirect to dashboard or requested page
          console.log("Already logged in, redirecting to", redirectPath);
          router.replace(redirectPath);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth on signup page:", error);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router, supabase, redirectPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        >
          <SignupForm redirectPath={redirectPath} />
        </motion.div>
      </section>
    </main>
  );
} 