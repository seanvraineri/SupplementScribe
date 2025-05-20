'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './ui/Sidebar';
import HealthScoreCard from './ui/HealthScoreCard';
import MetricsGrid from './ui/MetricsGrid';
import RecentSupplements from './ui/RecentSupplements';
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
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardLoadingSkeleton from './dashboard/DashboardLoadingSkeleton';
import BiomarkerAnalysisCard from './dashboard/BiomarkerAnalysisCard';
import DashboardActionTile from './dashboard/DashboardActionTile';
import DashboardFooter from './dashboard/DashboardFooter';

const Dashboard = () => {
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
    return <DashboardLoadingSkeleton />;
  }
  
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto p-8"
        >
          <motion.div variants={itemVariants}>
            <DashboardHeader greeting={greeting} userName={user.name} />
          </motion.div>
          <motion.div variants={itemVariants} className="mb-8">
            <HealthScoreCard />
          </motion.div>
          <motion.div variants={itemVariants} className="mb-8">
            <MetricsGrid />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <BiomarkerAnalysisCard biomarkerData={biomarkerData} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <RecentSupplements />
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <DashboardActionTile
              icon={<Calendar className="h-6 w-6 text-blue-600" />}
              iconBg="bg-blue-100"
              title="Schedule Check-in"
              description="Book your monthly health check-in with our experts"
              buttonText="Schedule"
              buttonClass="border-blue-200 text-blue-700 hover:bg-blue-100"
            />
            <DashboardActionTile
              icon={<FileText className="h-6 w-6 text-green-600" />}
              iconBg="bg-green-100"
              title="Generate Report"
              description="Create a comprehensive health report to share with your doctor"
              buttonText="Generate"
              buttonClass="border-green-200 text-green-700 hover:bg-green-100"
            />
            <DashboardActionTile
              icon={<Bell className="h-6 w-6 text-purple-600" />}
              iconBg="bg-purple-100"
              title="Setup Reminders"
              description="Configure supplement reminders and notifications"
              buttonText="Configure"
              buttonClass="border-purple-200 text-purple-700 hover:bg-purple-100"
            />
            <DashboardActionTile
              icon={<Share2 className="h-6 w-6 text-amber-600" />}
              iconBg="bg-amber-100"
              title="Refer a Friend"
              description="Share SupplementScribe with friends and earn rewards"
              buttonText="Refer Now"
              buttonClass="border-amber-200 text-amber-700 hover:bg-amber-100"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardFooter />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard; 