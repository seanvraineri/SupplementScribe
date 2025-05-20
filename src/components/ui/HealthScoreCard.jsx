'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { healthScoreData } from '@/data/mockDashboardData';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const HealthScoreCard = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  const data = healthScoreData.timeframes[timeframe];
  
  const scoreVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };
  
  const chartVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1,
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 200, 
        damping: 20,
        delay: 0.3
      }
    }
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="text-gray-900 font-medium">{label}</p>
          <p className="text-primary-600 font-semibold">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-900">Health Score</CardTitle>
          <div className="bg-green-50 px-3 py-1 rounded-full flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 text-sm font-medium">{healthScoreData.change}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">Based on your supplement adherence and metrics</p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Score Value */}
          <motion.div
            variants={scoreVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 flex flex-col items-center justify-center"
          >
            <div className="text-6xl font-bold text-primary-600 mb-1">
              {healthScoreData.score}
            </div>
            <div className="text-gray-500 text-sm text-center">Current Score</div>
          </motion.div>
          
          {/* Chart */}
          <motion.div
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <Tabs
              defaultValue="week"
              onValueChange={setTimeframe}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
              
              <TabsContent value={timeframe} className="mt-0">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.trend.map((value, index) => ({
                      name: data.labels[index],
                      score: value
                    }))}>
                      <defs>
                        <linearGradient id="healthScoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b96f5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b96f5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#f5f5f5" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        domain={[60, 100]}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b96f5" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#healthScoreGradient)" 
                        activeDot={{ r: 6, fill: '#3b96f5', stroke: 'white', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard; 