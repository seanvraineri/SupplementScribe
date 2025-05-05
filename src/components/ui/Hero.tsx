'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function OptimizedHero() {
  // Use state to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBFD] overflow-hidden relative">
      {/* Simplified gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-80"></div>
      
      {/* Reduced number of animated elements */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 uppercase tracking-wide"
        >
          Introducing SupplementScribe
        </motion.span>
      
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-5"
        >
          Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">intelligent</span> supplement advisor
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10"
        >
          AI-powered recommendations tailored to your unique biology and health goals.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-4 mb-16"
        >
          <Link
            href="/onboarding"
            className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-purple-600 px-8 text-base font-medium text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-600/30"
          >
            Get Started
          </Link>
          
          <Link
            href="#learn-more"
            className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-full bg-white px-8 text-base font-medium text-gray-800 shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-gray-300"
          >
            Learn more
          </Link>
        </motion.div>
        
        {/* Optimized dashboard visualization */}
        {isMounted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto"
          >
            <div className="relative w-full max-w-5xl mx-auto h-[450px] flex items-center justify-center">
              {/* Browser frame with dashboard */}
              <div className="relative z-30 w-[900px] max-w-full h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="h-10 w-full bg-gray-100 border-b border-gray-200 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto flex items-center px-16 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-600 w-[400px] space-x-2">
                    <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16a5 5 0 01-.916-9.916 5.002 5.002 0 019.832 0A5.002 5.002 0 0116 16m-7-5a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <span>supplementscribe.com/dashboard</span>
                  </div>
                </div>
                
                {/* Dashboard content - using Image component for optimization */}
                <div className="relative w-full h-[460px]">
                  <Image
                    src="/images/dashboard-preview.webp"
                    alt="SupplementScribe Dashboard"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 900px"
                    quality={85}
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Simplified decorative elements - reduced number and complexity */}
              <div className="absolute left-1/2 -translate-x-[500px] top-1/2 -translate-y-[120px] z-20">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="absolute right-1/2 translate-x-[480px] top-1/2 translate-y-[100px] z-20">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
