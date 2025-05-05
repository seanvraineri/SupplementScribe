'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import PrivacyDisclaimer from '@/components/ui/PrivacyDisclaimer';
import SupplementRecommendations from '@/components/reports/SupplementRecommendations';
import { generateSupplementRecommendations, generateWellnessAnalysis } from '@/lib/api-service';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

// Mock data for charts
const healthData = [
  { day: 'Mon', score: 78, adherence: 90, sleep: 7.2 },
  { day: 'Tue', score: 80, adherence: 100, sleep: 7.5 },
  { day: 'Wed', score: 76, adherence: 85, sleep: 6.8 },
  { day: 'Thu', score: 82, adherence: 90, sleep: 7.9 },
  { day: 'Fri', score: 79, adherence: 95, sleep: 7.0 },
  { day: 'Sat', score: 84, adherence: 100, sleep: 8.2 },
  { day: 'Sun', score: 86, adherence: 100, sleep: 8.4 },
];

// Mock genetic data
const geneticData = [
  { id: 1, gene: 'MTHFR', variant: 'C677T', status: 'Heterozygous', significance: 'Moderate', description: 'May affect folate metabolism' },
  { id: 2, gene: 'VDR', variant: 'Taq1', status: 'Homozygous', significance: 'High', description: 'Affects vitamin D metabolism' },
  { id: 3, gene: 'COMT', variant: 'Val158Met', status: 'Normal', significance: 'Low', description: 'Normal dopamine processing' },
  { id: 4, gene: 'APOE', variant: 'ε3/ε4', status: 'Carrier', significance: 'High', description: 'Implications for cardiovascular health' }
];

// Mock supplement data
const supplements = [
  { 
    id: 1, 
    name: 'Vitamin D3', 
    icon: '☀️', 
    iconBg: 'bg-amber-100',
    dose: '2000 IU', 
    timing: 'Daily',
    priority: 'High',
    priorityColor: 'bg-rose-500',
    taken: true,
    description: 'Supports bone health and immune function'
  },
  { 
    id: 2, 
    name: 'Magnesium Glycinate', 
    icon: '🧠', 
    iconBg: 'bg-purple-100',
    dose: '400mg', 
    timing: 'Daily before bed',
    priority: 'Medium',
    priorityColor: 'bg-amber-500',
    taken: true,
    description: 'Supports relaxation, sleep, and muscle recovery'
  },
  { 
    id: 3, 
    name: 'Omega-3 Fish Oil', 
    icon: '🐟', 
    iconBg: 'bg-blue-100',
    dose: '1000mg', 
    timing: 'Daily with meal',
    priority: 'High',
    priorityColor: 'bg-rose-500',
    taken: false,
    description: 'Supports heart and brain health'
  },
  { 
    id: 4, 
    name: 'Zinc', 
    icon: '🛡️', 
    iconBg: 'bg-gray-100',
    dose: '15mg', 
    timing: 'Daily',
    priority: 'Medium',
    priorityColor: 'bg-amber-500',
    taken: false,
    description: 'Supports immune function and wound healing'
  }
];

// Mock updates
const updates = [
  {
    id: 1,
    type: 'health',
    icon: '📈',
    title: 'Health score updated',
    message: 'Your health score has improved since you started taking Vitamin D3 regularly.',
    time: '2 days ago'
  },
  {
    id: 2,
    type: 'recommendation',
    icon: '💊',
    title: 'New supplement recommended',
    message: 'Based on your recent blood work, we\'ve added Vitamin K2 to your supplement protocol.',
    time: '4 days ago'
  },
  {
    id: 3,
    type: 'achievement',
    icon: '🏆',
    title: 'Streak milestone reached',
    message: "You've maintained your supplement routine for 10 days in a row!",
    time: '1 week ago'
  }
];

/**
 * Dashboard - Main dashboard component
 * 
 * Uses React Query for data fetching and proper client-side rendering
 * with optimized loading states and auth handling.
 */
export default function Dashboard() {
  const [greeting, setGreeting] = useState('Good morning');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  
  // Use React Query to fetch profile data
  const { 
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['health-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Try to fetch existing profile
      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      // If no profile exists, create a default one
      if (!data && (error?.code === 'PGRST116' || error?.message?.includes('no rows'))) {
        console.log('No profile found, creating default profile');
        
        // Create a default profile
        const { data: newProfile, error: createError } = await supabase
          .from('health_profiles')
          .insert({
            user_id: user.id,
            age: 30, // Default values
            gender: 'Unspecified',
            wellness_sensitivities: '',
            wellness_considerations: '',
            monthly_budget: 100,
            onboarding_completed: false, // Explicitly mark as not completed
            wellness_disclaimer_accepted: false
          })
          .select('*')
          .single();
          
        if (createError) {
          console.error('Error creating default profile:', createError);
          throw createError;
        }
        
        return newProfile;
      }
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    // Only run this query if the user is authenticated
    enabled: !!user && isAuthenticated,
    // Stale time of 5 minutes - data won't refetch unnecessarily
    staleTime: 5 * 60 * 1000,
    // Retry 3 times if there's an error
    retry: 3,
  });

  // Use React Query to fetch recommendations
  const {
    data: recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations
  } = useQuery({
    queryKey: ['recommendations', profile?.id],
    queryFn: async () => {
      if (!profile || !profile.onboarding_completed) return [];
      
      // Convert profile data to the format expected by the recommendation engine
      const wellnessProfile = {
        id: profile.id,
        user_id: profile.user_id,
        age: profile.age,
        gender: profile.gender,
        wellness_sensitivities: profile.wellness_sensitivities?.split(', ') || [],
        wellness_considerations: profile.wellness_considerations?.split(', ') || [],
        monthly_budget: profile.monthly_budget || 100,
      };
      
      // Generate recommendations using the new API service
      const recs = await generateSupplementRecommendations(wellnessProfile);
      
      // Generate wellness analysis
      const analysis = await generateWellnessAnalysis(wellnessProfile);
      
      // Log the recommendations and analysis for debugging
      console.log('Generated recommendations:', recs);
      console.log('Generated wellness analysis:', analysis);
      
      return recs;
    },
    enabled: !!profile?.onboarding_completed && !!user,
  });

  // Set greeting based on time of day
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!authLoading && !isAuthenticated) {
      console.log('Dashboard: Redirecting unauthenticated user to login');
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);
  
  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping"></div>
            <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping animation-delay-200"></div>
            <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping animation-delay-400"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {authLoading ? 'Verifying your account...' : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    );
  }
  
  // Handle error states
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full">
          <div className="text-amber-500 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2 text-center">Error Loading Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            We encountered an error while loading your data.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700 rounded-md mb-6">
            <p className="font-medium mb-1">Troubleshooting:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your account is working correctly</li>
              <li>We're having trouble accessing your profile data</li>
              <li>This is often resolved by trying again</li>
            </ul>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => refetchProfile()}
              className="flex-1 bg-primary-600 text-white py-2 rounded transition hover:bg-primary-700 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded transition hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // User should be redirected already if not authenticated, but just in case
  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-xl font-semibold mb-4">Authentication Required</h1>
          <p className="mb-4">You must be logged in to view this page.</p>
          <button 
            onClick={() => router.replace('/login')}
            className="w-full bg-primary-600 text-white py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If no profile exists or onboarding is not completed, prompt to complete onboarding
  if (!profile || !profile.onboarding_completed) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-auto"
          >
            <h1 className="text-3xl font-bold mb-4">Complete Your Wellness Profile</h1>
            <p className="text-gray-600 mb-8">
              Let's set up your wellness profile to provide personalized supplement recommendations.
            </p>
            <p className="text-sm text-gray-500 mb-4">For general wellness purposes only. Not medical advice.</p>
            <Link 
              href="/onboarding" 
              className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Complete Onboarding
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Now we're sure user and profile exist, render the dashboard content
  return (
    <div className="relative min-h-screen w-full">
      {/* Premium animated background elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/20 rounded-full blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-24 left-1/4 w-96 h-96 bg-amber-100/30 dark:bg-amber-900/20 rounded-full blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 dashboard-grid-bg opacity-[0.3] dark:opacity-[0.05]"></div>
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 dashboard-dot-pattern opacity-[0.2] dark:opacity-[0.03]"></div>
        
        {/* Linear gradient top to bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-950/80"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {greeting}, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Here's an overview of your health journey</p>
          </motion.div>

          {/* Health Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 glow"
          >
            <div className="dashboard-card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Health Score</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Based on your supplement adherence and metrics</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">+8% this week</span>
                </div>
              </div>
              
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/3 lg:w-1/4 p-2">
                  <div className="flex items-center justify-center flex-col bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 h-full">
                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">86</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm text-center">Current Score</div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 lg:w-3/4 p-2">
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-4 h-full">
                    <div className="flex gap-4 mb-2 text-xs">
                      <button 
                        onClick={() => setSelectedPeriod('week')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'week' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Week
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('month')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'month' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Month
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('year')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'year' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Year
                      </button>
                    </div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={healthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="healthScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="#f5f5f5" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            domain={[70, 100]} 
                            ticks={[70, 80, 90, 100]}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.97)', 
                              borderRadius: '0.5rem',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#healthScore)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Supplement Stack */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="dashboard-card p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Today's Supplements</h2>
                  <Link href="/supplements" className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {supplements.map((supp) => (
                    <motion.div 
                      key={supp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: supp.id * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`${supp.iconBg} flex items-center justify-center h-12 w-12 rounded-lg text-xl mr-4`}>
                          {supp.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{supp.name}</h3>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <span>{supp.dose}</span>
                            <span className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span>{supp.timing}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${supp.priorityColor} bg-opacity-10 text-${supp.priorityColor.split('-')[1]}-800`}>
                            {supp.priority}
                          </div>
                        </div>
                        <button 
                          className={`flex items-center justify-center h-8 w-8 rounded-lg ${
                            supp.taken 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {supp.taken ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button className="w-full py-3 rounded-lg border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    Add Supplement
                  </button>
                </div>
              </div>
              
              {/* Genetic Data Card - Added as a standalone prominent section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="dashboard-card p-6 mt-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Genetic Data</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Personalized insights based on your genetic profile</p>
                  </div>
                  <Link href="/dashboard/health-data" className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Full Report
                  </Link>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 mb-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Your Genetic Profile</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{geneticData.length} genetic markers analyzed</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geneticData.map((item) => (
                      <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              item.significance === 'High' 
                                ? 'bg-rose-500' 
                                : item.significance === 'Moderate'
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                            }`} />
                            <span className="font-medium text-gray-900 dark:text-white">{item.gene}</span>
                          </div>
                          <span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {item.variant}
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.status === 'Homozygous' 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' 
                              : item.status === 'Heterozygous'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : item.status === 'Carrier'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {item.status}
                          </span>
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.significance === 'High' 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' 
                              : item.significance === 'Moderate'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {item.significance} impact
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button className="px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors">
                      View Supplement Recommendations
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="mb-1"><span className="font-medium">Note:</span> Genetic data is used to personalize your supplement recommendations.</p>
                  <p>This information is encrypted and never shared with third parties.</p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Column: Updates */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="dashboard-card p-6 h-full">
                <h2 className="text-xl font-semibold mb-6">Recent Updates</h2>
                
                <div className="space-y-6">
                  {updates.map((update) => (
                    <motion.div 
                      key={update.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: update.id * 0.1 }}
                      className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700"
                    >
                      <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <span className="text-xs">{update.icon}</span>
                      </div>
                      <div className="mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{update.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{update.message}</p>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500 text-xs">{update.time}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Health Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Sleep Quality</div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">7.5</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">hrs/night</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Adherence Rate</div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">92</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Privacy Disclaimer */}
      <div className="mt-8 px-6">
        <PrivacyDisclaimer />
      </div>
    </div>
  );
}

// Component for displaying dashboard content when user is authenticated
function DashboardContent({ user, profile, greeting }: { 
  user: User; 
  profile: any;
  greeting: string;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="relative min-h-screen w-full">
      {/* Premium animated background elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/20 rounded-full blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-24 left-1/4 w-96 h-96 bg-amber-100/30 dark:bg-amber-900/20 rounded-full blur-3xl opacity-70 mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 dashboard-grid-bg opacity-[0.3] dark:opacity-[0.05]"></div>
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 dashboard-dot-pattern opacity-[0.2] dark:opacity-[0.03]"></div>
        
        {/* Linear gradient top to bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-950/80"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {greeting}, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Here's an overview of your health journey</p>
          </motion.div>

          {/* Health Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 glow"
          >
            <div className="dashboard-card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Health Score</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Based on your supplement adherence and metrics</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">+8% this week</span>
                </div>
              </div>
              
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/3 lg:w-1/4 p-2">
                  <div className="flex items-center justify-center flex-col bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 h-full">
                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">86</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm text-center">Current Score</div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 lg:w-3/4 p-2">
                  <div className="bg-white dark:bg-gray-800/30 rounded-xl p-4 h-full">
                    <div className="flex gap-4 mb-2 text-xs">
                      <button 
                        onClick={() => setSelectedPeriod('week')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'week' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Week
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('month')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'month' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Month
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('year')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'year' 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        Year
                      </button>
                    </div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={healthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="healthScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="#f5f5f5" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            domain={[70, 100]} 
                            ticks={[70, 80, 90, 100]}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.97)', 
                              borderRadius: '0.5rem',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#healthScore)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Supplement Stack */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="dashboard-card p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Today's Supplements</h2>
                  <Link href="/supplements" className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {supplements.map((supp) => (
                    <motion.div 
                      key={supp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: supp.id * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`${supp.iconBg} flex items-center justify-center h-12 w-12 rounded-lg text-xl mr-4`}>
                          {supp.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{supp.name}</h3>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <span>{supp.dose}</span>
                            <span className="mx-2 h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span>{supp.timing}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${supp.priorityColor} bg-opacity-10 text-${supp.priorityColor.split('-')[1]}-800`}>
                            {supp.priority}
                          </div>
                        </div>
                        <button 
                          className={`flex items-center justify-center h-8 w-8 rounded-lg ${
                            supp.taken 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {supp.taken ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : null}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button className="w-full py-3 rounded-lg border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    Add Supplement
                  </button>
                </div>
              </div>
              
              {/* Genetic Data Card - Added as a standalone prominent section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="dashboard-card p-6 mt-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Genetic Data</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Personalized insights based on your genetic profile</p>
                  </div>
                  <Link href="/dashboard/health-data" className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Full Report
                  </Link>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 mb-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Your Genetic Profile</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{geneticData.length} genetic markers analyzed</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geneticData.map((item) => (
                      <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              item.significance === 'High' 
                                ? 'bg-rose-500' 
                                : item.significance === 'Moderate'
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                            }`} />
                            <span className="font-medium text-gray-900 dark:text-white">{item.gene}</span>
                          </div>
                          <span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {item.variant}
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.status === 'Homozygous' 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' 
                              : item.status === 'Heterozygous'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : item.status === 'Carrier'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {item.status}
                          </span>
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.significance === 'High' 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' 
                              : item.significance === 'Moderate'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {item.significance} impact
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button className="px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors">
                      View Supplement Recommendations
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="mb-1"><span className="font-medium">Note:</span> Genetic data is used to personalize your supplement recommendations.</p>
                  <p>This information is encrypted and never shared with third parties.</p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Column: Updates */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="dashboard-card p-6 h-full">
                <h2 className="text-xl font-semibold mb-6">Recent Updates</h2>
                
                <div className="space-y-6">
                  {updates.map((update) => (
                    <motion.div 
                      key={update.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: update.id * 0.1 }}
                      className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700"
                    >
                      <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <span className="text-xs">{update.icon}</span>
                      </div>
                      <div className="mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{update.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{update.message}</p>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500 text-xs">{update.time}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Health Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Sleep Quality</div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">7.5</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">hrs/night</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                      <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Adherence Rate</div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">92</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}