'use client';

import { motion } from 'framer-motion';
import PrimaryNav from '@/components/ui/PrimaryNav';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-300/10 rounded-full blur-3xl"></div>
      </div>

      <PrimaryNav />
      
      <section className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600"
            >
              Last updated: May 2023
            </motion.p>
          </div>

          {/* Privacy Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100"
          >
            <div className="prose prose-indigo max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At SupplementScribe, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, or any other services we provide (collectively, the "Services").
              </p>
              <p>
                We understand the sensitive nature of health and genetic data, and we are committed to protecting your privacy. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.
              </p>
              
              <h2>2. Information We Collect</h2>
              <h3>2.1 Information You Provide to Us</h3>
              <p>We may collect the following types of information when you use our Services:</p>
              <ul>
                <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
                <li><strong>Profile Information:</strong> This includes your age, sex, weight, height, and other demographic information you choose to provide.</li>
                <li><strong>Health Information:</strong> This includes your health goals, medical conditions, medications, allergies, and dietary preferences.</li>
                <li><strong>Genetic Data:</strong> If you choose to upload genetic data from services like 23andMe, we collect and process that information to provide you with personalized recommendations.</li>
                <li><strong>Blood Test Results:</strong> If you choose to upload blood test results, we collect and process that information to provide you with personalized recommendations.</li>
                <li><strong>Payment Information:</strong> If you subscribe to our paid services, we collect billing details such as your credit card information (processed securely through our payment processor).</li>
              </ul>
              
              <h3>2.2 Information We Collect Automatically</h3>
              <p>When you use our Services, we may automatically collect certain information, including:</p>
              <ul>
                <li><strong>Device Information:</strong> Information about your device, such as your IP address, browser type, operating system, and device identifiers.</li>
                <li><strong>Usage Data:</strong> Information about how you use our Services, such as the pages you visit, the features you use, and the time spent on our Services.</li>
                <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to collect information about your browsing activities and to personalize your experience on our Services.</li>
              </ul>
              
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our Services.</li>
                <li>Process and complete transactions, and send you related information, including confirmations and invoices.</li>
                <li>Generate personalized supplement recommendations based on your genetic data, blood test results, and other health information.</li>
                <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
                <li>Respond to your comments, questions, and requests, and provide customer service.</li>
                <li>Communicate with you about products, services, offers, promotions, and events, and provide other news or information about us and our partners.</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Services.</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of SupplementScribe and others.</li>
                <li>Personalize and improve your experience on our Services.</li>
                <li>Carry out any other purpose described to you at the time the information was collected.</li>
              </ul>
              
              <h2>4. How We Share Your Information</h2>
              <p>We may share the information we collect in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                <li><strong>With Your Consent:</strong> We may share your information with third parties when we have your consent to do so.</li>
              </ul>
              <p>
                <strong>We do not sell your personal information, including your genetic data or health information, to third parties.</strong>
              </p>
              
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
              
              <h2>6. Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>
              <p>
                If you wish to delete your account or request that we no longer use your information to provide you services, please contact us. We will respond to your request within a reasonable timeframe. Please note that we may retain certain information as required by law or for legitimate business purposes.
              </p>
              
              <h2>7. Your Rights</h2>
              <p>Depending on your location, you may have the following rights with respect to your personal information:</p>
              <ul>
                <li>The right to access the personal information we have about you.</li>
                <li>The right to rectify inaccurate personal information.</li>
                <li>The right to delete your personal information.</li>
                <li>The right to restrict or object to the processing of your personal information.</li>
                <li>The right to data portability.</li>
                <li>The right to withdraw consent at any time.</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the contact information provided below.
              </p>
              
              <h2>8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                SupplementScribe, Inc.<br />
                123 Health Avenue<br />
                San Francisco, CA 94107<br />
                privacy@supplementscribe.com
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 