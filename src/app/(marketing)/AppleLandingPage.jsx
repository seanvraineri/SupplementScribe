'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import components for performance
const FloatingSupplementVisual = dynamic(() => import('../../components/apple/FloatingSupplementVisual'), { ssr: false });
const GeneticAnalysisVisual = dynamic(() => import('../../components/premium/GeneticAnalysisVisual'), { ssr: false });

// Navigation Component with frosted glass effect
const Navigation = () => {
  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(10, 16, 31, 0.8)']
  );
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{ backgroundColor: navBackground, backdropFilter: 'blur(10px)' }}
    >
      <Link href="/" className="text-white text-xl font-semibold tracking-tight">
        SupplementScribe
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <div className="flex items-center space-x-8">
          <Link href="#features" className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
            Features
          </Link>
          <Link href="#genetic" className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
            Genetic Testing
          </Link>
          <Link href="#pricing" className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
            Pricing
          </Link>
          <Link href="#science" className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
            Our Science
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-white text-sm font-medium hover:text-blue-400 transition-colors">
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 bg-gradient-to-b from-[#0a101f] to-[#070b17] shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4 p-6">
              <Link 
                href="#features" 
                className="text-white text-sm font-medium hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#genetic" 
                className="text-white text-sm font-medium hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Genetic Testing
              </Link>
              <Link 
                href="#pricing" 
                className="text-white text-sm font-medium hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="#science" 
                className="text-white text-sm font-medium hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Science
              </Link>
              <div className="border-t border-gray-800 pt-4 mt-2">
                <Link 
                  href="/login" 
                  className="text-white text-sm font-medium hover:text-blue-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className="block mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Dashboard Preview Component with Mac-style frame
const DashboardPreview = () => {
  return (
    <motion.div
      className="relative mx-auto max-w-4xl"
      initial={{ opacity: 0, rotateY: 10 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Mac-style frame */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        {/* Browser chrome */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 h-8 rounded-t-2xl flex items-center px-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="mx-auto bg-gray-800 rounded-full px-4 py-1 text-xs text-gray-400">supplementscribe.com</div>
        </div>
        
        {/* Dashboard Content */}
        <div className="bg-[#0a101f] p-6 rounded-b-2xl border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Health Score Widget */}
            <div className="bg-[#0f172a] rounded-lg p-5 border border-blue-900/20 shadow-lg">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-white mb-1">Your Health Score</h3>
                <p className="text-sm text-blue-400">Updated today</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">86</div>
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="#1E293B" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="none" 
                      stroke="url(#scoreGradient)" 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="35.2" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="flex items-center text-green-400">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                    <span className="font-medium">+4 points</span>
                  </div>
                  <p className="text-gray-400 text-sm">from last week</p>
                </div>
              </div>
            </div>
            
            {/* Genetic Analysis Widget */}
            <div className="flex flex-col bg-[#0f172a] rounded-lg overflow-hidden border border-blue-900/20 shadow-lg">
              <div className="p-4 border-b border-blue-900/20 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Genetic Analysis</h3>
                  <p className="text-sm text-blue-400">Based on your profile</p>
                </div>
              </div>
              
              <div className="h-[200px]">
                <GeneticAnalysisVisual />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Landing Page Component
export default function AppleLandingPage() {
  const { scrollY } = useScroll();
  
  // Parallax effect for background layers
  const layer1Y = useTransform(scrollY, [0, 1000], ['0%', '30%']);
  const layer2Y = useTransform(scrollY, [0, 1000], ['0%', '20%']);
  const layer3Y = useTransform(scrollY, [0, 1000], ['0%', '10%']);
  
  // Hero section animation effects
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const heroRotateX = useTransform(scrollY, [0, 300], [0, -5]);
  
  useEffect(() => {
    // Apply background to body
    document.body.classList.add('bg-[#070b17]');
    
    return () => {
      document.body.classList.remove('bg-[#070b17]');
    };
  }, []);
  
  return (
    <div className="min-h-screen overflow-x-hidden text-white">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen pt-32 pb-20 overflow-hidden"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          rotateX: heroRotateX,
          transformPerspective: "1000px",
          transformOrigin: "center top"
        }}
      >
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-0 left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-800/30 to-indigo-900/20 blur-[120px]" 
          style={{ y: layer1Y }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-800/20 to-teal-900/10 blur-[100px]" 
          style={{ y: layer2Y }}
        />
        <motion.div 
          className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-violet-900/20 to-purple-900/30 blur-[100px]" 
          style={{ y: layer3Y }}
        />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-16 md:py-24">
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
                Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">intelligent</span> supplement advisor
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-100 mb-8 max-w-xl leading-relaxed"
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
                <Link href="/signup" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium tracking-wide shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-105 transition-all">
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
              <FloatingSupplementVisual />
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
      
      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a101f] to-[#0f172a] opacity-90"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Features that Transform Your Health
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#131c31] p-8 rounded-xl shadow-xl border border-blue-900/20"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 text-white">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant, Personalized Plans</h3>
              <p className="text-gray-300">Get your custom supplement protocol in under 60 seconds based on your unique health profile.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#131c31] p-8 rounded-xl shadow-xl border border-blue-900/20"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 text-white">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Compatible with All Major DNA Tests</h3>
              <p className="text-gray-300">Transform genetic data from 23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA, and more into personalized supplement recommendations.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#131c31] p-8 rounded-xl shadow-xl border border-blue-900/20"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 mb-6 text-white">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">PubMed-Powered Proof</h3>
              <p className="text-gray-300">Every recommendation is backed by peer-reviewed research with direct links to the scientific studies.</p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#131c31] p-8 rounded-xl shadow-xl border border-blue-900/20"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 mb-6 text-white">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-300">Our advanced algorithm analyzes key genetic markers and correlates them with hundreds of peer-reviewed research studies in our database.</p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-[#131c31] p-8 rounded-xl shadow-xl border border-blue-900/20"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 mb-6 text-white">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 14l2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Safe Interaction Checker</h3>
              <p className="text-gray-300">Real-time safety checks against your medications, health conditions, and between supplements to prevent harmful interactions.</p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-[#131c31] p-8 rounded-xl shadow-xl border border-blue-900/20"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 mb-6 text-white">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Adaptive Recommendations</h3>
              <p className="text-gray-300">Your supplement plan evolves as you track progress, with monthly updates based on your changing health metrics and goals.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Dashboard Preview Section */}
      <section id="dashboard-preview" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#0a101f] opacity-80"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
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
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
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
      
      {/* Genetic Testing Section */}
      <section id="genetic" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a101f] to-[#131c31] opacity-90"></div>
        
        {/* DNA helix animated background element */}
        <div className="absolute opacity-10 inset-0 overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            {[...Array(10)].map((_, i) => (
              <motion.path
                key={i}
                d={`M${10 + i * 8},0 Q${15 + i * 8},50 ${10 + i * 8},100`}
                stroke="url(#dnaGradient)"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 0.6,
                  transition: { 
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }
                }}
              />
            ))}
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Unlock Your Genetic Potential
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your DNA holds the blueprint to your optimal supplement regimen
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Why Genetic Testing Changes Everything</h3>
              
              <ul className="space-y-6">
                {[
                  {
                    title: "Your supplements should match your genes",
                    description: "Many genetic variants directly impact how you metabolize and utilize supplements. Taking supplements without considering your genetic profile may reduce their effectiveness.",
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    )
                  },
                  {
                    title: "What you're missing without genetic data",
                    description: "Research suggests many people take supplements that may not be optimal for their genetic makeup, while missing ones that could provide significant benefits based on their profile.",
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                    )
                  },
                  {
                    title: "How your genes affect absorption",
                    description: "Genes like MTHFR, VDR, and COMT can influence how effectively your body utilizes common supplements like B vitamins, vitamin D, and magnesium.",
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                    )
                  }
                ].map((item, index) => (
                  <li key={index} className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <p className="mt-2 text-gray-300">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#131c31] rounded-xl shadow-xl border border-blue-900/30 overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">How to Get Started with Genetic Testing</h3>
                
                <div className="space-y-6 mb-8">
                  {[
                    {
                      title: "Use Your Existing DNA Test Results",
                      description: "Already have genetic data? We support all major testing services including 23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA, Living DNA, and more.",
                      icon: "↗️"
                    },
                    {
                      title: "Order a New DNA Test Kit",
                      description: "Don't have genetic data yet? We partner with leading testing companies to get you special discounts on test kits from various providers.",
                      icon: "📦"
                    },
                    {
                      title: "Upload Your Lab Results",
                      description: "Have recent blood work? Upload your lab results for even more personalized recommendations that factor in your current health status.",
                      icon: "📋"
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-2xl">
                        {step.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                        <p className="mt-1 text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg"
                >
                  <div className="flex items-start mb-4">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4l4 2"></path>
                    </svg>
                    <div className="ml-4">
                      <h5 className="text-xl font-bold text-white">Universal Compatibility</h5>
                      <p className="text-blue-100 mt-1">Our platform works with all major DNA testing services, giving you flexibility and choice.</p>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-blue-100 mb-3">Upload your genetic data from any provider and get your personalized supplement plan in under 60 seconds.</p>
                    <Link 
                      href="/signup" 
                      className="block w-full py-3 text-center rounded-lg bg-white text-indigo-600 font-medium shadow-lg hover:shadow-white/30 hover:translate-y-[-2px] transition-all"
                    >
                      Upload Your Data Now
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a101f] to-[#131c31] opacity-90"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              No hidden fees. No confusing tiers. Just one flat price.
            </motion.p>
          </div>
          
          {/* Pricing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-[#1a2236] p-1 rounded-full shadow-inner">
              <button className="py-2 px-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium">
                Monthly
              </button>
              <button className="py-2 px-6 rounded-full text-gray-300 text-sm font-medium">
                Yearly <span className="text-xs ml-1 text-green-400 font-bold">Save 20%</span>
              </button>
            </div>
          </div>
          
          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto bg-[#131c31] rounded-xl shadow-xl border border-blue-900/30 overflow-hidden"
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">Premium Plan</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">$24.99</span>
                  <span className="text-gray-400 ml-2">/ month</span>
                </div>
                <div className="text-sm text-indigo-300 mt-1">or $199.99 billed yearly</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Personalized supplement recommendations",
                  "Unlimited health data uploads",
                  "Integration with 23andMe & lab results",
                  "Monthly supplement plan updates",
                  "Interaction & safety checks",
                  "PubMed citations & research links",
                  "Priority customer support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/signup" 
                className="block w-full py-3 text-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:translate-y-[-2px] transition-all"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Why SupplementScribe Section */}
      <section id="science" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#131c31] to-[#0a101f] opacity-90"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why SupplementScribe Beats the Alternatives
            </motion.h2>
          </div>
          
          {/* Comparison Table */}
          <div className="overflow-x-auto mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="min-w-[800px]"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-white bg-[#1e293b] rounded-tl-lg"></th>
                    <th className="p-4 text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                      <span className="block text-lg font-bold">SupplementScribe</span>
                    </th>
                    <th className="p-4 text-center text-gray-300 bg-[#1e293b]">
                      <span className="block text-lg font-medium">ChatGPT Alone</span>
                    </th>
                    <th className="p-4 text-center text-gray-300 bg-[#1e293b]">
                      <span className="block text-lg font-medium">Standard Genetic Test</span>
                    </th>
                    <th className="p-4 text-center text-gray-300 bg-[#1e293b] rounded-tr-lg">
                      <span className="block text-lg font-medium">Greens Powder</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Uses your 23andMe + labs", 
                      supplementScribe: true,
                      chatGPT: "Limited",
                      geneticTest: "✕ (new kit req'd)",
                      greensPowder: false
                    },
                    {
                      feature: "Plan delivered in <60s", 
                      supplementScribe: true,
                      chatGPT: "✓ (general advice)",
                      geneticTest: "✕ (typically days)",
                      greensPowder: false
                    },
                    {
                      feature: "PubMed citations & clickable links", 
                      supplementScribe: true,
                      chatGPT: "Limited",
                      geneticTest: "Limited",
                      greensPowder: false
                    },
                    {
                      feature: "Interaction & safety checks", 
                      supplementScribe: true,
                      chatGPT: "General only",
                      geneticTest: "✕ (manual)",
                      greensPowder: false
                    },
                    {
                      feature: "Brand-agnostic product links", 
                      supplementScribe: true,
                      chatGPT: false,
                      geneticTest: "Varies",
                      greensPowder: false
                    },
                    {
                      feature: "Flat $24.99/mo or $199.99/yr", 
                      supplementScribe: true,
                      chatGPT: "✕ (subscription)",
                      geneticTest: "✕ (one-time fee)",
                      greensPowder: "✕ (ongoing)"
                    },
                    {
                      feature: "Privacy & data protection", 
                      supplementScribe: true,
                      chatGPT: "Varies",
                      geneticTest: "Varies",
                      greensPowder: "N/A"
                    }
                  ].map((row, index, rows) => (
                    <tr key={index} className={index === rows.length - 1 ? "border-b border-blue-900/20" : "border-b border-blue-900/20"}>
                      <td className="p-4 text-left text-gray-300 bg-[#1a2236]">{row.feature}</td>
                      <td className="p-4 text-center bg-[#172036] text-green-400 font-bold">
                        {typeof row.supplementScribe === 'boolean' 
                          ? (row.supplementScribe ? "✓" : "✕") 
                          : row.supplementScribe}
                      </td>
                      <td className="p-4 text-center bg-[#1a2236] text-gray-400">
                        {typeof row.chatGPT === 'boolean' 
                          ? (row.chatGPT ? "✓" : "✕") 
                          : row.chatGPT}
                      </td>
                      <td className="p-4 text-center bg-[#1a2236] text-gray-400">
                        {typeof row.geneticTest === 'boolean' 
                          ? (row.geneticTest ? "✓" : "✕") 
                          : row.geneticTest}
                      </td>
                      <td className="p-4 text-center bg-[#1a2236] text-gray-400">
                        {typeof row.greensPowder === 'boolean' 
                          ? (row.greensPowder ? "✓" : "✕") 
                          : row.greensPowder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
          
          {/* Call-out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-xl text-gray-300 mb-8">Ready to trade guesswork for evidence? Get your personalized plan in under 60 seconds.</p>
            <Link 
              href="/signup" 
              className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:translate-y-[-2px] transition-all"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
