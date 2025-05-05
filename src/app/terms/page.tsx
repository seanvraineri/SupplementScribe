'use client';

import { motion } from 'framer-motion';
import PrimaryNav from '@/components/ui/PrimaryNav';
import Link from 'next/link';

export default function TermsPage() {
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
              Terms of Service
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

          {/* Terms Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100"
          >
            <div className="prose prose-indigo max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to SupplementScribe. By accessing or using our website, mobile applications, or any other services we provide (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully. If you do not agree with these Terms, you should not access or use our Services.
              </p>
              
              <h2>2. Eligibility</h2>
              <p>
                You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
              </p>
              
              <h2>3. Account Registration</h2>
              <p>
                To access certain features of the Services, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
              </p>
              
              <h2>4. Wellness Disclaimer</h2>
              <p>
                <strong>SupplementScribe is a wellness application and NOT a healthcare service.</strong> We provide personalized supplement recommendations based on general wellness information you provide. Our Services are designed for general wellness purposes only and are not intended to diagnose, treat, cure, or prevent any disease or medical condition.
              </p>
              <p>
                The information provided through our Services is for informational and wellness purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. We are not a covered entity under HIPAA (Health Insurance Portability and Accountability Act) and do not provide medical services or process health insurance claims.
              </p>
              <p>
                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or before starting any new supplement regimen.
              </p>
              
              <h2>5. Your Data</h2>
              <p>
                Our Privacy Policy governs our collection, use, and disclosure of your personal information. By using our Services, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy.
              </p>
              <p>
                <strong>Wellness Information Processing:</strong> The information you provide is processed as general wellness information, not as protected health information (PHI) under HIPAA. We use anonymized data processing techniques and do not share your personal information with healthcare providers, insurance companies, or other covered entities under HIPAA.
              </p>
              <p>
                By using our Services, you acknowledge that the information you provide is for general wellness purposes and is not subject to the same protections as information provided to healthcare providers or other HIPAA-covered entities.
              </p>
              
              <h2>6. Subscription and Payments</h2>
              <p>
                Some features of our Services may require a subscription. All subscriptions are billed in advance according to the billing cycle you select. Your subscription will automatically renew unless you cancel it before the next renewal date.
              </p>
              <p>
                We reserve the right to change subscription fees at any time, but we will give you advance notice of these changes through a message to the email address associated with your account.
              </p>
              
              <h2>7. Cancellation and Refunds</h2>
              <p>
                You may cancel your subscription at any time through your account settings or by contacting our customer support. If you cancel, you may continue to use the subscription features until the end of your current billing period, but you will not receive a refund for the current billing period.
              </p>
              <p>
                Notwithstanding the above, if you are dissatisfied with our Services within the first 30 days after subscribing, you may request a refund by contacting our customer support.
              </p>
              
              <h2>8. Intellectual Property</h2>
              <p>
                All content, software, and technology used to provide our Services are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Services without our written permission.
              </p>
              
              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, SupplementScribe shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Services; (b) any conduct or content of any third party on the Services; or (c) unauthorized access, use, or alteration of your transmissions or content.
              </p>
              
              <h2>10. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. If we make material changes to these Terms, we will notify you by email or by posting a notice on our website prior to the changes becoming effective. Your continued use of the Services after the effective date of the revised Terms constitutes your acceptance of the revised Terms.
              </p>
              
              <h2>11. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                SupplementScribe, Inc.<br />
                123 Health Avenue<br />
                San Francisco, CA 94107<br />
                support@supplementscribe.com
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 