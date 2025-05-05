'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const ComparisonSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const comparisonData = [
    {
      feature: 'Uses your 23andMe + labs',
      supplementScribe: { value: 'drag-and-drop', highlighted: true },
      quizBox: { value: false },
      bloodKit: { value: false, note: 'new kit required' },
      diyGoogling: { value: false }
    },
    {
      feature: 'Plan delivered in < 60 s',
      supplementScribe: { value: true },
      quizBox: { value: true },
      bloodKit: { value: false, note: '5-10 days' },
      diyGoogling: { value: false }
    },
    {
      feature: 'PubMed citations',
      supplementScribe: { value: 'clickable links', highlighted: true },
      quizBox: { value: false },
      bloodKit: { value: 'Limited' },
      diyGoogling: { value: false }
    },
    {
      feature: 'Interaction checks',
      supplementScribe: { value: 'real-time', highlighted: true },
      quizBox: { value: false },
      bloodKit: { value: 'manual review', note: 'delayed' },
      diyGoogling: { value: false }
    },
    {
      feature: 'No house brand bias',
      supplementScribe: { value: 'brand-agnostic', highlighted: true },
      quizBox: { value: false },
      bloodKit: { value: false },
      diyGoogling: { value: 'N/A' }
    },
    {
      feature: 'Flat $24.99/mo subscription',
      supplementScribe: { value: true },
      quizBox: { value: false, note: '$50-$100' },
      bloodKit: { value: false, note: '$300+ kits' },
      diyGoogling: { value: 'Free—but risky & time-consuming' }
    },
    {
      feature: 'Bank-level privacy & no resale',
      supplementScribe: { value: true },
      quizBox: { value: 'unknown' },
      bloodKit: { value: 'unknown' },
      diyGoogling: { value: 'unknown' }
    }
  ];

  // Helper function to render cell content
  const renderCell = (data) => {
    if (data.highlighted) {
      return (
        <span className="inline-flex px-2 py-1 bg-blue-900/20 border border-blue-600/30 text-blue-400 text-xs rounded">
          {data.value}
        </span>
      );
    }
    
    if (data.value === true) {
      return (
        <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    
    if (data.value === false) {
      return (
        <>
          <svg className="w-5 h-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {data.note && <div className="text-xs text-gray-500 mt-1">{data.note}</div>}
        </>
      );
    }
    
    if (data.value === 'unknown') {
      return (
        <span className="text-gray-500">?</span>
      );
    }
    
    return (
      <>
        <span className="text-gray-400">{data.value}</span>
        {data.note && <div className="text-xs text-gray-500 mt-1">{data.note}</div>}
      </>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#030712] overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#030712]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-900/5 blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-900/5 blur-[120px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why You Can't Afford to Skip <span className="text-blue-500">SupplementScribe</span>
            </h2>
          </motion.div>

          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-blue-900/30">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300"></th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-blue-400 uppercase">SupplementScribe</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase">Quiz-Box Packs</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase">Blood-Kit Services</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase">DIY Googling</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-blue-900/20 ${index % 2 === 0 ? 'bg-blue-900/5' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-300">{row.feature}</td>
                      <td className="px-6 py-4 text-center">{renderCell(row.supplementScribe)}</td>
                      <td className="px-6 py-4 text-center">{renderCell(row.quizBox)}</td>
                      <td className="px-6 py-4 text-center">{renderCell(row.bloodKit)}</td>
                      <td className="px-6 py-4 text-center">{renderCell(row.diyGoogling)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            className="mt-16 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-400 mb-6">
              Missing out means: overpaying for generic vitamins, risking dangerous interactions, and leaving hard-earned health data unused.
            </p>
            <p className="text-gray-400 mb-8">
              Signing up means: science-backed precision, total transparency, and a smarter body for less than a dollar a day.
            </p>
            <div className="mt-10">
              <Link 
                href="/signup" 
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-900/30 hover:shadow-blue-700/40"
              >
                Get Started Now
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
