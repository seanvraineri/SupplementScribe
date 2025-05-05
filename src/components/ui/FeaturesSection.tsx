'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Import feature icons
import ClockIcon from './feature-icons/ClockIcon';
import DNAIcon from './feature-icons/DNAIcon';
import BookIcon from './feature-icons/BookIcon';
import WarningIcon from './feature-icons/WarningIcon';
import ChartIcon from './feature-icons/ChartIcon';
import GiftIcon from './feature-icons/GiftIcon';
import LockIcon from './feature-icons/LockIcon';
import CalendarIcon from './feature-icons/CalendarIcon';
import DollarIcon from './feature-icons/DollarIcon';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Feature data
const featureItems = [
  {
    id: 'instant-personalized-plans',
    title: 'Instant, Personalized Plans',
    description: 'A tailor-made supplement roadmap in ≤ 60 seconds—skip the endless quizzes and get straight to the answers.',
    icon: <ClockIcon />
  },
  {
    id: 'unlock-23andme',
    title: 'Unlock Your 23andMe & Lab Data',
    description: 'Drag-and-drop your 23andMe raw file, recent blood test PDFs, and even Apple Health metrics—our engine turns that buried data into actionable nutrition gold.',
    icon: <DNAIcon />
  },
  {
    id: 'pubmed-powered',
    title: 'PubMed-Powered Proof',
    description: 'Every recommendation is cross-checked against the latest peer-reviewed PubMed studies, so you see the why behind every pill.',
    icon: <BookIcon />
  },
  {
    id: 'interaction-safety',
    title: 'Interaction & Safety Guardrails',
    description: "Instant flags for nutrient/medication clashes or condition risks—know what's safe before you buy.",
    icon: <WarningIcon />
  },
  {
    id: 'dynamic-health-score',
    title: 'Dynamic Health Score (0-100)',
    description: 'A living score that updates whenever you add new data or tweak your lifestyle—watch your numeric gains mount, over months.',
    icon: <ChartIcon />
  },
  {
    id: 'brand-agnostic',
    title: 'Brand-Agnostic Product Links',
    description: 'Curated third-party supplements ranked for purity, dosage form, and price—no house brand bias, just the best options for you.',
    icon: <GiftIcon />
  },
  {
    id: 'privacy-first',
    title: 'Privacy-First Architecture',
    description: 'End-to-end encryption, one-click data delete—your genetic data stays yours.',
    icon: <LockIcon />
  },
  {
    id: 'progress-journal',
    title: 'Progress Journal & Smart Reminders',
    description: 'Daily check-ins and streak-based nudges to keep you motivated and track real-world results.',
    icon: <CalendarIcon />
  },
  {
    id: 'simple-subscription',
    title: 'Simple Subscription—No Hidden Upsells',
    description: 'One flat price—$24.99 /mo or $199 /yr—guarantees plan updates and chat support, no gimmicks or tiers to buy.',
    icon: <DollarIcon />
  }
];

// Background animation component
function AnimatedGradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute top-0 left-10 w-[300px] h-[300px] rounded-full bg-blue-100 opacity-10 blur-[80px]"
        animate={{
          x: [0, 10, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-40 right-10 w-[250px] h-[250px] rounded-full bg-green-100 opacity-10 blur-[70px]"
        animate={{
          x: [0, -20, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-10 left-1/4 w-[200px] h-[200px] rounded-full bg-purple-100 opacity-10 blur-[60px]"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

// Main component
export default function FeaturesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <AnimatedGradientBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="text-blue-600">Features</span> that transform your health
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              SupplementScribe delivers premium, personalized supplement plans
              backed by science and tailored to your unique biology.
            </motion.p>
          </motion.div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featureItems.map((feature) => (
            <motion.div
              key={feature.id}
              variants={fadeInUp}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
