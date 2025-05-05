'use client';

import { useState } from 'react';
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

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
  
  // Calculate savings percentage
  const monthlyCost = 24.99 * 12;
  const yearlyCost = 199.99;
  const savingsPercentage = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);

  // Custom SVG icons
  const CheckIcon = () => (
    <svg className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

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
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h1 
                variants={fadeInUp}
                className="apple-headline mb-4"
              >
                Simple, Transparent <span className="text-gradient">Pricing</span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="apple-subheadline max-w-3xl mx-auto"
              >
                One clear price—no hidden fees, no in-app purchases, no supplement upsells.
              </motion.p>
            </motion.div>
          </div>

          {/* Pricing switch */}
          <div className="flex justify-center mb-16">
            <div className="apple-glass rounded-full p-1 shadow-md inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                  billingCycle === 'monthly' 
                    ? 'bg-apple-blue text-white shadow-sm' 
                    : 'text-apple-black dark:text-white hover:text-apple-blue'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                  billingCycle === 'yearly' 
                    ? 'bg-apple-blue text-white shadow-sm' 
                    : 'text-apple-black dark:text-white hover:text-apple-blue'
                }`}
              >
                Yearly <span className="text-xs ml-1 text-emerald-500 font-bold">Save {savingsPercentage}%</span>
              </button>
            </div>
          </div>

          {/* Single pricing card */}
          <div className="max-w-md mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative apple-card apple-card-hover border-apple-blue/20"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-apple-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                All Features Included
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="apple-feature-title mb-2">SupplementScribe Plan</h3>
                  <p className="apple-feature-description">Comprehensive genetic & biomarker analysis</p>
                </div>
                <div className="mb-8">
                  <p className="text-4xl font-bold text-apple-black dark:text-white mb-2">
                    ${billingCycle === 'monthly' ? '24.99' : '199.99'}
                    <span className="text-lg font-medium text-apple-gray ml-1">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-emerald-600 font-medium">
                      ${(24.99 * 12 - 199.99).toFixed(2)} savings annually
                    </p>
                  )}
                </div>
                <div className="mb-8">
                  <ul className="space-y-3">
                    {[
                      "Personalized supplement plan",
                      "Advanced nutrient deficiency analysis",
                      "Weekly progress check-ins",
                      "Advanced interaction checks",
                      "Priority in-app support",
                      "23andMe integration",
                      "Blood test integration",
                      "Advanced health score",
                      "Unlimited plan updates",
                      "One-click data deletion"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon />
                        <span className="text-apple-black dark:text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Link 
                    href="/onboarding" 
                    className="apple-button w-full block text-center"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Money back guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="apple-card apple-glass text-center mb-20 max-w-3xl mx-auto"
          >
            <div className="p-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-apple-blue/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="apple-title mb-2">30-Day Money-Back Guarantee</h3>
              <p className="apple-body max-w-2xl mx-auto">
                If you're not completely satisfied with your SupplementScribe experience within the first 30 days, 
                we'll refund your subscription—no questions asked.
              </p>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="apple-title text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="apple-card">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-apple-black dark:text-white mb-2">Can I cancel my subscription anytime?</h3>
                  <p className="text-apple-gray dark:text-gray-400">Yes, you can cancel your subscription at any time with no questions asked. If you cancel, you'll continue to have access until the end of your billing period.</p>
                </div>
              </div>
              <div className="apple-card">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-apple-black dark:text-white mb-2">What payment methods do you accept?</h3>
                  <p className="text-apple-gray dark:text-gray-400">We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also support Apple Pay and Google Pay for easier checkout.</p>
                </div>
              </div>
              <div className="apple-card">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-apple-black dark:text-white mb-2">Do I need any health data to get started?</h3>
                  <p className="text-apple-gray dark:text-gray-400">No, you can start with just our questionnaire. However, for the most personalized experience, we recommend uploading your 23andMe or blood test data if available.</p>
                </div>
              </div>
              <div className="apple-card">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-apple-black dark:text-white mb-2">Is my health data secure?</h3>
                  <p className="text-apple-gray dark:text-gray-400">Absolutely. We use bank-level encryption to protect your data, and we never sell or share your information with third parties. You can delete your data at any time with one click.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 