'use client';

import Link from 'next/link';
import { useState } from 'react';

type Supplement = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  description: string;
  benefitsText: string;
  price: number;
  purchaseLink: string;
  studyLinks: string[];
};

export default function ResultsPage() {
  // This would come from the API/backend in a real implementation
  const [supplements, setSupplements] = useState<Supplement[]>([
    {
      id: '1',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'Daily',
      description: 'Supports bone health, immune function, and mood regulation.',
      benefitsText: 'Research suggests that Vitamin D3 may help improve your calcium absorption, bone density, and immune function based on your blood work results.',
      price: 15.99,
      purchaseLink: 'https://example.com/vitamin-d3',
      studyLinks: [
        'https://pubmed.ncbi.nlm.nih.gov/12456789',
        'https://pubmed.ncbi.nlm.nih.gov/23456789',
      ],
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      dosage: '1000 mg',
      frequency: 'Twice daily',
      description: 'Supports heart health, brain function, and reduces inflammation.',
      benefitsText: 'Based on your genetic markers, Omega-3 supplementation may help reduce inflammation markers and support cardiovascular health.',
      price: 24.99,
      purchaseLink: 'https://example.com/omega-3',
      studyLinks: [
        'https://pubmed.ncbi.nlm.nih.gov/34567890',
        'https://pubmed.ncbi.nlm.nih.gov/45678901',
      ],
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      dosage: '400 mg',
      frequency: 'Daily before bed',
      description: 'Supports muscle relaxation, sleep quality, and stress management.',
      benefitsText: 'Your blood work indicates slightly low magnesium levels. Supplementation may improve your sleep quality and muscle recovery.',
      price: 18.99,
      purchaseLink: 'https://example.com/magnesium',
      studyLinks: [
        'https://pubmed.ncbi.nlm.nih.gov/56789012',
      ],
    },
  ]);

  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
  };

  const totalCost = supplements.reduce((acc, supp) => acc + supp.price, 0);

  return (
    <main className="min-h-screen py-12 px-4 md:px-6 lg:px-8 bg-apple-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-apple shadow-apple p-8 mb-8">
          <h1 className="text-3xl font-bold text-apple-gray-900 mb-2">Your Personalized Supplement Plan</h1>
          <p className="text-apple-gray-600 mb-6">
            Based on your health profile, genetic data, and blood work results, we've created the following supplement recommendations.
          </p>

          <div className="mb-10 border-b border-apple-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-apple-gray-900 mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-apple-gray-500 mb-1">Recommended Supplements</h3>
                <p className="text-lg font-medium text-apple-gray-900">{supplements.length} items</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-apple-gray-500 mb-1">Estimated Monthly Cost</h3>
                <p className="text-lg font-medium text-apple-gray-900">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Recommended Supplements</h2>
          
          <div className="space-y-6">
            {supplements.map((supplement) => (
              <div key={supplement.id} className="border border-apple-gray-200 rounded-apple overflow-hidden">
                <div className="bg-apple-gray-50 p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(supplement.id)}>
                  <div>
                    <h3 className="text-lg font-medium text-apple-gray-900">{supplement.name}</h3>
                    <p className="text-sm text-apple-gray-600">{supplement.dosage} · {supplement.frequency}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-apple-gray-900 font-medium mr-4">${supplement.price.toFixed(2)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-apple-gray-500 transition-transform ${expanded === supplement.id ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {expanded === supplement.id && (
                  <div className="p-4 border-t border-apple-gray-200">
                    <p className="text-apple-gray-700 mb-4">{supplement.description}</p>
                    
                    <div className="mb-4 bg-apple-blue/5 p-4 rounded-apple">
                      <h4 className="text-sm font-semibold text-apple-blue mb-2">Personalized Benefits</h4>
                      <p className="text-sm text-apple-gray-700">{supplement.benefitsText}</p>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-apple-gray-900 mb-2">Scientific Research</h4>
                    <ul className="mb-6 space-y-1 pl-5 list-disc text-sm text-apple-gray-600">
                      {supplement.studyLinks.map((link, idx) => (
                        <li key={idx}>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-apple-blue hover:underline">
                            PubMed Study #{idx + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                    
                    <a 
                      href={supplement.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-apple text-sm font-medium text-white bg-apple-blue hover:bg-apple-light-blue transition-colors"
                    >
                      Purchase {supplement.name}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-apple shadow-apple p-8">
          <h2 className="text-xl font-semibold text-apple-gray-900 mb-4">Have Questions About Your Plan?</h2>
          <p className="text-apple-gray-600 mb-6">
            Our AI supplement expert can answer any questions you may have about your personalized recommendations.
          </p>
          <div className="flex justify-between">
            <Link
              href="/chat"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-apple text-sm font-medium text-white bg-apple-blue hover:bg-apple-light-blue transition-colors"
            >
              Chat with AI Expert
            </Link>
            <Link
              href="/get-started"
              className="inline-flex items-center px-4 py-2 border border-apple-gray-300 rounded-apple text-sm font-medium text-apple-gray-700 bg-white hover:bg-apple-gray-50"
            >
              Update Health Profile
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 