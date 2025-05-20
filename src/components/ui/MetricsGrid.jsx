'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MetricCard from './MetricCard';
import { metrics } from '@/data/mockDashboardData';

const MetricsGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.key} metric={metric} />
      ))}
    </motion.div>
  );
};

export default MetricsGrid; 