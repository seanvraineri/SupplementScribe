'use client';

import { motion } from 'framer-motion';
import PrimaryNav from '@/components/ui/PrimaryNav';
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

export default function LearnMorePage() {
  return (
    <main className="min-h-screen relative">
      {/* Background with gradient and subtle patterns */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-apple-light-gray dark:bg-gray-900"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-apple-blue/5 dark:bg-apple-blue/10 blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[80px]"></div>
        <div className="absolute inset-0 dashboard-grid-bg opacity-[0.2] dark:opacity-[0.05]"></div>
      </div>

      <PrimaryNav />
      
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
              >
                About <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">SupplementScribe</span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              >
                The science-based approach to personalized supplementation
              </motion.p>
            </motion.div>
          </div>

          {/* Our Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-1/3 relative h-60 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-28 h-28 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-5">
                  At SupplementScribe, we believe that supplementation should be personalized, evidence-based, and transparent. We're on a mission to eliminate the guesswork from your supplement routine by providing recommendations based on your unique genetic profile, biomarkers, and lifestyle factors.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Traditional supplement plans are often generic, one-size-fits-all approaches that fail to account for individual differences. We're changing that by combining cutting-edge technology with peer-reviewed research to deliver truly personalized protocols that work with your body's unique needs.
                </p>
              </div>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">How SupplementScribe Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-5 text-primary-600 dark:text-primary-400 mx-auto">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Provide Your Data</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Upload your genetic data, lab results, or complete our comprehensive health assessment questionnaire to give us insights into your unique profile.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-5 text-primary-600 dark:text-primary-400 mx-auto">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Our proprietary algorithm analyzes your data against thousands of peer-reviewed studies to identify the supplements that would benefit your specific genetic variants and biomarkers.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-5 text-primary-600 dark:text-primary-400 mx-auto">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Personalized Protocol</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Receive your custom supplement protocol with detailed explanations of why each supplement was selected, including links to the scientific research supporting each recommendation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Scientific Approach */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">The Science Behind Our Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Nutrigenomics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We analyze genetic variants that affect how your body processes nutrients, metabolizes substances, and responds to different compounds. This allows us to identify which supplements are most likely to benefit your specific genetic profile.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Biomarker Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  By analyzing your blood test results, we identify biomarkers that might be out of optimal range. Our system then identifies nutrients scientifically shown to help optimize these specific markers, prioritizing those with the strongest evidence.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Safety Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our system runs a comprehensive safety check on your protocol, cross-referencing recommendations against your medications, medical conditions, and other supplements to identify potential interactions or contraindications.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">Evidence-Based Research</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every supplement recommendation is supported by studies published in PubMed-indexed journals, with direct links to the research. We focus on randomized controlled trials, meta-analyses, and systematic reviews whenever possible.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Ready to Experience Personalized Supplementation?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Create your evidence-based supplement protocol in just 3 minutes.
            </p>
            <Link 
              href="/onboarding" 
              className="inline-flex h-14 min-w-[160px] items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-purple-600 px-8 text-lg font-medium text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-600/30"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 