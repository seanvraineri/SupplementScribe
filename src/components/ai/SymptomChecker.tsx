'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Symptom = {
  id: number;
  name: string;
  selected: boolean;
};

type BodyArea = {
  id: string;
  name: string;
  symptoms: Symptom[];
};

type SymptomAnalysisResult = {
  possibleCauses: string[];
  supplementRecommendations: {
    name: string;
    reason: string;
    dosage: string;
    timeframe: string;
  }[];
  lifestyleRecommendations: string[];
  severity: 'mild' | 'moderate' | 'severe';
  consultDoctor: boolean;
};

const bodyAreas: BodyArea[] = [
  {
    id: 'head',
    name: 'Head & Neurological',
    symptoms: [
      { id: 1, name: 'Headache', selected: false },
      { id: 2, name: 'Dizziness', selected: false },
      { id: 3, name: 'Brain fog', selected: false },
      { id: 4, name: 'Poor concentration', selected: false },
      { id: 5, name: 'Memory issues', selected: false },
    ]
  },
  {
    id: 'digestive',
    name: 'Digestive',
    symptoms: [
      { id: 6, name: 'Bloating', selected: false },
      { id: 7, name: 'Constipation', selected: false },
      { id: 8, name: 'Diarrhea', selected: false },
      { id: 9, name: 'Nausea', selected: false },
      { id: 10, name: 'Acid reflux', selected: false },
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Sleep',
    symptoms: [
      { id: 11, name: 'Fatigue', selected: false },
      { id: 12, name: 'Insomnia', selected: false },
      { id: 13, name: 'Waking up tired', selected: false },
      { id: 14, name: 'Afternoon energy crash', selected: false },
      { id: 15, name: 'Restlessness', selected: false },
    ]
  },
  {
    id: 'mood',
    name: 'Mood & Stress',
    symptoms: [
      { id: 16, name: 'Anxiety', selected: false },
      { id: 17, name: 'Low mood', selected: false },
      { id: 18, name: 'Irritability', selected: false },
      { id: 19, name: 'Stress', selected: false },
      { id: 20, name: 'Mood swings', selected: false },
    ]
  },
  {
    id: 'joints',
    name: 'Joints & Muscles',
    symptoms: [
      { id: 21, name: 'Joint pain', selected: false },
      { id: 22, name: 'Muscle aches', selected: false },
      { id: 23, name: 'Stiffness', selected: false },
      { id: 24, name: 'Weakness', selected: false },
      { id: 25, name: 'Cramping', selected: false },
    ]
  },
];

// Mock analysis based on symptoms
const analyzeSymptoms = (selectedSymptoms: string[]): SymptomAnalysisResult => {
  // Check for patterns in symptoms to determine recommendations

  // Fatigue-related pattern
  if (selectedSymptoms.some(s => ['Fatigue', 'Waking up tired', 'Afternoon energy crash'].includes(s))) {
    return {
      possibleCauses: [
        'Iron deficiency',
        'Vitamin B12 deficiency',
        'Vitamin D deficiency',
        'Poor sleep quality',
        'Adrenal fatigue'
      ],
      supplementRecommendations: [
        {
          name: 'Iron + Vitamin C',
          reason: 'May address potential iron deficiency, especially common in women',
          dosage: '18mg elemental iron with 500mg vitamin C',
          timeframe: '2-3 months, then retest'
        },
        {
          name: 'Vitamin B12',
          reason: 'Supports energy production and neurological function',
          dosage: '1000mcg daily',
          timeframe: '1 month'
        },
        {
          name: 'Vitamin D3',
          reason: 'Low levels linked to fatigue and weakness',
          dosage: '2000 IU daily',
          timeframe: 'Ongoing, test levels after 3 months'
        }
      ],
      lifestyleRecommendations: [
        'Prioritize 7-8 hours of quality sleep',
        'Reduce caffeine consumption after noon',
        'Include more iron-rich foods (leafy greens, red meat) in diet',
        'Schedule short breaks during the day to rest and recover'
      ],
      severity: 'moderate',
      consultDoctor: true
    };
  }

  // Digestive issues pattern
  if (selectedSymptoms.some(s => ['Bloating', 'Constipation', 'Diarrhea', 'Nausea', 'Acid reflux'].includes(s))) {
    return {
      possibleCauses: [
        'Gut microbiome imbalance',
        'Food sensitivities',
        'Low digestive enzymes',
        'Stress affecting digestion',
        'Magnesium deficiency'
      ],
      supplementRecommendations: [
        {
          name: 'Probiotics',
          reason: 'Restores healthy gut bacteria balance',
          dosage: '10-30 billion CFUs with multiple strains',
          timeframe: '2-3 months minimum'
        },
        {
          name: 'Digestive Enzymes',
          reason: 'Supports proper breakdown of foods',
          dosage: '1 capsule before meals',
          timeframe: 'As needed with meals'
        },
        {
          name: 'Magnesium Glycinate',
          reason: 'May help with constipation and muscle relaxation',
          dosage: '300-400mg daily',
          timeframe: 'Daily, especially before bed'
        }
      ],
      lifestyleRecommendations: [
        'Try an elimination diet to identify food triggers',
        'Eat smaller, more frequent meals',
        'Practice mindful eating (chew thoroughly, eat slowly)',
        'Consider food journaling to track symptom patterns'
      ],
      severity: 'moderate',
      consultDoctor: selectedSymptoms.includes('Diarrhea') || selectedSymptoms.includes('Nausea')
    };
  }

  // Mood-related pattern
  if (selectedSymptoms.some(s => ['Anxiety', 'Low mood', 'Irritability', 'Stress', 'Mood swings'].includes(s))) {
    return {
      possibleCauses: [
        'Omega-3 deficiency',
        'Magnesium deficiency',
        'Vitamin D deficiency',
        'B vitamin imbalances',
        'Chronic stress affecting hormones'
      ],
      supplementRecommendations: [
        {
          name: 'Omega-3 Fish Oil',
          reason: 'Supports brain health and mood regulation',
          dosage: '1000-2000mg EPA+DHA daily',
          timeframe: 'Minimum 8 weeks to see effects'
        },
        {
          name: 'Magnesium Glycinate',
          reason: 'Known as the "relaxation mineral"',
          dosage: '300-400mg daily',
          timeframe: 'Daily, especially before bed'
        },
        {
          name: 'Vitamin D3',
          reason: 'Low vitamin D linked to mood disorders',
          dosage: '2000-5000 IU daily',
          timeframe: '3 months, then retest levels'
        }
      ],
      lifestyleRecommendations: [
        'Regular physical activity (30 minutes daily)',
        'Mindfulness or meditation practice',
        'Limit social media and news consumption',
        'Establish a consistent sleep schedule'
      ],
      severity: 'moderate',
      consultDoctor: selectedSymptoms.includes('Low mood') && selectedSymptoms.length > 2
    };
  }

  // Default response if no specific pattern is detected
  return {
    possibleCauses: [
      'Multiple potential factors',
      'Nutritional imbalances',
      'Lifestyle factors',
      'Stress-related issues'
    ],
    supplementRecommendations: [
      {
        name: 'High-quality multivitamin',
        reason: 'Addresses potential nutrient gaps',
        dosage: 'As directed on label',
        timeframe: 'Daily ongoing'
      },
      {
        name: 'Vitamin D3',
        reason: 'Common deficiency with wide-ranging effects',
        dosage: '2000 IU daily',
        timeframe: '3 months, then retest'
      }
    ],
    lifestyleRecommendations: [
      'Focus on a balanced diet rich in whole foods',
      'Ensure adequate hydration (8-10 glasses of water daily)',
      'Prioritize quality sleep',
      'Regular physical activity'
    ],
    severity: 'mild',
    consultDoctor: selectedSymptoms.length > 4
  };
};

type SymptomCheckerProps = {
  onComplete: (results: SymptomAnalysisResult) => void;
  onCancel: () => void;
};

export default function SymptomChecker({ onComplete, onCancel }: SymptomCheckerProps) {
  const [areas, setAreas] = useState<BodyArea[]>(bodyAreas);
  const [currentStep, setCurrentStep] = useState<'symptoms' | 'analysis'>('symptoms');
  const [analysisResults, setAnalysisResults] = useState<SymptomAnalysisResult | null>(null);

  const totalSelected = areas.reduce((count, area) => 
    count + area.symptoms.filter(s => s.selected).length, 0);

  const handleSymptomToggle = (areaId: string, symptomId: number) => {
    setAreas(areas.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          symptoms: area.symptoms.map(symptom => {
            if (symptom.id === symptomId) {
              return { ...symptom, selected: !symptom.selected };
            }
            return symptom;
          })
        };
      }
      return area;
    }));
  };

  const handleAnalyze = () => {
    const selectedSymptoms = areas.flatMap(area => 
      area.symptoms.filter(s => s.selected).map(s => s.name)
    );
    
    if (selectedSymptoms.length === 0) return;
    
    const results = analyzeSymptoms(selectedSymptoms);
    setAnalysisResults(results);
    setCurrentStep('analysis');
  };

  const handleComplete = () => {
    if (analysisResults) {
      onComplete(analysisResults);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-3xl w-full">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Symptom Analyzer</h2>
          <button 
            onClick={onCancel}
            className="text-white/80 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-indigo-100 text-sm mt-1">
          Select the symptoms you're experiencing to receive personalized insights
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        {currentStep === 'symptoms' ? (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {areas.map(area => (
                <div key={area.id}>
                  <h3 className="font-medium text-gray-900 mb-3">{area.name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {area.symptoms.map(symptom => (
                      <button
                        key={symptom.id}
                        onClick={() => handleSymptomToggle(area.id, symptom.id)}
                        className={`px-4 py-2 rounded-lg text-left text-sm transition-colors ${
                          symptom.selected 
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 flex-shrink-0 ${
                            symptom.selected ? 'bg-indigo-500' : 'bg-gray-300'
                          }`}></div>
                          {symptom.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div>
                <span className="font-medium text-sm text-gray-700">
                  {totalSelected} {totalSelected === 1 ? 'symptom' : 'symptoms'} selected
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={totalSelected === 0}
                  className={`px-4 py-2 rounded-lg text-white ${
                    totalSelected > 0 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Analyze Symptoms
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            {analysisResults && (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {/* Severity Indicator */}
                <div className={`p-4 rounded-lg ${
                  analysisResults.severity === 'severe' ? 'bg-red-50 border border-red-100' :
                  analysisResults.severity === 'moderate' ? 'bg-amber-50 border border-amber-100' :
                  'bg-green-50 border border-green-100'
                }`}>
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      analysisResults.severity === 'severe' ? 'bg-red-100 text-red-600' :
                      analysisResults.severity === 'moderate' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {analysisResults.severity === 'severe' ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : analysisResults.severity === 'moderate' ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-base font-semibold ${
                        analysisResults.severity === 'severe' ? 'text-red-800' :
                        analysisResults.severity === 'moderate' ? 'text-amber-800' :
                        'text-green-800'
                      }`}>
                        {analysisResults.severity === 'severe' ? 'Attention Required' :
                          analysisResults.severity === 'moderate' ? 'Moderate Concern' :
                          'Mild Symptoms'
                        }
                      </h3>
                      <p className={`text-sm mt-1 ${
                        analysisResults.severity === 'severe' ? 'text-red-700' :
                        analysisResults.severity === 'moderate' ? 'text-amber-700' :
                        'text-green-700'
                      }`}>
                        {analysisResults.consultDoctor 
                          ? 'Based on your selections, we recommend consulting a healthcare provider for a proper diagnosis.'
                          : 'These symptoms can likely be addressed with lifestyle changes and targeted supplements, but monitor for changes.'}
                      </p>
                    </div>
                  </div>
                </div>
              
                {/* Possible Causes */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Possible Causes</h3>
                  <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {analysisResults.possibleCauses.map((cause, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Supplement Recommendations */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Recommended Supplements</h3>
                  <div className="space-y-3">
                    {analysisResults.supplementRecommendations.map((supp, index) => (
                      <div key={index} className="bg-white rounded-lg border border-indigo-100 p-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-indigo-900">{supp.name}</h4>
                          <span className="text-sm text-indigo-600 font-medium">{supp.dosage}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{supp.reason}</p>
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Timeframe: {supp.timeframe}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Lifestyle Recommendations */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Lifestyle Recommendations</h3>
                  <ul className="bg-green-50 rounded-lg p-4 space-y-2">
                    {analysisResults.lifestyleRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Disclaimer */}
                <div className="text-xs text-gray-500 italic border-t border-gray-100 pt-4">
                  Note: This analysis is not a medical diagnosis. It's based on common patterns and is intended 
                  for informational purposes only. Always consult with a healthcare professional for medical advice.
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => setCurrentStep('symptoms')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Symptoms
              </button>
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
              >
                Add to Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 