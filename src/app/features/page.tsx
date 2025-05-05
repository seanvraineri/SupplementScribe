'use client';

import { motion } from 'framer-motion';
import PrimaryNav from '@/components/ui/PrimaryNav';
import Link from 'next/link';
import FeaturesSection from '@/components/ui/FeaturesSection';

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

export default function FeaturesPage() {
  const features = [
    {
      title: "Personalized Protocols",
      description: "Upload your 23andMe data and bloodwork for custom supplement recommendations based on your unique genetic markers and biomarkers.",
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      color: "from-apple-blue to-blue-600",
    },
    {
      title: "Scientific Evidence",
      description: "Every recommendation includes direct links to PubMed studies supporting each supplement's efficacy for your specific needs.",
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Safety & Interaction Checks",
      description: "Our system automatically flags potential nutrient-medication interactions and condition-specific risks before you purchase anything.",
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "from-rose-500 to-red-500",
    },
    {
      title: "Dynamic Health Score",
      description: "Track your progress with a personalized health score that updates whenever you add new labs or adjust your supplement regimen.",
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="19" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
          <circle cx="5" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      color: "from-purple-600 to-violet-600",
    },
    {
      title: "Brand-Neutral Recommendations",
      description: "Unlike competitors who push proprietary supplements, we rank third-party options by purity, bioavailability, and price.",
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: "from-sky-500 to-blue-500",
    },
    {
      title: "Privacy Protection",
      description: "End-to-end encryption, one-click data deletion, and zero data resale—your genome stays yours.",
      icon: (
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14.5V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      color: "from-slate-700 to-gray-700",
    },
  ];

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
      
      {/* Featured section */}
      <FeaturesSection />
      
      {/* Premium Feature Cards */}
      <section className="py-20 px-6 relative">
        <div className="apple-container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="text-center mb-14"
          >
            <motion.h2 
              variants={fadeInUp}
              className="apple-title mb-4"
            >
              Comprehensive <span className="text-gradient">Features</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="apple-subtitle max-w-2xl mx-auto"
            >
              Unlock the full potential of your genetic data with our innovative platform
            </motion.p>
          </motion.div>

          {/* Grid of feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={`feature-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="apple-card apple-card-hover"
              >
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg mb-5 flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="apple-feature-title">{feature.title}</h3>
                  <p className="apple-feature-description">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 px-6 relative bg-apple-light-gray/60 dark:bg-gray-900/60 border-y border-gray-200 dark:border-gray-800">
        <div className="apple-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="apple-card p-8 md:p-12"
          >
            <div className="text-center mb-10">
              <h2 className="apple-title mb-4">Why SupplementScribe Outperforms Other Solutions</h2>
              <p className="apple-subtitle max-w-3xl mx-auto">
                See how our approach is fundamentally different from generic quiz-based supplement services, blood-test kits, and DIY research.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full p-4 flex-shrink-0">
                  <svg className="w-8 h-8 text-apple-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-black dark:text-white mb-2">60-Second Custom Protocol</h3>
                  <p className="text-apple-gray dark:text-gray-400">
                    Rather than waiting weeks for blood test results or relying on generic quiz answers, our AI analyzes your 23andMe file and existing blood work to create a tailored supplement protocol in less than a minute.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full p-4 flex-shrink-0">
                  <svg className="w-8 h-8 text-apple-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-black dark:text-white mb-2">Research Transparency</h3>
                  <p className="text-apple-gray dark:text-gray-400">
                    Unlike companies that make vague claims, every recommendation includes links to the specific scientific studies showing why a particular nutrient is suggested for your genetic variants and biomarkers.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-apple-blue/10 dark:bg-apple-blue/20 rounded-full p-4 flex-shrink-0">
                  <svg className="w-8 h-8 text-apple-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-black dark:text-white mb-2">No Product Pushing</h3>
                  <p className="text-apple-gray dark:text-gray-400">
                    We don't manufacture or sell supplements. Instead, we provide unbiased recommendations of third-party products ranked by quality and price, so you're never pressured to buy overpriced proprietary blends.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="apple-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="apple-title mb-5">Ready to experience personalized supplementation?</h2>
            <p className="apple-subtitle mb-10 max-w-3xl mx-auto">
              Create your custom protocol in under 3 minutes with our science-backed approach.
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