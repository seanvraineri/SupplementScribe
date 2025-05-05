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
                  {/* Dashboard mockup based on the actual dashboard design */}
                  <div className="w-full h-full bg-white overflow-hidden">
                    {/* Dashboard header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                      <div>
                        <h3 className="text-xl font-semibold">Welcome back, Sarah</h3>
                        <p className="text-sm opacity-90">Your wellness score is improving!</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-sm">S</div>
                      </div>
                    </div>
                    
                    {/* Dashboard content based on actual dashboard design */}
                    <div className="p-5 grid grid-cols-12 gap-5">
                      {/* Health score widget */}
                      <div className="col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">Health Score</h4>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+2.5%</span>
                        </div>
                        <div className="flex items-center justify-center py-3">
                          <div className="relative h-32 w-32">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">84</div>
                                <div className="text-xs text-gray-500">Good</div>
                              </div>
                            </div>
                            <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 100 100">
                              <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                              <circle className="text-indigo-600" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="40" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Supplements widget */}
                      <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">Today's Supplements</h4>
                          <button className="text-xs text-indigo-600 hover:text-indigo-800">View All</button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center p-2 bg-green-50 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-lg mr-3">☀️</div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h5 className="font-medium text-gray-800">Vitamin D3</h5>
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Taken</span>
                              </div>
                              <p className="text-xs text-gray-500">2000 IU - With breakfast</p>
                            </div>
                          </div>
                          <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg mr-3">🐟</div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h5 className="font-medium text-gray-800">Omega-3 Fish Oil</h5>
                                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">Pending</span>
                              </div>
                              <p className="text-xs text-gray-500">1000mg - With dinner</p>
                            </div>
                          </div>
                          <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-lg mr-3">🧠</div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h5 className="font-medium text-gray-800">Magnesium Glycinate</h5>
                                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">Pending</span>
                              </div>
                              <p className="text-xs text-gray-500">400mg - Before bed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent updates section */}
                      <div className="col-span-12 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">Recent Updates</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="relative pl-6 border-l-2 border-gray-200">
                            <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                              <span className="text-xs">📈</span>
                            </div>
                            <div className="mb-1">
                              <h5 className="font-medium text-gray-900">Health score updated</h5>
                              <p className="text-gray-600 text-sm">Your health score has improved since you started taking Vitamin D3 regularly.</p>
                            </div>
                            <span className="text-gray-400 text-xs">2 days ago</span>
                          </div>
                          
                          <div className="relative pl-6 border-l-2 border-gray-200">
                            <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                              <span className="text-xs">💊</span>
                            </div>
                            <div className="mb-1">
                              <h5 className="font-medium text-gray-900">New supplement recommended</h5>
                              <p className="text-gray-600 text-sm">Based on your recent blood work, we've added Vitamin K2 to your supplement protocol.</p>
                            </div>
                            <span className="text-gray-400 text-xs">4 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
