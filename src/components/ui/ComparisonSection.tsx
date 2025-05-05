'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

// Checkmark and X animations
const checkmarkVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Animated background component
function AnimatedGradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-blue-100 opacity-10 blur-[80px]"
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-[250px] h-[250px] rounded-full bg-indigo-100 opacity-10 blur-[70px]"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

// Component for rendering check mark
const CheckMark = () => (
  <motion.div 
    variants={checkmarkVariants}
    className="flex justify-center"
  >
    <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </motion.div>
);

// Component for rendering X mark
const XMark = () => (
  <motion.div 
    variants={checkmarkVariants}
    className="flex justify-center"
  >
    <svg className="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </motion.div>
);

// Component for rendering question mark
const QuestionMark = () => (
  <motion.div 
    variants={checkmarkVariants}
    className="flex justify-center"
  >
    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  </motion.div>
);

// Component for rendering special text with icon
const SpecialText = ({ text }: { text: string }) => (
  <motion.div 
    variants={checkmarkVariants}
    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded inline-flex items-center"
  >
    {text}
  </motion.div>
);

export default function ComparisonSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <AnimatedGradientBackground />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-10"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why You Can't Afford to Skip <span className="text-blue-600">SupplementScribe</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-gray-50 rounded-lg shadow overflow-hidden mb-8"
        >
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <motion.h3 
              variants={fadeInUp}
              className="font-semibold text-gray-800"
            >
              SupplementScribe vs "Everybody Else"
            </motion.h3>
            <motion.p
              variants={fadeInUp}
              className="text-sm text-gray-600"
            >
              See how we compare to traditional solutions
            </motion.p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left font-medium text-gray-500 w-1/3"></th>
                  <th className="p-3 text-center font-medium text-blue-600 uppercase text-sm w-1/6">SupplementScribe</th>
                  <th className="p-3 text-center font-medium text-gray-500 uppercase text-sm w-1/6">Quiz-Box Packs</th>
                  <th className="p-3 text-center font-medium text-gray-500 uppercase text-sm w-1/6">Blood-Kit Services</th>
                  <th className="p-3 text-center font-medium text-gray-500 uppercase text-sm w-1/6">DIY Googling</th>
                </tr>
              </thead>
              <tbody>
                <motion.tr variants={fadeInUp} className="border-b border-gray-200">
                  <td className="p-3 text-gray-700">Uses your 23andMe + labs</td>
                  <td className="p-3 text-center">
                    <SpecialText text="drag-and-drop" />
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                  <td className="p-3 text-center">
                    <XMark />
                    <div className="text-xs text-gray-500">(new kit required)</div>
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                </motion.tr>
                <motion.tr variants={fadeInUp} className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 text-gray-700">Plan delivered in &lt; 60 s</td>
                  <td className="p-3 text-center"><CheckMark /></td>
                  <td className="p-3 text-center"><CheckMark /></td>
                  <td className="p-3 text-center">
                    <XMark />
                    <div className="text-xs text-gray-500">(5-10 days)</div>
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                </motion.tr>
                <motion.tr variants={fadeInUp} className="border-b border-gray-200">
                  <td className="p-3 text-gray-700">PubMed citations</td>
                  <td className="p-3 text-center">
                    <SpecialText text="clickable links" />
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                  <td className="p-3 text-center">
                    <div className="text-xs text-gray-500">Limited</div>
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                </motion.tr>
                <motion.tr variants={fadeInUp} className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 text-gray-700">Interaction checks</td>
                  <td className="p-3 text-center">
                    <SpecialText text="real-time" />
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                  <td className="p-3 text-center">
                    <div className="text-xs text-yellow-600 flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
                      </svg>
                      manual review
                    </div>
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                </motion.tr>
                <motion.tr variants={fadeInUp} className="border-b border-gray-200">
                  <td className="p-3 text-gray-700">No house brand bias</td>
                  <td className="p-3 text-center">
                    <SpecialText text="brand-agnostic" />
                  </td>
                  <td className="p-3 text-center"><XMark /></td>
                  <td className="p-3 text-center"><XMark /></td>
                  <td className="p-3 text-center">
                    <div className="text-xs text-gray-500">N/A</div>
                  </td>
                </motion.tr>
                <motion.tr variants={fadeInUp} className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 text-gray-700">Flat $24.99/mo subscription</td>
                  <td className="p-3 text-center"><CheckMark /></td>
                  <td className="p-3 text-center">
                    <XMark />
                    <div className="text-xs text-gray-500">($50-$100)</div>
                  </td>
                  <td className="p-3 text-center">
                    <XMark />
                    <div className="text-xs text-gray-500">($300+ kits)</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-xs text-gray-500">Free—but risky & time-consuming</div>
                  </td>
                </motion.tr>
                <motion.tr variants={fadeInUp}>
                  <td className="p-3 text-gray-700">Bank-level privacy & no resale</td>
                  <td className="p-3 text-center"><CheckMark /></td>
                  <td className="p-3 text-center"><QuestionMark /></td>
                  <td className="p-3 text-center"><QuestionMark /></td>
                  <td className="p-3 text-center"><QuestionMark /></td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.p variants={fadeInUp} className="text-gray-600 mb-8">
            Missing out means: overpaying for generic vitamins, risking dangerous interactions, and leaving hard-earned health data unused.
          </motion.p>
          
          <motion.p variants={fadeInUp} className="text-gray-600 mb-8">
            Signing up means: science-backed precision, total transparency, and a smarter body for less than a dollar a day.
          </motion.p>
          
          <motion.p variants={fadeInUp} className="text-gray-700 font-medium mb-8">
            Ready to trade guesswork for evidence? Join SupplementScribe and get your personalized plan in under 60 seconds.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Link 
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8"
            >
              Get Started Now
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
