'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import components to improve page load time
const FeaturesSection = dynamic(() => import('../../components/premium/FeaturesSection'), { ssr: false });
const GeneticAnalysisVisual = dynamic(() => import('../../components/premium/GeneticAnalysisVisual'), { ssr: false });

// 3D Floating Supplement Icon Component
const FloatingSupplementIcons = () => {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '20%', left: '20%' }}
      />
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 shadow-xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        style={{ top: '40%', left: '50%' }}
      />
      <motion.div
        className="absolute w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-green-500 shadow-xl"
        animate={{
          y: [0, -10, 0],
          x: [0, -5, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{ top: '70%', left: '30%' }}
      />
      <motion.div
        className="absolute w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-xl"
        animate={{
          y: [0, 12, 0],
          x: [0, 8, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        style={{ top: '60%', left: '60%' }}
      />
    </div>
  );
};

// Dashboard Preview Component
const DashboardPreview = () => {
  return (
    <motion.div
      className="relative mx-auto max-w-3xl overflow-hidden rounded-xl shadow-2xl"
      initial={{ opacity: 0, rotateY: 10 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
    >
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-7 rounded-t-xl flex items-center px-3">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
      </div>
      <div className="bg-[#0a101f] p-6 rounded-b-xl border border-blue-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="mb-3">
              <h3 className="text-lg font-semibold tracking-tight text-white">Your Health Score</h3>
              <p className="text-sm text-blue-400 tracking-wide">Updated today</p>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 relative w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">86</div>
                <svg className="w-20 h-20" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#E5E7EB" 
                    strokeWidth="8" 
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="8" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="35.2" 
                    strokeLinecap="round" 
                    transform="rotate(-90 50 50)" 
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-1">+2</span>
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v3H7a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">From last week</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 bg-[#0f172a] rounded-lg overflow-hidden border border-blue-900/20">
            <div className="p-4 border-b border-blue-900/20 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Genetic Analysis</h3>
                <p className="text-sm text-blue-400">Interactive visualization</p>
              </div>
              <motion.button 
                className="px-3 py-1.5 text-xs font-medium bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
              >
                Full Report
              </motion.button>
            </div>
            
            <div className="h-[350px] p-1">
              <GeneticAnalysisVisual />
            </div>
            
            <div className="p-4 bg-[#0a101f]">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-medium text-white">Personalized Recommendations</div>
                <div className="text-xs text-blue-400">Based on genetic data</div>
              </div>
              
              <ul className="space-y-3">
                <motion.li 
                  className="flex justify-between items-start p-2 rounded bg-blue-900/10 border border-blue-900/20"
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                >
                  <div>
                    <div className="font-medium text-white">Methylfolate (1,000 mcg)</div>
                    <div className="text-xs text-blue-300">MTHFR variant detected</div>
                  </div>
                  <div className="text-emerald-400 font-medium text-sm flex items-center">
                    <span className="mr-1 text-xs">★</span> Top Priority
                  </div>
                </motion.li>
                <motion.li 
                  className="flex justify-between items-start p-2 rounded bg-blue-900/10 border border-blue-900/20"
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                >
                  <div>
                    <div className="font-medium text-white">Omega-3 DHA (1,500mg)</div>
                    <div className="text-xs text-blue-300">APOE variant detected</div>
                  </div>
                  <div className="text-blue-400 font-medium text-sm">Recommended</div>
                </motion.li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Navigation Component
const Navigation = () => {
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
  );
  const navShadow = useTransform(
    scrollY, 
    [0, 100], 
    ["0 0 0 rgba(0, 0, 0, 0)", "0 4px 20px rgba(0, 0, 0, 0.1)"]
  );
  const navBlur = useTransform(
    scrollY, 
    [0, 100], 
    ["blur(0px)", "blur(10px)"]
  );
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:py-5 md:px-10"
      style={{ 
        backgroundColor: navBg, 
        boxShadow: navShadow,
        backdropFilter: navBlur,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            SupplementScribe
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-white font-medium text-sm tracking-wide hover:text-blue-200 transition-colors">Features</Link>
          <Link href="/genetic-testing" className="text-white font-medium text-sm tracking-wide hover:text-blue-200 transition-colors">Genetic Testing</Link>
          <Link href="/pricing" className="text-white font-medium text-sm tracking-wide hover:text-blue-200 transition-colors">Pricing</Link>
          <Link href="/science" className="text-white font-medium text-sm tracking-wide hover:text-blue-200 transition-colors">Our Science</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="text-white font-medium text-sm tracking-wide hover:text-blue-200 transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-medium text-sm tracking-wide hover:bg-white/30 transition-all">
            Get Started
          </Link>
        </div>
        
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg rounded-b-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4">
              <Link href="/features" className="text-gray-800 font-medium text-sm tracking-wide hover:text-blue-600 transition-colors">Features</Link>
              <Link href="/genetic-testing" className="text-gray-800 font-medium text-sm tracking-wide hover:text-blue-600 transition-colors">Genetic Testing</Link>
              <Link href="/pricing" className="text-gray-800 font-medium text-sm tracking-wide hover:text-blue-600 transition-colors">Pricing</Link>
              <Link href="/science" className="text-gray-800 font-medium text-sm tracking-wide hover:text-blue-600 transition-colors">Our Science</Link>
              <div className="border-t border-gray-100 pt-4 mt-2">
                <Link href="/login" className="block text-gray-800 font-medium text-sm tracking-wide hover:text-blue-600 transition-colors mb-4">
                  Log In
                </Link>
                <Link href="/signup" className="block w-full py-2 text-center rounded-full bg-blue-600 text-white font-medium text-sm tracking-wide hover:bg-blue-700 hover:shadow-md transition-all">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Main Landing Page Component with consistent premium theming
export default function LandingPage() {
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(10, 16, 31, 0)", "rgba(10, 16, 31, 0.8)"]
  );
  
  // Parallax effect for background layers
  const layer1Y = useTransform(scrollY, [0, 800], ['0%', '30%']);
  const layer2Y = useTransform(scrollY, [0, 800], ['0%', '20%']);
  const layer3Y = useTransform(scrollY, [0, 800], ['0%', '10%']);
  
  const layer1Opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const layer2Opacity = useTransform(scrollY, [0, 600], [1, 0]);
  
  // Angle effect on hero section
  const heroRotateX = useTransform(scrollY, [0, 200], [0, -5]);
  const heroScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  
  useEffect(() => {
    // Add body background color
    document.body.classList.add('bg-gray-50');
    
    // Cleanup function
    return () => {
      document.body.classList.remove('bg-gray-50');
    };
  }, []);
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* 3D Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-grad-start via-grad-mid to-grad-end"
          style={{ y: layer1Y, opacity: layer1Opacity }}
          animate={{ 
            background: [
              'linear-gradient(135deg, #6B46C1, #2C5282, #319795)',
              'linear-gradient(135deg, #4A1D96, #1E40AF, #0E7490)',
              'linear-gradient(135deg, #6B46C1, #2C5282, #319795)'
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-purple-800/30 to-transparent"
          style={{ y: layer2Y, opacity: layer2Opacity }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"
          style={{ y: layer3Y }}
        />
      </div>
      
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center pt-20"
        style={{
          rotateX: heroRotateX,
          scale: heroScale,
          opacity: heroOpacity,
          transformPerspective: "1000px"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-yellow-200">intelligent</span> supplement advisor
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-100 mb-8 max-w-xl font-normal leading-relaxed tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                AI-powered recommendations tailored to your unique biology and health goals.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/signup" className="px-8 py-4 rounded-full bg-blue-600 text-white text-sm font-medium tracking-wide shadow-md shadow-blue-500/30 hover:bg-blue-500 hover:shadow-blue-500/50 hover:scale-105 transition-all">
                  Get Started
                </Link>
                <Link href="/learn-more" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur text-white text-sm font-medium tracking-wide border border-white/30 hover:bg-white/20 transition-all">
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="hidden md:block h-[400px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <FloatingSupplementIcons />
            </motion.div>
          </div>
        </div>
        
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.section>
      
      {/* Dashboard Preview Section with dark premium theme */}
      <section className="relative py-20 bg-gradient-to-b from-[#060c18] to-[#0a101f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Your personalized health dashboard
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 font-normal leading-relaxed tracking-wide max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get a clear picture of your supplement regimen and track your progress.
            </motion.p>
          </div>
          
          <DashboardPreview />
        </div>
      </section>
    </div>
  );
}
