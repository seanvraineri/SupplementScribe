'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SupplementRecommendation } from '@/lib/recommendation-engine';

interface SupplementRecommendationsProps {
  recommendations: SupplementRecommendation[];
  isLoading?: boolean;
}

export default function SupplementRecommendations({ 
  recommendations, 
  isLoading = false 
}: SupplementRecommendationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Wellness Recommendations</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your wellness profile to receive personalized supplement recommendations.
          </p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">
            Complete Wellness Profile
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Your Wellness Recommendations</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          For wellness purposes only
        </div>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((supplement, index) => (
          <motion.div
            key={supplement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              onClick={() => setExpandedId(expandedId === supplement.id ? null : supplement.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconBackground(supplement.priority)}`}>
                    {getSupplementIcon(supplement.name)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{supplement.name}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {supplement.dosage} • {supplement.frequency}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(supplement.priority)}`}>
                    {supplement.priority.charAt(0).toUpperCase() + supplement.priority.slice(1)}
                  </div>
                  <div className="ml-2 text-gray-500">
                    {expandedId === supplement.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {expandedId === supplement.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {supplement.description}
                  </p>
                  
                  <div className="mb-3">
                    <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Benefits</h5>
                    <div className="flex flex-wrap gap-1">
                      {supplement.benefits.map(benefit => (
                        <span 
                          key={benefit} 
                          className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Evidence Level</h5>
                    <div className="flex items-center">
                      {renderEvidenceLevel(supplement.evidence_level)}
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {supplement.evidence_level.charAt(0).toUpperCase() + supplement.evidence_level.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm font-medium">
                      ${supplement.price}/month
                    </div>
                    <button className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>
          <span className="font-medium">Wellness Disclaimer:</span> These recommendations are for general wellness purposes only and are not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </div>
  );
}

// Helper functions
function getIconBackground(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
    case 'medium': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
    case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }
}

function getSupplementIcon(name: string): string {
  if (name.toLowerCase().includes('vitamin d')) return '☀️';
  if (name.toLowerCase().includes('magnesium')) return '🧠';
  if (name.toLowerCase().includes('omega')) return '🐟';
  if (name.toLowerCase().includes('probiotic')) return '🦠';
  if (name.toLowerCase().includes('zinc')) return '🛡️';
  if (name.toLowerCase().includes('vitamin c')) return '🍊';
  if (name.toLowerCase().includes('ashwagandha')) return '🌿';
  if (name.toLowerCase().includes('coq10')) return '⚡';
  return '💊';
}

function renderEvidenceLevel(level: string): JSX.Element {
  const dots = [];
  const total = 3;
  const filled = level === 'strong' ? 3 : level === 'moderate' ? 2 : 1;
  
  for (let i = 0; i < total; i++) {
    dots.push(
      <div 
        key={i}
        className={`w-2 h-2 rounded-full mr-1 ${
          i < filled 
            ? 'bg-green-500 dark:bg-green-400' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      />
    );
  }
  
  return <div className="flex">{dots}</div>;
}
