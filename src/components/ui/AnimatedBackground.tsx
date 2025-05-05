'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Slow moving gradient animation */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ 
            background: 'linear-gradient(to right, #4f46e5, #3b82f6)' 
          }}
          animate={{
            x: ['-5%', '5%', '-5%'],
            y: ['0%', '5%', '0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
          style={{ 
            background: 'linear-gradient(to right, #8b5cf6, #6366f1)' 
          }}
          animate={{
            x: ['5%', '-5%', '5%'],
            y: ['5%', '0%', '5%']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
          style={{ 
            background: 'linear-gradient(to right, #10b981, #3b82f6)' 
          }}
          animate={{
            x: ['0%', '8%', '0%'],
            y: ['5%', '-5%', '5%']
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full opacity-10 blur-[70px]"
          style={{ 
            background: 'linear-gradient(to right, #f97316, #ec4899)' 
          }}
          animate={{
            x: ['5%', '-5%', '5%'],
            y: ['-3%', '3%', '-3%']
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}
