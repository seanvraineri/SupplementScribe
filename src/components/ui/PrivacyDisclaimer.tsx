'use client';

import { useState } from 'react';

export default function PrivacyDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <p className="mb-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          <span>{isOpen ? '▼' : '►'}</span>
          <span className="ml-1">Privacy & Data Usage Information</span>
        </button>
      </p>
      
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Wellness Information Only</h4>
          <p className="mb-3">
            SupplementScribe is a wellness application and not a medical service. We provide general wellness 
            recommendations, not medical advice or treatment. Always consult with healthcare professionals 
            before making health decisions.
          </p>
          
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Data Privacy</h4>
          <p className="mb-3">
            Your privacy is important to us. We use anonymized data processing for recommendations and do not 
            store personally identifiable health information. Your data is processed using general wellness 
            algorithms and is not shared with healthcare providers or insurance companies.
          </p>
          
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Not a Covered Entity</h4>
          <p>
            SupplementScribe operates outside the healthcare system and is not a covered entity under HIPAA. 
            We do not provide medical services, process health insurance claims, or work directly with 
            healthcare providers.
          </p>
        </div>
      )}
    </div>
  );
}
