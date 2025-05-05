'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Supplement } from '@/types/supplement';

// Define interaction types
type InteractionSeverity = 'mild' | 'moderate' | 'severe' | 'none';

type MedicationType = {
  id: string;
  name: string;
  category: string;
  commonBrands?: string[];
};

type Interaction = {
  id: string;
  supplementId: number;
  supplementName: string;
  interactsWith: string; // could be supplement name or medication name
  interactionType: 'supplement-supplement' | 'supplement-medication';
  severity: InteractionSeverity;
  effects: string;
  recommendations: string;
  sources: { title: string; url: string }[];
};

export default function InteractionsPage() {
  // State
  const [mounted, setMounted] = useState(false);
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [severityFilter, setSeverityFilter] = useState<InteractionSeverity | 'all'>('all');
  
  // Load data from localStorage on client-side
  useEffect(() => {
    setMounted(true);
    
    // Load supplements
    try {
      const savedSupplements = localStorage.getItem('supplements') || 
                            localStorage.getItem('customSupplements');
      if (savedSupplements) {
        setSupplements(JSON.parse(savedSupplements));
      } else {
        // Fallback to mock data if no supplements in localStorage
        setSupplements([
          { 
            id: 1, 
            name: '☀️ Vitamin D3', 
            dosage: '2000 IU', 
            frequency: 'Daily with breakfast', 
            priority: 'High', 
            category: 'vitamins',
            description: 'Vitamin D3 is crucial for calcium absorption and bone health.',
            benefits: ['Bone strength', 'Immune support', 'Mood regulation'],
            recommendation: 'Based on your test results showing low vitamin D levels.',
            recommendedFor: ['Vitamin D Deficiency']
          },
          { 
            id: 2, 
            name: '✨ Magnesium Glycinate', 
            dosage: '400mg', 
            frequency: 'Daily before bed', 
            priority: 'Medium', 
            category: 'minerals',
            description: 'Magnesium is involved in over 300 enzymatic reactions in the body.',
            benefits: ['Muscle relaxation', 'Sleep quality', 'Stress reduction'],
            recommendation: 'Recommended for sleep quality and muscle tension.',
            recommendedFor: ['Sleep Quality Issues']
          },
          { 
            id: 3, 
            name: '🐟 Omega-3 Fish Oil', 
            dosage: '1000mg', 
            frequency: 'Daily with meal', 
            priority: 'High', 
            category: 'omega',
            description: 'Contains essential EPA and DHA fatty acids for heart and brain health.',
            benefits: ['Heart health', 'Brain function', 'Joint mobility'],
            recommendation: 'Recommended for cardiovascular support.',
            recommendedFor: ['Cardiovascular Health', 'Elevated Cholesterol']
          },
          { 
            id: 4, 
            name: '🌱 St. John\'s Wort', 
            dosage: '300mg', 
            frequency: 'Three times daily', 
            priority: 'Medium', 
            category: 'herbs',
            description: 'Herbal remedy traditionally used for mood support.',
            benefits: ['Mood support', 'Emotional wellbeing'],
            recommendation: 'Optional supplement for mood regulation.',
            recommendedFor: ['Mood Support']
          },
        ]);
      }
      
      // Load medications
      const savedMedications = localStorage.getItem('medications');
      if (savedMedications) {
        setMedications(JSON.parse(savedMedications));
      } else {
        setMedications(['Lisinopril', 'Synthroid', 'Simvastatin']);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);
  
  // Run interaction checks whenever supplements or medications change
  useEffect(() => {
    if (supplements.length > 0 || medications.length > 0) {
      const newInteractions = checkForInteractions(supplements, medications);
      setInteractions(newInteractions);
    }
  }, [supplements, medications]);
  
  // Add a new medication
  const handleAddMedication = () => {
    if (newMedication.trim() !== '') {
      const updatedMedications = [...medications, newMedication.trim()];
      setMedications(updatedMedications);
      setNewMedication('');
      
      // Save to localStorage
      localStorage.setItem('medications', JSON.stringify(updatedMedications));
    }
  };
  
  // Remove a medication
  const handleRemoveMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
    
    // Save to localStorage
    localStorage.setItem('medications', JSON.stringify(updatedMedications));
  };
  
  // Filter interactions based on severity
  const filteredInteractions = severityFilter === 'all' 
    ? interactions 
    : interactions.filter(interaction => interaction.severity === severityFilter);
  
  // Check for interactions between supplements and medications
  const checkForInteractions = (supplements: Supplement[], medications: string[]): Interaction[] => {
    const allInteractions: Interaction[] = [];
    
    // Knowledge base for supplement-supplement interactions
    const supplementInteractions = [
      { 
        supplement1: 'St. John\'s Wort', 
        supplement2: 'Omega-3 Fish Oil',
        severity: 'mild' as InteractionSeverity,
        effects: 'May increase bleeding risk when taken together at high doses.',
        recommendations: 'Monitor for bruising or unusual bleeding. Consider spacing doses apart.',
        sources: [{ title: 'Journal of Clinical Pharmacy and Therapeutics', url: 'https://example.com/jcpt' }]
      },
      { 
        supplement1: 'St. John\'s Wort', 
        supplement2: 'Vitamin D3',
        severity: 'none' as InteractionSeverity,
        effects: 'No known interactions.',
        recommendations: 'Safe to take together.',
        sources: [{ title: 'National Institutes of Health', url: 'https://ods.od.nih.gov' }]
      },
      { 
        supplement1: 'Magnesium Glycinate', 
        supplement2: 'Vitamin D3',
        severity: 'none' as InteractionSeverity,
        effects: 'Generally beneficial interaction; vitamin D may enhance magnesium absorption.',
        recommendations: 'Safe to take together.',
        sources: [{ title: 'Journal of the American Osteopathic Association', url: 'https://example.com/jaoa' }]
      },
    ];
    
    // Knowledge base for supplement-medication interactions
    const medicationInteractions = [
      { 
        supplement: 'St. John\'s Wort', 
        medication: 'Simvastatin',
        severity: 'severe' as InteractionSeverity,
        effects: 'St. John\'s Wort may reduce the effectiveness of Simvastatin by increasing its metabolism.',
        recommendations: 'Avoid combining these or consult healthcare provider for dose adjustments.',
        sources: [{ title: 'Drug Metabolism and Disposition', url: 'https://example.com/dmd' }]
      },
      { 
        supplement: 'St. John\'s Wort', 
        medication: 'Lisinopril',
        severity: 'moderate' as InteractionSeverity,
        effects: 'May reduce the effectiveness of Lisinopril.',
        recommendations: 'Monitor blood pressure closely if taking both. Consider alternative supplements.',
        sources: [{ title: 'Journal of Clinical Psychopharmacology', url: 'https://example.com/jcp' }]
      },
      { 
        supplement: 'Omega-3 Fish Oil', 
        medication: 'Lisinopril',
        severity: 'mild' as InteractionSeverity,
        effects: 'May enhance blood pressure-lowering effects.',
        recommendations: 'Monitor blood pressure. This may actually be beneficial but watch for too-low blood pressure.',
        sources: [{ title: 'American Journal of Hypertension', url: 'https://example.com/ajh' }]
      },
      { 
        supplement: 'Magnesium Glycinate', 
        medication: 'Synthroid',
        severity: 'moderate' as InteractionSeverity,
        effects: 'Magnesium may decrease Synthroid absorption if taken simultaneously.',
        recommendations: 'Take magnesium at least 4 hours apart from Synthroid.',
        sources: [{ title: 'Thyroid', url: 'https://example.com/thyroid' }]
      },
    ];
    
    // Check supplement-supplement interactions
    for (let i = 0; i < supplements.length; i++) {
      for (let j = i + 1; j < supplements.length; j++) {
        // Check both directions of potential interactions
        const interaction1 = supplementInteractions.find(
          int => (int.supplement1 === supplements[i].name.replace(/^[^ ]+ /, '') && 
                  int.supplement2 === supplements[j].name.replace(/^[^ ]+ /, ''))
        );
        
        const interaction2 = supplementInteractions.find(
          int => (int.supplement1 === supplements[j].name.replace(/^[^ ]+ /, '') && 
                  int.supplement2 === supplements[i].name.replace(/^[^ ]+ /, ''))
        );
        
        const interaction = interaction1 || interaction2;
        
        if (interaction && interaction.severity !== 'none') {
          allInteractions.push({
            id: `${supplements[i].id}-${supplements[j].id}`,
            supplementId: supplements[i].id,
            supplementName: supplements[i].name,
            interactsWith: supplements[j].name,
            interactionType: 'supplement-supplement',
            severity: interaction.severity,
            effects: interaction.effects,
            recommendations: interaction.recommendations,
            sources: interaction.sources
          });
        }
      }
    }
    
    // Check supplement-medication interactions
    for (const supplement of supplements) {
      for (const medication of medications) {
        const interaction = medicationInteractions.find(
          int => int.supplement === supplement.name.replace(/^[^ ]+ /, '') && 
                 int.medication === medication
        );
        
        if (interaction) {
          allInteractions.push({
            id: `${supplement.id}-${medication}`,
            supplementId: supplement.id,
            supplementName: supplement.name,
            interactsWith: medication,
            interactionType: 'supplement-medication',
            severity: interaction.severity,
            effects: interaction.effects,
            recommendations: interaction.recommendations,
            sources: interaction.sources
          });
        }
      }
    }
    
    return allInteractions;
  };
  
  // Skeleton loader for initial server render
  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Function to get appropriate color for severity badge
  const getSeverityColor = (severity: InteractionSeverity) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-100 text-red-800';
      case 'moderate':
        return 'bg-amber-100 text-amber-800';
      case 'mild':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Supplement Interactions</h1>
      <p className="text-gray-600 mb-6">Check for potential interactions between your supplements and medications</p>
      
      {/* Medications Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">My Medications</h2>
        <p className="text-gray-600 mb-4">
          Add your current medications to check for potential interactions with your supplements.
          This information is stored locally on your device and is never shared.
        </p>
        
        <div className="flex items-end mb-4 gap-2">
          <div className="flex-1">
            <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-1">
              Add Medication
            </label>
            <input
              type="text"
              id="medication"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter medication name"
            />
          </div>
          <button
            onClick={handleAddMedication}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Add
          </button>
        </div>
        
        {medications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {medications.map((medication, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center">
                <span className="text-gray-800 mr-2">{medication}</span>
                <button 
                  onClick={() => handleRemoveMedication(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No medications added yet.</p>
        )}
      </div>
      
      {/* Interaction Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Interaction Analysis</h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Filter:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as InteractionSeverity | 'all')}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Interactions</option>
              <option value="severe">Severe Only</option>
              <option value="moderate">Moderate & Severe</option>
              <option value="mild">All Concerns</option>
            </select>
          </div>
        </div>
        
        {interactions.length > 0 ? (
          <div className="space-y-4">
            {filteredInteractions.map((interaction) => (
              <motion.div
                key={interaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className={`px-6 py-4 border-l-4 ${
                  interaction.severity === 'severe' ? 'border-red-500 bg-red-50' :
                  interaction.severity === 'moderate' ? 'border-amber-500 bg-amber-50' :
                  'border-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{interaction.supplementName} + {interaction.interactsWith}</h3>
                      <div className="flex mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(interaction.severity)}`}>
                          {interaction.severity.charAt(0).toUpperCase() + interaction.severity.slice(1)}
                        </span>
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {interaction.interactionType === 'supplement-supplement' ? 'Supplement Interaction' : 'Medication Interaction'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-white">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Potential Effects</h4>
                    <p className="text-sm text-gray-600">{interaction.effects}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Recommendations</h4>
                    <p className="text-sm text-gray-600">{interaction.recommendations}</p>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Sources: {interaction.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.url} 
                          className="text-indigo-600 hover:text-indigo-500"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {source.title}{idx < interaction.sources.length - 1 ? ', ' : ''}
                        </a>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/dashboard/supplements`}
                      className="text-indigo-600 hover:text-indigo-500 text-sm"
                    >
                      View Supplement
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Interactions Found</h3>
            <p className="text-gray-600">
              {supplements.length === 0 || medications.length === 0 
                ? "Add supplements and medications to check for potential interactions."
                : "Your current supplements and medications don't have any known interactions."}
            </p>
          </div>
        )}
      </div>
      
      {/* Educational Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Understanding Interactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-red-800">⚠️</span>
              </div>
              <h4 className="font-medium text-red-800">Severe Interactions</h4>
            </div>
            <p className="text-sm text-red-700">
              Combinations that should be avoided due to significant health risks or 
              may drastically reduce the effectiveness of medications. Consult your 
              healthcare provider immediately.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-amber-800">⚠️</span>
              </div>
              <h4 className="font-medium text-amber-800">Moderate Interactions</h4>
            </div>
            <p className="text-sm text-amber-700">
              May require timing adjustments, dose modifications, or additional monitoring.
              These combinations can be taken together in most cases but with proper precautions.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-yellow-800">⚠️</span>
              </div>
              <h4 className="font-medium text-yellow-800">Mild Interactions</h4>
            </div>
            <p className="text-sm text-yellow-700">
              Minor effects that may occur but generally don't require changes to your 
              supplement or medication regimen. Worth monitoring but not a significant concern.
            </p>
          </div>
        </div>
        <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
              <span className="text-indigo-700 text-xl">ℹ️</span>
            </div>
            <div>
              <h4 className="font-medium text-indigo-800 mb-1">Medical Disclaimer</h4>
              <p className="text-sm text-indigo-700">
                This interaction checker provides general information and is not a substitute 
                for professional medical advice. Always consult with a healthcare provider 
                before making changes to your supplement or medication regimen. The information 
                provided is based on published research but may not be exhaustive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 