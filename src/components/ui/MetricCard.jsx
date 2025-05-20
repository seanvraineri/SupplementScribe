'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const MetricCard = ({ metric }) => {
  const { title, value, unit, change, status, data, color } = metric;
  
  // Normalize data for mini chart (0-100 scale)
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal;
  const normalizedData = data.map((val) => ({
    value: range > 0 ? ((val - minVal) / range) * 100 : 50
  }));
  
  // Determine color based on status and specified color
  const getColorClasses = () => {
    const baseColor = color || (status === 'improved' ? 'green' : 'blue');
    
    const colorMap = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        fill: '#3b82f6',
        stroke: '#3b82f6'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        fill: '#10b981',
        stroke: '#10b981'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        fill: '#ef4444',
        stroke: '#ef4444'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        fill: '#8b5cf6',
        stroke: '#8b5cf6'
      },
      amber: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        fill: '#f59e0b',
        stroke: '#f59e0b'
      }
    };
    
    return colorMap[baseColor] || colorMap.blue;
  };
  
  const colorClasses = getColorClasses();
  
  const TrendIcon = () => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4" />;
    }
    return <Minus className="h-4 w-4" />;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="shadow-metric hover:shadow-metric-hover transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">{title}</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="ml-1 text-sm text-gray-600">{unit}</span>
              </div>
            </div>
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1",
              colorClasses.bg,
              colorClasses.text
            )}>
              <TrendIcon />
              <span>{Math.abs(change)}{unit === '%' ? '%' : ''}</span>
            </div>
          </div>
          
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={normalizedData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`metricGradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorClasses.fill} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colorClasses.fill} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colorClasses.stroke}
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#metricGradient-${title})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            Last 7 days
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard; 