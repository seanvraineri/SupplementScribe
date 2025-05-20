'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HealthScoreCard from '@/components/ui/HealthScoreCard';
import MetricsGrid from '@/components/ui/MetricsGrid';
import RecentSupplements from '@/components/ui/RecentSupplements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, BarChart2, Bell, Calendar, Clock, Activity,
  AlertCircle, Check, FileText, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { biomarkerData } from '@/data/mockDashboardData';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Tooltip, Legend, AreaChart, Area,
  LineChart, Line, CartesianGrid, XAxis, YAxis
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { user } from '@/data/mockDashboardData';

export default function Dashboard() {
  const [greeting, setGreeting] = useState('Good morning');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };
  
  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-6 w-1/4 mb-10" />
          <Skeleton className="h-[200px] w-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[150px] w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] lg:col-span-2" />
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 max-w-7xl mx-auto"
    >
      {/* Header with greeting */}
      <motion.div 
        variants={itemVariants}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {greeting}, {user.name}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your health journey
        </p>
      </motion.div>
      
      {/* Health Score Card */}
      <motion.div variants={itemVariants} className="mb-8">
        <HealthScoreCard />
      </motion.div>
      
      {/* Metrics Grid */}
      <motion.div variants={itemVariants} className="mb-8">
        <MetricsGrid />
      </motion.div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Biomarker Analysis */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2"
        >
          <Card className="shadow-card h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Biomarker Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Chart View
                  </TabsTrigger>
                  <TabsTrigger value="radar">
                    <Activity className="h-4 w-4 mr-2" />
                    Radar View
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={biomarkerData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Your Value" fill="#3b96f5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="optimal" name="Optimal Value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="radar" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={biomarkerData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis />
                      <Radar 
                        name="Your Values" 
                        dataKey="value" 
                        stroke="#3b96f5" 
                        fill="#3b96f5" 
                        fillOpacity={0.6} 
                      />
                      <Radar 
                        name="Optimal Values" 
                        dataKey="optimal" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.6} 
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Right Column: Supplements */}
        <motion.div variants={itemVariants}>
          <RecentSupplements />
        </motion.div>
      </div>
      
      {/* Activity and Action Tiles */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
      >
        <Card className="shadow-card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Schedule Check-in</h3>
            <p className="text-gray-600 text-sm mb-4">
              Book your monthly health check-in with our experts
            </p>
            <Button variant="outline" className="mt-auto w-full border-blue-200 text-blue-700 hover:bg-blue-100">
              Schedule
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-card bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Generate Report</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create a comprehensive health report to share with your doctor
            </p>
            <Button variant="outline" className="mt-auto w-full border-green-200 text-green-700 hover:bg-green-100">
              Generate
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-card bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Setup Reminders</h3>
            <p className="text-gray-600 text-sm mb-4">
              Configure supplement reminders and notifications
            </p>
            <Button variant="outline" className="mt-auto w-full border-purple-200 text-purple-700 hover:bg-purple-100">
              Configure
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-card bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Share2 className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Refer a Friend</h3>
            <p className="text-gray-600 text-sm mb-4">
              Share SupplementScribe with friends and earn rewards
            </p>
            <Button variant="outline" className="mt-auto w-full border-amber-200 text-amber-700 hover:bg-amber-100">
              Refer Now
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Footer */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 text-center text-gray-500 text-sm"
      >
        <p>© 2023 SupplementScribe. All data is encrypted and securely stored.</p>
      </motion.div>
    </motion.div>
  );
} 