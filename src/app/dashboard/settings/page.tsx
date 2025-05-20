'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/app/providers';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reportFormat, setReportFormat] = useState<'detailed' | 'simple' | 'comprehensive'>('detailed');
  const [privacySettings, setPrivacySettings] = useState({
    shareAnonymizedData: false,
    allowAnalytics: true
  });
  
  // Hydration fix - Only render UI after mounted to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const settingsString = localStorage.getItem('userSettings');
        if (settingsString) {
          const settings = JSON.parse(settingsString);
          setNotifications(settings.notifications || false);
          setReportFormat(settings.reportFormat || 'detailed');
          setPrivacySettings({
            shareAnonymizedData: settings.shareAnonymizedData || false,
            allowAnalytics: settings.allowAnalytics !== undefined ? settings.allowAnalytics : true
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings when they change
  useEffect(() => {
    if (!mounted) return;
    
    const saveSettings = () => {
      localStorage.setItem('userSettings', JSON.stringify({
        notifications,
        reportFormat,
        ...privacySettings
      }));
    };
    
    saveSettings();
  }, [notifications, reportFormat, privacySettings, mounted]);
  
  const handleToggleNotifications = () => {
    setNotifications(prev => !prev);
    showSuccessMessage();
  };
  
  const handleTogglePrivacySetting = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    showSuccessMessage();
  };
  
  const handleReportFormatChange = (format: 'detailed' | 'simple' | 'comprehensive') => {
    setReportFormat(format);
    showSuccessMessage();
  };
  
  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // Don't render UI until after client-side hydration to avoid hydration mismatch
  if (!mounted) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-10"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your SupplementScribe experience</p>
        </div>
        
        {/* Success Message */}
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg text-green-700 dark:text-green-300"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Settings updated successfully
            </div>
          </motion.div>
        )}
        
        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Display Settings */}
          <section className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none"
                >
                  <span className={`${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'} absolute h-6 w-12 mx-auto rounded-full transition-colors`}></span>
                  <span className={`${theme === 'dark' ? 'translate-x-6 bg-gray-100' : 'translate-x-0.5 bg-white'} absolute left-0 inline-block h-5 w-5 transform rounded-full transition-transform shadow-md`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts and reminders</p>
                </div>
                <button 
                  onClick={handleToggleNotifications}
                  className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none"
                >
                  <span className={`${notifications ? 'bg-indigo-600' : 'bg-gray-300'} absolute h-6 w-12 mx-auto rounded-full transition-colors`}></span>
                  <span className={`${notifications ? 'translate-x-6 bg-gray-100' : 'translate-x-0.5 bg-white'} absolute left-0 inline-block h-5 w-5 transform rounded-full transition-transform shadow-md`}></span>
                </button>
              </div>
            </div>
          </section>
          
          {/* Privacy & Sharing Settings */}
          <section className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy & Sharing</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Share Anonymized Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Help improve recommendations for all users</p>
                </div>
                <button 
                  onClick={() => handleTogglePrivacySetting('shareAnonymizedData')}
                  className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none"
                >
                  <span className={`${privacySettings.shareAnonymizedData ? 'bg-indigo-600' : 'bg-gray-300'} absolute h-6 w-12 mx-auto rounded-full transition-colors`}></span>
                  <span className={`${privacySettings.shareAnonymizedData ? 'translate-x-6 bg-gray-100' : 'translate-x-0.5 bg-white'} absolute left-0 inline-block h-5 w-5 transform rounded-full transition-transform shadow-md`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Allow Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve your experience</p>
                </div>
                <button 
                  onClick={() => handleTogglePrivacySetting('allowAnalytics')}
                  className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none"
                >
                  <span className={`${privacySettings.allowAnalytics ? 'bg-indigo-600' : 'bg-gray-300'} absolute h-6 w-12 mx-auto rounded-full transition-colors`}></span>
                  <span className={`${privacySettings.allowAnalytics ? 'translate-x-6 bg-gray-100' : 'translate-x-0.5 bg-white'} absolute left-0 inline-block h-5 w-5 transform rounded-full transition-transform shadow-md`}></span>
                </button>
              </div>
            </div>
          </section>
          
          {/* Export & Reports Settings */}
          <section className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export & Reports</h2>
            
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Default Report Format</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose how detailed your reports should be</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleReportFormatChange('simple')}
                  className={`p-4 rounded-lg text-center transition-colors border ${
                    reportFormat === 'simple' 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' 
                      : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="block font-medium">Simple</span>
                  <span className="block text-xs mt-1">Basic information only</span>
                </button>
                
                <button
                  onClick={() => handleReportFormatChange('detailed')}
                  className={`p-4 rounded-lg text-center transition-colors border ${
                    reportFormat === 'detailed' 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' 
                      : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="block font-medium">Detailed</span>
                  <span className="block text-xs mt-1">Includes benefits and dosage</span>
                </button>
                
                <button
                  onClick={() => handleReportFormatChange('comprehensive')}
                  className={`p-4 rounded-lg text-center transition-colors border ${
                    reportFormat === 'comprehensive' 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' 
                      : 'bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="block font-medium">Comprehensive</span>
                  <span className="block text-xs mt-1">Full details with recommendations</span>
                </button>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Data Export</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to PDF
                  </button>
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Export to CSV
                  </button>
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Account Settings */}
          <section className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Email</h3>
                <p className="text-gray-800 dark:text-gray-200">john.smith@example.com</p>
              </div>
              
              <div className="pt-2">
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                  Change Password
                </button>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="font-medium text-red-600 dark:text-red-400 mb-1">Danger Zone</h3>
                <div className="flex space-x-3 mt-2">
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                    Delete All Data
                  </button>
                  <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
} 