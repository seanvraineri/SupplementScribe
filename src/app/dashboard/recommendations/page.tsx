'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type HealthCondition = {
  id: string;
  name: string;
  metrics: {
    name: string;
    value: string | number;
    status: 'low' | 'normal' | 'high';
    unit: string;
  }[];
  severity: 'mild' | 'moderate' | 'severe';
};

type SupplementRecommendation = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  priority: 'High' | 'Medium' | 'Low';
  evidenceLevel: 'Strong' | 'Moderate' | 'Preliminary';
  forConditions: string[];
  description: string;
  benefits: string[];
  interactions: string[];
  sideEffects: string[];
  sources: { title: string; url: string }[];
};

export default function RecommendationsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'supplements' | 'conditions'>('supplements');
  const [evidenceFilter, setEvidenceFilter] = useState<string>('all');
  
  // Set mounted state on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mock health conditions
  const healthConditions: HealthCondition[] = [
    {
      id: '1',
      name: 'Vitamin D Deficiency',
      metrics: [
        { name: 'Vitamin D', value: 28, status: 'low', unit: 'ng/mL' }
      ],
      severity: 'moderate'
    },
    {
      id: '2',
      name: 'Elevated Cholesterol',
      metrics: [
        { name: 'LDL Cholesterol', value: 110, status: 'high', unit: 'mg/dL' },
        { name: 'Total Cholesterol', value: 190, status: 'normal', unit: 'mg/dL' }
      ],
      severity: 'mild'
    },
    {
      id: '3',
      name: 'Sleep Quality Issues',
      metrics: [],
      severity: 'moderate'
    }
  ];
  
  // Mock supplement recommendations
  const supplementRecommendations: SupplementRecommendation[] = [
    {
      id: '1',
      name: 'Vitamin D3',
      dosage: '2,000-5,000 IU',
      frequency: 'Daily with a meal',
      priority: 'High',
      evidenceLevel: 'Strong',
      forConditions: ['Vitamin D Deficiency', 'Immune Support', 'Bone Health'],
      description: 'Vitamin D3 (cholecalciferol) is the most bioavailable form of vitamin D and is essential for calcium absorption, bone health, and immune function.',
      benefits: [
        'Increases calcium absorption',
        'Supports bone mineralization',
        'Enhances immune function',
        'May improve mood and cognitive function'
      ],
      interactions: [
        'May increase calcium absorption when taken with calcium supplements',
        'May interact with certain blood pressure medications',
        'May interfere with some cholesterol-lowering drugs'
      ],
      sideEffects: [
        'Rare at recommended doses',
        'High doses may cause hypercalcemia, nausea, or kidney stones'
      ],
      sources: [
        { title: 'National Institutes of Health - Vitamin D Fact Sheet', url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/' },
        { title: 'The Journal of Clinical Endocrinology & Metabolism', url: 'https://academic.oup.com/jcem' }
      ]
    },
    {
      id: '2',
      name: 'Vitamin K2 (MK-7)',
      dosage: '100-200 mcg',
      frequency: 'Daily with vitamin D',
      priority: 'Medium',
      evidenceLevel: 'Moderate',
      forConditions: ['Vitamin D Deficiency', 'Bone Health', 'Cardiovascular Health'],
      description: 'Vitamin K2 helps direct calcium to bones rather than arteries, complementing vitamin D supplementation and supporting heart health.',
      benefits: [
        'Directs calcium to bones and teeth',
        'Reduces arterial calcification',
        'Supports proper blood clotting',
        'May reduce risk of heart disease'
      ],
      interactions: [
        'May interfere with blood-thinning medications like warfarin',
        'Enhanced effect when combined with vitamin D'
      ],
      sideEffects: [
        'Generally well-tolerated at recommended doses',
        'Rarely may cause mild gastrointestinal discomfort'
      ],
      sources: [
        { title: 'Journal of Nutrition', url: 'https://academic.oup.com/jn' },
        { title: 'British Journal of Nutrition', url: 'https://www.cambridge.org/core/journals/british-journal-of-nutrition' }
      ]
    },
    {
      id: '3',
      name: 'Omega-3 Fish Oil',
      dosage: '1,000-2,000 mg',
      frequency: 'Daily with a meal',
      priority: 'High',
      evidenceLevel: 'Strong',
      forConditions: ['Elevated Cholesterol', 'Cardiovascular Health', 'Inflammation'],
      description: 'High-quality fish oil provides EPA and DHA omega-3 fatty acids that support heart, brain, and joint health.',
      benefits: [
        'Reduces triglyceride levels',
        'Supports healthy cholesterol ratios',
        'Decreases inflammation',
        'Supports brain and cognitive function'
      ],
      interactions: [
        'May enhance the effect of blood-thinning medications',
        'May lower blood pressure when combined with antihypertensive drugs'
      ],
      sideEffects: [
        'Fishy aftertaste or burping (reduced with enteric-coated products)',
        'Rarely may cause digestive discomfort'
      ],
      sources: [
        { title: 'American Heart Association', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/fats/fish-and-omega-3-fatty-acids' },
        { title: 'Journal of the American College of Cardiology', url: 'https://www.jacc.org/' }
      ]
    },
    {
      id: '4',
      name: 'Red Yeast Rice',
      dosage: '1,200 mg',
      frequency: 'Daily, divided into two doses',
      priority: 'Medium',
      evidenceLevel: 'Moderate',
      forConditions: ['Elevated Cholesterol'],
      description: 'Red yeast rice naturally contains compounds similar to prescription statins that can help maintain healthy cholesterol levels.',
      benefits: [
        'May lower LDL ("bad") cholesterol',
        'May reduce total cholesterol',
        'Alternative for those who cannot tolerate statins'
      ],
      interactions: [
        'Should not be taken with prescription statins',
        'May interact with certain antibiotics and antifungal medications',
        'May enhance effects of other cholesterol-lowering supplements'
      ],
      sideEffects: [
        'May cause muscle pain or weakness in some individuals',
        'Digestive discomfort in some people',
        'Rarely may affect liver function'
      ],
      sources: [
        { title: 'Mayo Clinic - Red Yeast Rice', url: 'https://www.mayoclinic.org/drugs-supplements-red-yeast-rice/art-20363074' },
        { title: 'Annals of Internal Medicine', url: 'https://www.acpjournals.org/journal/aim' }
      ]
    },
    {
      id: '5',
      name: 'Magnesium Glycinate',
      dosage: '300-400 mg',
      frequency: 'Daily before bed',
      priority: 'Medium',
      evidenceLevel: 'Moderate',
      forConditions: ['Sleep Quality Issues', 'Stress Management'],
      description: 'A highly bioavailable form of magnesium that supports relaxation, sleep quality, and stress reduction.',
      benefits: [
        'Promotes muscle relaxation',
        'Supports quality sleep',
        'Helps manage stress response',
        'Supports over 300 enzymatic reactions in the body'
      ],
      interactions: [
        'May reduce absorption of certain antibiotics and medications',
        'May have additive effects with certain blood pressure medications'
      ],
      sideEffects: [
        'Generally well-tolerated',
        'High doses may cause loose stools'
      ],
      sources: [
        { title: 'Sleep Medicine Reviews', url: 'https://www.sciencedirect.com/journal/sleep-medicine-reviews' },
        { title: 'Journal of Research in Medical Sciences', url: 'https://www.jmsjournal.net/' }
      ]
    },
    {
      id: '6',
      name: 'Melatonin',
      dosage: '0.5-3 mg',
      frequency: '30-60 minutes before bedtime',
      priority: 'Low',
      evidenceLevel: 'Strong',
      forConditions: ['Sleep Quality Issues'],
      description: 'A hormone that regulates sleep-wake cycles and can help improve sleep onset and quality.',
      benefits: [
        'Reduces time to fall asleep',
        'May improve sleep quality',
        'Helpful for jet lag or shift work',
        'Potent antioxidant properties'
      ],
      interactions: [
        'May enhance effects of sedative medications',
        'May interact with blood thinners',
        'May affect blood pressure medications'
      ],
      sideEffects: [
        'Morning grogginess at higher doses',
        'Vivid dreams or nightmares in some individuals',
        'Headaches in some people'
      ],
      sources: [
        { title: 'Journal of Sleep Research', url: 'https://onlinelibrary.wiley.com/journal/13652869' },
        { title: 'Sleep Medicine Reviews', url: 'https://www.sciencedirect.com/journal/sleep-medicine-reviews' }
      ]
    }
  ];
  
  // Filter supplements based on evidence level
  const filteredSupplements = evidenceFilter === 'all' 
    ? supplementRecommendations 
    : supplementRecommendations.filter(s => s.evidenceLevel.toLowerCase() === evidenceFilter);
  
  // Skeleton loader for initial server render
  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-5xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
          
          <div className="h-10 bg-gray-200 rounded-full w-full mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Personalized Recommendations</h1>
      <p className="text-gray-600 mb-6">Based on your health data, genetics, and goals</p>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('supplements')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'supplements' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Recommended Supplements
        </button>
        <button
          onClick={() => setActiveTab('conditions')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'conditions' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Health Conditions
        </button>
      </div>
      
      {/* Supplements Tab */}
      {activeTab === 'supplements' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Supplement Recommendations</h2>
            <div className="flex space-x-2 items-center">
              <span className="text-sm text-gray-500">Evidence:</span>
              <select
                value={evidenceFilter}
                onChange={(e) => setEvidenceFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg p-2 bg-white"
              >
                <option value="all">All Levels</option>
                <option value="strong">Strong</option>
                <option value="moderate">Moderate</option>
                <option value="preliminary">Preliminary</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredSupplements.map((supplement) => (
              <div 
                key={supplement.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{supplement.name}</h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplement.priority === 'High' ? 'bg-rose-100 text-rose-800' : 
                        supplement.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {supplement.priority === 'High' ? 'Vital' : 
                         supplement.priority === 'Medium' ? 'Helpful' : 'Optional'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplement.evidenceLevel === 'Strong' ? 'bg-green-100 text-green-800' : 
                        supplement.evidenceLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {supplement.evidenceLevel} Evidence
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{supplement.description}</p>
                </div>
                
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Dosage</span>
                      <span className="text-sm font-medium text-gray-900">{supplement.dosage}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Frequency</span>
                      <span className="text-sm font-medium text-gray-900">{supplement.frequency}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">For</span>
                      <div className="flex flex-wrap gap-1">
                        {supplement.forConditions.map((condition, idx) => (
                          <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link 
                      href={`/dashboard/supplements`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      Add to My Protocol
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Evidence Levels Explained</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-green-800">🔬</span>
                  </div>
                  <h4 className="font-medium text-green-800">Strong Evidence</h4>
                </div>
                <p className="text-sm text-green-700">
                  Multiple high-quality clinical trials with consistent results. 
                  Scientific consensus on efficacy and safety. Recommended by 
                  major health organizations.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-yellow-800">📊</span>
                  </div>
                  <h4 className="font-medium text-yellow-800">Moderate Evidence</h4>
                </div>
                <p className="text-sm text-yellow-700">
                  Some clinical trials with generally positive results, though 
                  limited in size or methodology. Growing scientific support, 
                  but more research needed.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-gray-800">🧪</span>
                  </div>
                  <h4 className="font-medium text-gray-800">Preliminary Evidence</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Early research or observational studies showing promise, but 
                  lacking large clinical trials. Based on traditional use or 
                  theoretical mechanisms.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Health Conditions Tab */}
      {activeTab === 'conditions' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Identified Health Conditions</h2>
            <p className="text-gray-600 mb-6">
              These conditions have been identified based on your health data and self-reported symptoms.
              Your supplement recommendations are tailored to address these specific areas.
            </p>
            
            <div className="space-y-4">
              {healthConditions.map((condition) => (
                <div 
                  key={condition.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{condition.name}</h3>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        condition.severity === 'mild' ? 'bg-green-100 text-green-800' : 
                        condition.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                      </span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-500 text-sm">
                      Learn More
                    </button>
                  </div>
                  
                  {condition.metrics.length > 0 ? (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Related Metrics</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        {condition.metrics.map((metric, idx) => (
                          <div key={idx} className="flex justify-between items-center mb-1 last:mb-0">
                            <span className="text-sm text-gray-700">{metric.name}</span>
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">
                                {metric.value} {metric.unit}
                              </span>
                              <span className={`w-2 h-2 rounded-full ${
                                metric.status === 'normal' ? 'bg-green-500' : 
                                metric.status === 'low' ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-4">
                      This condition was identified based on your reported symptoms and health history.
                    </p>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Supplements</h4>
                    <div className="flex flex-wrap gap-2">
                      {supplementRecommendations
                        .filter(s => s.forConditions.includes(condition.name))
                        .map((s) => (
                          <div 
                            key={s.id}
                            className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            <span className="mr-1">{s.name}</span>
                            <span className="text-xs">({s.dosage})</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-600 text-xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold">Healthcare Provider Collaboration</h3>
            </div>
            <p className="text-gray-600 mb-4">
              While our recommendations are evidence-based, we always encourage discussing them with your healthcare provider.
              You can easily share your health data and supplement plan with your doctor.
            </p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
              Generate Report for Healthcare Provider
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
} 