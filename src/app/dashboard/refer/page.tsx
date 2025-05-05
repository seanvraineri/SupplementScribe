'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock referral data (in a real app, this would come from an API)
const mockReferrals = [
  { id: 1, name: 'Alex Johnson', date: '2023-08-15', status: 'completed', reward: '1 month premium' },
  { id: 2, name: 'Sam Wilson', date: '2023-09-02', status: 'pending', reward: 'Pending signup' },
  { id: 3, name: 'Jamie Smith', date: '2023-09-10', status: 'completed', reward: '1 month premium' },
];

export default function ReferFriendPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [referralCode, setReferralCode] = useState('SUPP-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [shareUrl, setShareUrl] = useState('');
  
  // Generate the share URL when the component mounts
  useEffect(() => {
    // In production, use the actual domain
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}` 
      : 'https://supplementscribe.com';
    setShareUrl(`${baseUrl}/onboarding?ref=${referralCode}`);
  }, [referralCode]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setSuccessMessage('Referral link copied to clipboard!');
    
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Refer a Friend</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Share SupplementScribe</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-300">
              Invite your friends to try SupplementScribe and help them optimize their supplement routine. 
              Share your unique referral link below. Your personal health information is never shared with others.
            </p>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 mb-6">
              <h3 className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-3">Your personal referral link</h3>
              <div className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-4 break-all">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{shareUrl}</p>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={copyReferralLink}
                  className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Referral Link</span>
                </button>
                
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center text-sm text-green-600 dark:text-green-400 font-medium"
                  >
                    {successMessage}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Referral Benefits</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-primary-600 dark:text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Free Premium Month:</span> Get one month of premium features for each friend who signs up.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-primary-600 dark:text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Your Friend Benefits:</span> They'll receive a special 20% discount on their first subscription.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-primary-600 dark:text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Early Access:</span> You and your referred friends get early access to new features.
                </p>
              </li>
            </ul>
          </div>
          
          {/* My Referrals section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">My Referrals</h2>
            
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Reward
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockReferrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{referral.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(referral.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {referral.status === 'completed' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {referral.reward}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {mockReferrals.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">You haven't made any referrals yet. Share your link to get started!</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total rewards earned</h3>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">2 months</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Referrals completed</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2/5</p>
                </div>
              </div>
              
              {/* Referral progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Invite 3 more friends to get a bonus reward!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 