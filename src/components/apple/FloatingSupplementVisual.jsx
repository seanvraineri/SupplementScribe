'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FloatingSupplementVisual = () => {
  // Array of supplement shapes
  const supplements = [
    {
      id: 1,
      shape: 'capsule',
      gradient: 'from-blue-500 to-indigo-600',
      size: 'w-16 h-16',
      position: { top: '10%', left: '15%' },
      motion: {
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 10, 0],
        duration: 5,
        delay: 0
      }
    },
    {
      id: 2,
      shape: 'tablet',
      gradient: 'from-teal-400 to-cyan-500',
      size: 'w-12 h-12',
      position: { top: '25%', left: '60%' },
      motion: {
        y: [0, 15, 0],
        x: [0, -15, 0],
        rotate: [0, -5, 0],
        duration: 4.5,
        delay: 0.5
      }
    },
    {
      id: 3,
      shape: 'pill',
      gradient: 'from-violet-500 to-purple-600',
      size: 'w-10 h-10',
      position: { top: '60%', left: '20%' },
      motion: {
        y: [0, -10, 0],
        x: [0, -5, 0],
        rotate: [0, 15, 0],
        duration: 6,
        delay: 1
      }
    },
    {
      id: 4,
      shape: 'capsule',
      gradient: 'from-amber-400 to-orange-500',
      size: 'w-14 h-14',
      position: { top: '45%', left: '75%' },
      motion: {
        y: [0, 12, 0],
        x: [0, 8, 0],
        rotate: [0, -8, 0],
        duration: 5.5,
        delay: 1.5
      }
    },
    {
      id: 5,
      shape: 'pill',
      gradient: 'from-emerald-400 to-green-500',
      size: 'w-10 h-10',
      position: { top: '75%', left: '50%' },
      motion: {
        y: [0, -15, 0],
        x: [0, 10, 0],
        rotate: [0, 10, 0],
        duration: 5.2,
        delay: 2
      }
    }
  ];
  
  // Function to render different supplement shapes
  const renderShape = (shape, gradient, size) => {
    switch (shape) {
      case 'capsule':
        return (
          <div className={`${size} rounded-full bg-gradient-to-r ${gradient} shadow-xl backdrop-blur-sm`}></div>
        );
      case 'tablet':
        return (
          <div className={`${size} rounded-lg bg-gradient-to-r ${gradient} shadow-xl backdrop-blur-sm`}></div>
        );
      case 'pill':
        return (
          <div className={`${size} rounded-[50px] bg-gradient-to-r ${gradient} shadow-xl backdrop-blur-sm`} style={{ aspectRatio: '2/1' }}></div>
        );
      default:
        return (
          <div className={`${size} rounded-full bg-gradient-to-r ${gradient} shadow-xl backdrop-blur-sm`}></div>
        );
    }
  };
  
  // DNA strands in background
  const dnaElements = [];
  for (let i = 0; i < 5; i++) {
    dnaElements.push({
      id: `dna-${i}`,
      position: { 
        top: `${10 + (i * 15)}%`, 
        left: `${30 + (i % 2) * 40}%`,
        opacity: 0.1 + (i * 0.05)
      },
      rotation: i % 2 === 0 ? 30 : -30
    });
  }
  
  return (
    <div className="relative w-full h-full">
      {/* DNA structure elements in background */}
      {dnaElements.map((dna) => (
        <div 
          key={dna.id} 
          className="absolute" 
          style={{ 
            top: dna.position.top, 
            left: dna.position.left, 
            opacity: dna.position.opacity,
            transform: `rotate(${dna.rotation}deg)`,
            width: '120px',
            height: '40px'
          }}
        >
          <div className="relative h-full">
            <div className="absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            <div className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            <div className="absolute left-[20%] top-0 bottom-0 w-0.5 h-full bg-blue-500/50 rotate-45"></div>
            <div className="absolute left-[60%] top-0 bottom-0 w-0.5 h-full bg-blue-500/50 rotate-45"></div>
          </div>
        </div>
      ))}
      
      {/* Floating supplement elements */}
      {supplements.map((supplement) => (
        <motion.div
          key={supplement.id}
          className="absolute"
          style={{ 
            top: supplement.position.top, 
            left: supplement.position.left 
          }}
          animate={{
            y: supplement.motion.y,
            x: supplement.motion.x,
            rotate: supplement.motion.rotate,
          }}
          transition={{
            duration: supplement.motion.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: supplement.motion.delay
          }}
        >
          {renderShape(supplement.shape, supplement.gradient, supplement.size)}
          
          {/* Glow effect */}
          <div className={`absolute inset-0 ${supplement.size} rounded-full bg-${supplement.gradient.split(' ')[1].replace('to-', '')} blur-xl opacity-30`}></div>
        </motion.div>
      ))}
      
      {/* Central molecule representation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative w-full h-full">
          <motion.div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          />
          
          {/* Connecting lines */}
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border border-gray-400/20"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400/20"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400/20"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingSupplementVisual;
