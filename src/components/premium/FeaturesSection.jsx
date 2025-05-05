'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import DNAVisualization from './DNAVisualization';
import CountUp from 'react-countup';
import { useIntersectionObserver } from 'react-intersection-observer';

// Feature item component with staggered animation and interactive hover effects
const FeatureItem = ({ title, description, index, icon }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={cardRef}
      className="group flex flex-col p-6 bg-[#0a101f]/60 backdrop-blur-sm rounded-xl shadow-md border border-blue-900/20 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)" }}
    >
      {/* Spotlight effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 rounded-xl transition duration-300"></div>
      
      {/* Icon with dynamic animation */}
      <motion.div 
        className="mb-4 p-3 bg-blue-900/20 rounded-lg w-14 h-14 flex items-center justify-center relative"
        whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg filter blur-md group-hover:bg-blue-500/30 transition duration-300"></div>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition duration-300">{title}</h3>
      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition duration-300">{description}</p>
      
      {/* Reveal on hover */}
      <motion.div 
        className="w-full mt-3 pt-3 border-t border-blue-900/20 text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ height: 0 }}
        whileHover={{ height: 'auto' }}
      >
        Click to explore this feature
      </motion.div>
    </motion.div>
  );
};

// Interactive counter component for statistics
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const [ref, inView] = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="font-mono">
      {prefix}
      {inView ? (
        <CountUp 
          end={value} 
          duration={2.5} 
          separator="," 
          decimals={value % 1 !== 0 ? 1 : 0}
          decimal="."
        />
      ) : '0'}
      {suffix}
    </div>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features = [
    {
      title: 'Instant, Personalized Plans',
      description: 'A tailor-made supplement roadmap in ≤ 60 seconds—skip the endless quizzes and get straight to the answers.',
      icon: (
        <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      title: 'Unlock Your 23andMe & Lab Data',
      description: 'Drag-and-drop your 23andMe raw file, recent blood test PDFs, and even Apple Health metrics—our engine turns that buried data into actionable nutrition gold.',
      icon: (
        <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    },
    {
      title: 'PubMed-Powered Proof',
      description: 'Every recommendation is cross-checked against the latest peer-reviewed PubMed studies, so you see the why behind every pill.',
      icon: (
        <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      title: 'Interaction & Safety Guardrails',
      description: "Instant flags for nutrient/medication clashes or condition risks—know what's safe before you buy.",
      icon: (
        <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    {
      title: 'Dynamic Health Score (0-100)',
      description: 'A living score that updates whenever you add new data or tweak your lifestyle—watch your numeric gains mount, over months.',
      icon: (
        <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    },
    {
      title: 'Brand-Agnostic Product Links',
      description: 'Curated third-party supplements ranked for purity, dosage form, and price—no house brand bias, just the best options for you.',
      icon: (
        <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#020617] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-violet-600/5 blur-[80px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Features
              </span> that transform your health
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              SupplementScribe delivers premium, personalized supplement plans
              backed by science and tailored to your unique biology.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Powered by cutting-edge genetic analysis</h3>
              <p className="text-gray-400 mb-6">
                Our proprietary algorithms analyze over 4.2 million genetic markers to create the most precise supplement recommendations available today. We leverage the latest research in nutrigenomics to decode your unique biological blueprint.
              </p>
              <ul className="space-y-3">
                {[
                  'Comprehensive SNP evaluation',
                  'Methylation pathway analysis',
                  'Neurotransmitter metabolism assessment',
                  'Detoxification capacity analysis'
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* 3D Model Display */}
          <div className="lg:col-span-2 h-[400px]">
            <motion.div
              className="w-full h-full bg-[#0a101f] border border-blue-900/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="h-[350px]">
                <DNAVisualization />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
