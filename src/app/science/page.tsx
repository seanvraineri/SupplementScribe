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

export default function SciencePage() {
  return (
    <main className="min-h-screen relative">
      {/* Apple-style background with gradient and subtle patterns */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-apple-light-gray dark:bg-gray-900"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-apple-blue/5 dark:bg-apple-blue/10 blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[80px]"></div>
        <div className="absolute inset-0 dashboard-grid-bg opacity-[0.2] dark:opacity-[0.05]"></div>
      </div>

      <PrimaryNav />
      
      <section className="relative py-24 px-6">
        <div className="apple-container">
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
                className="apple-headline mb-6"
              >
                Our <span className="text-gradient">Scientific</span> Approach
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="apple-subheadline max-w-3xl mx-auto"
              >
                How we combine genetic data, biomarkers, and peer-reviewed research to create personalized protocols
              </motion.p>
            </motion.div>
          </div>

          {/* Scientific Method */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="apple-card p-8 md:p-12 mb-16"
          >
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-1/3 relative h-60 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-apple-blue/20 to-purple-500/20 rounded-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-28 h-28 text-apple-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2V9.4C10 9.72 9.89 10.03 9.68 10.26L5.33 15H11C11.55 15 12 15.45 12 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 22V9C18 8.45 17.55 8 17 8H14C13.45 8 13 7.55 13 7V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 12V9C6 8.45 5.55 8 5 8H3C2.45 8 2 8.45 2 9V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 22V6C22 5.45 21.55 5 21 5H19C18.45 5 18 5.45 18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="apple-title mb-5">Evidence-Based Methodology</h2>
                <p className="apple-body mb-5">
                  At SupplementScribe, we believe in a rigorous scientific approach to supplementation. Our recommendations aren't based on anecdotes, marketing claims, or conventional wisdom—they're grounded in peer-reviewed research from respected scientific journals.
                </p>
                <p className="apple-body">
                  Every supplement recommendation is supported by studies published in PubMed-indexed journals, with direct links to the research so you can verify our sources. We focus on randomized controlled trials, meta-analyses, and systematic reviews whenever possible—the gold standards of scientific evidence.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Key Scientific Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Component 1: Nutrigenomics */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="apple-card"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H10V10H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 4H20V10H14V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 14H10V20H4V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 17C14 17.7956 14.3161 18.5587 14.8787 19.1213C15.4413 19.6839 16.2044 20 17 20C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17C20 16.2044 19.6839 15.4413 19.1213 14.8787C18.5587 14.3161 17.7956 14 17 14C16.2044 14 15.4413 14.3161 14.8787 14.8787C14.3161 15.4413 14 16.2044 14 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="apple-feature-title">Nutrigenomics Analysis</h3>
                <p className="apple-feature-description">
                  Our platform analyzes key genetic SNPs (Single Nucleotide Polymorphisms) from your 23andMe data that affect how your body processes nutrients. For example, if you have the MTHFR C677T variant, you may need the methylated form of folate rather than standard folic acid for optimal absorption.
                </p>
              </div>
            </motion.div>

            {/* Component 2: Biomarker Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="apple-card"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 14.66V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H9.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 2L22 6L12 16H8V12L18 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="apple-feature-title">Biomarker Optimization</h3>
                <p className="apple-feature-description">
                  By analyzing your blood test results, we identify biomarkers that might be out of optimal range—even if they fall within "normal" clinical limits. Our AI engine then identifies nutrients scientifically shown to help optimize these specific markers, prioritizing those with the strongest evidence.
                </p>
              </div>
            </motion.div>

            {/* Component 3: Safety Evaluation */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="apple-card"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="apple-feature-title">Safety & Interaction Analysis</h3>
                <p className="apple-feature-description">
                  Our system runs a comprehensive safety check on your protocol, cross-referencing recommendations against your medications, medical conditions, and other supplements to identify potential interactions or contraindications. This ensures you receive not just effective but also safe recommendations.
                </p>
              </div>
            </motion.div>

            {/* Component 4: Continuous Updates */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="apple-card"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 3.84277C13.3746 6.4824 12.1587 10.9584 13.2131 12.0128C14.5547 13.3544 18.8446 11.587 21 10.9088" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="apple-feature-title">Research-Based Evolution</h3>
                <p className="apple-feature-description">
                  Our database is continuously updated with the latest peer-reviewed research. As new studies emerge about nutrient effects on health markers, your recommendations evolve accordingly, ensuring your supplement plan always reflects current scientific understanding.
                </p>
              </div>
            </motion.div>
          </div>

          {/* PubMed Integration */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="apple-card apple-glass p-8 md:p-12 mb-16"
          >
            <h2 className="apple-title text-center mb-8">Backed by PubMed Research</h2>
            <p className="apple-body text-center max-w-3xl mx-auto mb-12">
              Every supplement recommendation includes links to relevant studies from PubMed, the world's leading database of biomedical literature. This transparency allows you to:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="apple-card">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-apple-black dark:text-white">Verify the Evidence</h3>
                  </div>
                  <p className="text-apple-gray dark:text-gray-400 text-sm">
                    See the exact studies that support each recommendation, including sample sizes, methodologies, and results.
                  </p>
                </div>
              </div>
              
              <div className="apple-card">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-apple-black dark:text-white">Understand the Science</h3>
                  </div>
                  <p className="text-apple-gray dark:text-gray-400 text-sm">
                    Learn about the biochemical mechanisms behind how specific nutrients affect your health markers and genetic variants.
                  </p>
                </div>
              </div>
              
              <div className="apple-card">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-apple-black dark:text-white">Make Informed Decisions</h3>
                  </div>
                  <p className="text-apple-gray dark:text-gray-400 text-sm">
                    Decide which supplements to prioritize based on the strength of scientific evidence and your specific health goals.
                  </p>
                </div>
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
            <h2 className="apple-title mb-5">Experience the Science of Personalization</h2>
            <p className="apple-subtitle mb-10 max-w-3xl mx-auto">
              Create your evidence-based supplement protocol in just 3 minutes.
            </p>
            <Link 
              href="/onboarding" 
              className="apple-button apple-button-large"
            >
              Join Now
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 