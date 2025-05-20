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
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, ScatterChart,
  Scatter, ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { getHealthScore } from '@/lib/health-score';

// Mock data for charts
const healthData = [
  { day: 'Mon', score: 78, adherence: 90, sleep: 7.2, stress: 42, energy: 65 },
  { day: 'Tue', score: 80, adherence: 100, sleep: 7.5, stress: 35, energy: 70 },
  { day: 'Wed', score: 76, adherence: 85, sleep: 6.8, stress: 55, energy: 60 },
  { day: 'Thu', score: 82, adherence: 90, sleep: 7.9, stress: 30, energy: 75 },
  { day: 'Fri', score: 79, adherence: 95, sleep: 7.0, stress: 40, energy: 68 },
  { day: 'Sat', score: 84, adherence: 100, sleep: 8.2, stress: 28, energy: 82 },
  { day: 'Sun', score: 86, adherence: 100, sleep: 8.4, stress: 25, energy: 85 },
];

// Monthly health data
const monthlyHealthData = [
  { week: 'Week 1', score: 75, adherence: 85 },
  { week: 'Week 2', score: 78, adherence: 90 },
  { week: 'Week 3', score: 82, adherence: 95 },
  { week: 'Week 4', score: 86, adherence: 100 },
];

// Yearly health data
const yearlyHealthData = [
  { month: 'Jan', score: 72, adherence: 80 },
  { month: 'Feb', score: 74, adherence: 82 },
  { month: 'Mar', score: 75, adherence: 85 },
  { month: 'Apr', score: 77, adherence: 88 },
  { month: 'May', score: 79, adherence: 90 },
  { month: 'Jun', score: 81, adherence: 92 },
  { month: 'Jul', score: 83, adherence: 94 },
  { month: 'Aug', score: 84, adherence: 95 },
  { month: 'Sep', score: 85, adherence: 96 },
  { month: 'Oct', score: 85, adherence: 97 },
  { month: 'Nov', score: 86, adherence: 98 },
  { month: 'Dec', score: 86, adherence: 99 },
];

// Biomarker data
const biomarkerData = [
  { name: 'Vitamin D', value: 28, optimal: 40, min: 30, max: 50 },
  { name: 'Magnesium', value: 1.9, optimal: 2.0, min: 1.7, max: 2.2 },
  { name: 'Zinc', value: 90, optimal: 95, min: 70, max: 120 },
  { name: 'Omega-3', value: 5.8, optimal: 8, min: 4, max: 8 },
  { name: 'Vitamin B12', value: 550, optimal: 600, min: 200, max: 900 },
];

// Health score breakdown
const healthScoreBreakdown = [
  { name: 'Biomarkers', value: 82 },
  { name: 'Lifestyle', value: 75 },
  { name: 'Genetic', value: 90 },
];

// Mock genetic data
const geneticData = [
  { id: 1, gene: 'MTHFR', variant: 'C677T', status: 'Heterozygous', significance: 'Moderate', description: 'May affect folate metabolism' },
  { id: 2, gene: 'VDR', variant: 'Taq1', status: 'Homozygous', significance: 'High', description: 'Affects vitamin D metabolism' },
  { id: 3, gene: 'COMT', variant: 'Val158Met', status: 'Normal', significance: 'Low', description: 'Normal dopamine processing' },
  { id: 4, gene: 'APOE', variant: 'ε3/ε4', status: 'Carrier', significance: 'High', description: 'Implications for cardiovascular health' }
];

// Enhanced supplement data
const supplements = [
  { 
    id: 1, 
    name: 'Vitamin D3', 
    icon: '☀️', 
    iconBg: 'bg-amber-100',
    dose: '2000 IU', 
    timing: 'Daily with breakfast',
    priority: 'High',
    priorityColor: 'bg-rose-500',
    taken: true,
    description: 'Supports bone health and immune function',
    adherenceRate: 95,
    daysStreak: 14,
    history: [true, true, true, false, true, true, true]
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
    description: 'Supports relaxation, sleep, and muscle recovery',
    adherenceRate: 90,
    daysStreak: 8,
    history: [true, true, false, true, true, true, true]
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
    description: 'Supports heart and brain health',
    adherenceRate: 85,
    daysStreak: 0,
    history: [true, true, true, true, false, false, false]
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
    description: 'Supports immune function and wound healing',
    adherenceRate: 80,
    daysStreak: 0,
    history: [true, false, true, true, true, false, false]
  },
  { 
    id: 5, 
    name: 'Vitamin B Complex', 
    icon: '🌱', 
    iconBg: 'bg-green-100',
    dose: '1 capsule', 
    timing: 'Daily with breakfast',
    priority: 'Medium',
    priorityColor: 'bg-amber-500',
    taken: true,
    description: 'Supports energy production and nerve function',
    adherenceRate: 88,
    daysStreak: 5,
    history: [true, true, true, true, true, false, true]
  }
];

// Health metrics data with mini trends
const healthMetrics = [
  {
    id: 1,
    name: 'Sleep Quality',
    value: 7.5,
    unit: 'hrs',
    status: 'improved',
    change: '+0.5',
    miniTrend: [6.8, 7.0, 7.2, 7.0, 7.5, 7.4, 7.5]
  },
  {
    id: 2,
    name: 'Energy Level',
    value: 85,
    unit: '%',
    status: 'improved',
    change: '+5%',
    miniTrend: [75, 78, 80, 82, 79, 83, 85]
  },
  {
    id: 3,
    name: 'Stress Level',
    value: 25,
    unit: '%',
    status: 'improved',
    change: '-10%',
    miniTrend: [45, 40, 35, 38, 30, 28, 25]
  },
  {
    id: 4,
    name: 'Mood',
    value: 90,
    unit: '%',
    status: 'stable',
    change: '+2%',
    miniTrend: [85, 88, 86, 89, 87, 90, 90]
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
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [supplementList, setSupplementList] = useState(supplements);
  
  // Add the properly typed handleToggleTaken function
  const handleToggleTaken = (id: number) => {
    setSupplementList(prevList => 
      prevList.map(supp => 
        supp.id === id 
          ? { ...supp, taken: !supp.taken, daysStreak: !supp.taken ? supp.daysStreak + 1 : 0 } 
          : supp
      )
    );
  };
  
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

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user has completed onboarding in localStorage
  useEffect(() => {
    if (!profileLoading && profile) {
      // If user has completed onboarding in localStorage but not in DB
      const localOnboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
      
      if (localOnboardingCompleted && !profile.onboarding_completed) {
        // Update the profile in DB to match localStorage
        const updateProfileOnboarding = async () => {
          try {
            const { error } = await supabase
              .from('health_profiles')
              .update({ onboarding_completed: true })
              .eq('id', profile.id);
              
            if (error) {
              console.error('Error updating onboarding status:', error);
            } else {
              console.log('Successfully marked onboarding as completed in database');
              // Refetch profile to get updated data
              refetchProfile();
            }
          } catch (err) {
            console.error('Error during onboarding status update:', err);
          }
        };
        
        updateProfileOnboarding();
      }
      
      setIsCheckingOnboarding(false);
    }
  }, [profile, profileLoading, refetchProfile]);

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
    if (typeof window === 'undefined' || !mounted) return;
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [mounted]);
  
  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    
    if (!authLoading && !isAuthenticated) {
      console.log('Dashboard: Redirecting unauthenticated user to login');
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router, mounted]);
  
  // Don't render until client-side hydration is complete
  if (!mounted) {
    return null;
  }
  
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
          <p className="text-gray-500 text-sm">
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
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md w-full">
          <div className="text-amber-500 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2 text-center">Error Loading Profile</h1>
          <p className="text-gray-600 text-center mb-4">
            We encountered an error while loading your data.
          </p>
          <div className="text-sm text-gray-500 p-3 bg-gray-100 rounded-md mb-6">
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
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded transition hover:bg-gray-300"
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
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
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
  if (!profileLoading && !isCheckingOnboarding && profile && !profile.onboarding_completed) {
    // Check if we have pending onboarding data in localStorage first
    const pendingOnboardingData = localStorage.getItem('onboardingFormData');
    
    if (pendingOnboardingData) {
      // User has started onboarding but didn't complete it
      return (
        <div className="relative min-h-screen w-full">
          <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-lg mx-auto"
            >
              <h1 className="text-3xl font-bold mb-4">Continue Your Wellness Profile</h1>
              <p className="text-gray-600 mb-8">
                You started setting up your profile but didn't complete it. Let's pick up where you left off.
              </p>
              <p className="text-sm text-gray-500 mb-4">For general wellness purposes only. Not medical advice.</p>
              <Link 
                href="/onboarding" 
                className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                Continue Onboarding
              </Link>
            </motion.div>
          </div>
        </div>
      );
    }
    
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
      {/* Simpler background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'}
            </h1>
            <p className="text-gray-600">Here's an overview of your health journey</p>
          </motion.div>

          {/* Health Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 glow"
          >
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Health Score</h2>
                  <p className="text-gray-600 text-sm">Based on your supplement adherence and metrics</p>
                </div>
                <div className="bg-green-50 px-3 py-1 rounded-full">
                  <span className="text-green-600 text-sm font-medium">+8% this week</span>
                </div>
              </div>
              
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/3 lg:w-1/4 p-2">
                  <div className="flex items-center justify-center flex-col bg-gray-50 rounded-xl p-4 h-full border border-gray-100">
                    <div className="text-5xl font-bold text-blue-600 mb-2">86</div>
                    <div className="text-gray-500 text-sm text-center">Current Score</div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 lg:w-3/4 p-2">
                  <div className="bg-white rounded-xl p-4 h-full border border-gray-100">
                    <div className="flex gap-4 mb-2 text-xs">
                      <button 
                        onClick={() => setSelectedPeriod('week')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'week' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-gray-500'
                        }`}
                      >
                        Week
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('month')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'month' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-gray-500'
                        }`}
                      >
                        Month
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('year')}
                        className={`px-3 py-1 rounded-full ${
                          selectedPeriod === 'year' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-gray-500'
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

          {/* Add Health Metrics Cards here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <HealthMetricsCards />
          </motion.div>

          {/* Health Analytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <HealthAnalytics selectedPeriod={selectedPeriod} data={healthData} />
          </motion.div>
          
          {/* Biomarker Analysis Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <BiomarkerAnalysis />
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
                  <h2 className="text-xl font-semibold text-gray-900">Today's Supplements</h2>
                  <Link href="/supplements" className="text-blue-600 text-sm font-medium">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {supplementList.slice(0, 3).map((supp) => (
                    <SupplementCard 
                      key={supp.id} 
                      supplement={supp} 
                      onToggleTaken={handleToggleTaken} 
                    />
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                    Add Supplement
                  </button>
                  {supplementList.length > 3 && (
                    <button className="flex-1 py-3 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                      View All ({supplementList.length})
                    </button>
                  )}
                </div>
              </div>
              
              {/* Genetic Data Card - Added as a standalone prominent section */}
              {profile?.health_files?.length > 0 || profile?.has_genetic_data ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="dashboard-card p-6 mt-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Genetic Data</h2>
                      <p className="text-gray-600 text-sm">Personalized insights based on your genetic profile</p>
                    </div>
                    <Link href="/dashboard/health-data" className="text-blue-600 text-sm font-medium">
                      Full Report
                    </Link>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-4 border border-indigo-100">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Your Genetic Profile</h3>
                        <p className="text-sm text-gray-600">{geneticData.length} genetic markers analyzed</p>
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
                              item.status === 'High' 
                                ? 'bg-rose-100 text-rose-800' 
                                : item.status === 'Moderate'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.status === 'Carrier'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                              {item.status}
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              item.significance === 'High' 
                                ? 'bg-rose-100 text-rose-800' 
                                : item.significance === 'Moderate'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {item.significance} impact
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <button className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors">
                        View Supplement Recommendations
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p className="mb-1"><span className="font-medium">Note:</span> Genetic data is used to personalize your supplement recommendations.</p>
                    <p>This information is encrypted and never shared with third parties.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="dashboard-card p-6 mt-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Genetic Analysis</h2>
                      <p className="text-gray-600 text-sm">Upload your genetic data for personalized insights</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-4 border border-indigo-100">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">
                      Unlock Genetic-Based Recommendations
                    </h3>
                    
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Upload your 23andMe, AncestryDNA, or other genetic test results to receive personalized supplement recommendations based on your unique genetic profile.
                    </p>
                    
                    <div className="text-center">
                      <p className="text-gray-500 mb-4 text-sm italic">
                        This step is completely optional. You'll still receive quality supplement recommendations based on your other health information.
                      </p>
                      
                      <Link 
                        href="/dashboard/upload-data" 
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Upload Genetic Data
                        <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p className="mb-1"><span className="font-medium">Note:</span> Genetic data helps us provide more tailored recommendations for your specific needs, but it's not required.</p>
                    <p>Your data is encrypted and never shared with third parties.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Right Column: Updates */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl p-6 h-full shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Updates</h2>
                
                <div className="space-y-6">
                  {updates.map((update) => (
                    <motion.div 
                      key={update.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: update.id * 0.1 }}
                      className="relative pl-6 border-l-2 border-gray-200"
                    >
                      <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-xs">{update.icon}</span>
                      </div>
                      <div className="mb-1">
                        <h3 className="font-medium text-gray-900">{update.title}</h3>
                        <p className="text-gray-600 text-sm">{update.message}</p>
                      </div>
                      <span className="text-gray-400 text-xs">{update.time}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Health Metrics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="text-gray-500 text-xs mb-1">Sleep Quality</div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900">7.5</span>
                        <span className="text-gray-500 text-xs ml-1">hrs/night</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="text-gray-500 text-xs mb-1">Adherence Rate</div>
                      <div className="flex items-baseline">
                        <span className="text-xl font-semibold text-gray-900">92</span>
                        <span className="text-gray-500 text-xs ml-1">%</span>
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

      {/* Personalized Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <PersonalizedInsights />
      </motion.div>
    </div>
  );
}

// Fix the HealthAnalytics component's TypeScript errors
interface HealthAnalyticsProps {
  selectedPeriod: string;
  data: Array<any>;
}

const HealthAnalytics = ({ selectedPeriod, data }: HealthAnalyticsProps) => {
  // Choose the appropriate data based on selected period
  const chartData = 
    selectedPeriod === 'month' ? monthlyHealthData : 
    selectedPeriod === 'year' ? yearlyHealthData : 
    healthData;
  
  const xDataKey = 
    selectedPeriod === 'month' ? 'week' : 
    selectedPeriod === 'year' ? 'month' : 
    'day';
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Health Score Trends */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score Trends</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey={xDataKey} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                name="Health Score"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="adherence" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Supplement Adherence" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Health Score Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score Breakdown</h3>
        <div className="h-72 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <ResponsiveContainer width="80%" height={180}>
              <PieChart>
                <Pie
                  data={healthScoreBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 px-4">
            {healthScoreBreakdown.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  {item.value}%
                </div>
                <div className="text-xs text-gray-600">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix the BiomarkerAnalysis component
const BiomarkerAnalysis = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Biomarker Analysis</h3>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Key Biomarkers</h4>
          <div className="space-y-4">
            {biomarkerData.map((marker, index) => {
              // Calculate percentage of value within range
              const range = marker.max - marker.min;
              const position = ((marker.value - marker.min) / range) * 100;
              const clampedPosition = Math.min(Math.max(position, 0), 100);
              const status = 
                marker.value < marker.min ? 'low' : 
                marker.value > marker.max ? 'high' : 'normal';
              
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{marker.name}</span>
                    <span className="text-sm text-gray-600">{marker.value} ({marker.min}-{marker.max})</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-1">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'normal' ? 'bg-green-500' : 
                        status === 'low' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${clampedPosition}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Low</span>
                    <span>Optimal</span>
                    <span>High</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Comparison to Optimal Levels</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={biomarkerData}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar name="Your Values" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Optimal Values" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix the HealthMetricsCards component
const HealthMetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {healthMetrics.map((metric) => {
        // Normalize trend data for mini chart (0-100 scale)
        const maxVal = Math.max(...metric.miniTrend);
        const minVal = Math.min(...metric.miniTrend);
        const range = maxVal - minVal;
        const normalizedTrend = metric.miniTrend.map((val: number) => ({
          value: range > 0 ? ((val - minVal) / range) * 100 : 50
        }));
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: metric.id * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">{metric.name}</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className="ml-1 text-sm text-gray-600">{metric.unit}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                metric.status === 'improved' 
                  ? 'bg-green-100 text-green-800' 
                  : metric.status === 'declined'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {metric.change}
              </div>
            </div>
            
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={normalizedTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`metricGradient${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={
                        metric.status === 'improved' ? '#10b981' : 
                        metric.status === 'declined' ? '#ef4444' : '#3b82f6'
                      } stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={
                        metric.status === 'improved' ? '#10b981' : 
                        metric.status === 'declined' ? '#ef4444' : '#3b82f6'
                      } stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={
                      metric.status === 'improved' ? '#10b981' : 
                      metric.status === 'declined' ? '#ef4444' : '#3b82f6'
                    } 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill={`url(#metricGradient${metric.id})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-600 mt-1 text-center">
              Last 7 days
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Define SupplementType interface
interface SupplementType {
  id: number;
  name: string;
  icon: string;
  iconBg: string;
  dose: string;
  timing: string;
  priority: string;
  priorityColor: string;
  taken: boolean;
  description: string;
  adherenceRate: number;
  daysStreak: number;
  history: boolean[];
}

// Fix the SupplementCard component
interface SupplementCardProps {
  supplement: SupplementType;
  onToggleTaken: (id: number) => void;
}

const SupplementCard = ({ supplement, onToggleTaken }: SupplementCardProps) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`${supplement.iconBg} flex items-center justify-center h-12 w-12 rounded-lg text-xl mr-4`}>
            {supplement.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{supplement.name}</h3>
            <p className="text-sm text-gray-600">{supplement.description}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full bg-opacity-10 ${
          supplement.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {supplement.priority}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
          <div className="text-xs text-gray-600">Dose</div>
          <div className="font-medium text-gray-900">{supplement.dose}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
          <div className="text-xs text-gray-600">Adherence</div>
          <div className="font-medium text-gray-900">{supplement.adherenceRate}%</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
          <div className="text-xs text-gray-600">Streak</div>
          <div className="font-medium text-gray-900">{supplement.daysStreak} days</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          {supplement.timing}
        </div>
        <button 
          onClick={() => onToggleTaken(supplement.id)}
          className={`flex items-center justify-center h-10 w-10 rounded-lg ${
            supplement.taken 
              ? 'bg-green-500 text-white shadow-sm' 
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {supplement.taken ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Last 7 days</span>
          <span className="text-xs font-medium text-gray-700">
            {supplement.history.filter(Boolean).length}/7 days
          </span>
        </div>
        <div className="flex justify-between">
          {supplement.history.map((taken, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full ${
                taken ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Fix the PersonalizedInsights component
interface AchievementType {
  id: number;
  title: string;
  description: string;
}

interface ImprovementAreaType {
  id: number;
  name: string;
  description: string;
  recommendation: string;
  impact: string;
}

interface InsightDataType {
  currentScore: number;
  previousScore: number;
  scoreChange: string;
  improvementAreas: ImprovementAreaType[];
  achievements: AchievementType[];
}

const PersonalizedInsights = () => {
  // Sample insights data - in a real app would come from API
  const insightData: InsightDataType = {
    currentScore: 86,
    previousScore: 79,
    scoreChange: '+7',
    improvementAreas: [
      {
        id: 1,
        name: 'Vitamin D Levels',
        description: 'Your vitamin D levels are improving but still below optimal range.',
        recommendation: 'Continue with 2000 IU daily and consider increasing sun exposure.',
        impact: 'medium'
      },
      {
        id: 2,
        name: 'Sleep Quality',
        description: 'Your sleep quality has improved to 7.5 hours on average.',
        recommendation: 'Maintain your evening magnesium supplementation.',
        impact: 'high'
      },
      {
        id: 3,
        name: 'Stress Management',
        description: 'Your stress levels have decreased significantly.',
        recommendation: 'Continue your meditation practice and B-complex supplements.',
        impact: 'high'
      }
    ],
    achievements: [
      {
        id: 1,
        title: '14-Day Streak',
        description: "You've taken Vitamin D3 consistently for 14 days"
      },
      {
        id: 2,
        title: 'Sleep Improvement',
        description: 'Your average sleep duration increased by 30 minutes'
      }
    ]
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Personalized Insights</h2>
        <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center">
          <span className="text-blue-600 text-sm font-medium mr-1">Updated today</span>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Score Assessment */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-4">Health Score Assessment</h3>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="10"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="10" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * insightData.currentScore / 100)} 
                  strokeLinecap="round" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{insightData.currentScore}</span>
                <span className={`text-sm ${insightData.scoreChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {insightData.scoreChange}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-900">Biomarker Score</div>
                <div className="text-sm font-medium text-gray-900">82/100</div>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                <div className="h-1.5 bg-blue-600 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-900">Lifestyle Score</div>
                <div className="text-sm font-medium text-gray-900">75/100</div>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                <div className="h-1.5 bg-purple-600 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-900">Genetic Score</div>
                <div className="text-sm font-medium text-gray-900">90/100</div>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                <div className="h-1.5 bg-green-600 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Improvement Recommendations */}
        <div className="lg:col-span-5">
          <h3 className="font-semibold text-gray-900 mb-4">Improvement Areas</h3>
          <div className="space-y-4">
            {insightData.improvementAreas.map((area) => (
              <div 
                key={area.id} 
                className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm border-t border-r border-b border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{area.name}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    area.impact === 'high' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {area.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {area.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievements and Resources */}
        <div className="lg:col-span-3">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          <div className="space-y-4 mb-6">
            {insightData.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🏆</span>
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
          <div className="space-y-3">
            <Link href="/dashboard/recommendations" className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Supplement Guide</h4>
                <p className="text-xs text-gray-600">View your personalized plan</p>
              </div>
            </Link>
            
            <Link href="/dashboard/health-data" className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Health Metrics</h4>
                <p className="text-xs text-gray-600">Upload new test results</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};