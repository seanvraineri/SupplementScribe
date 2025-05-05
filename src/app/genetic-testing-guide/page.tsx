'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PrimaryNav from '@/components/ui/PrimaryNav';
import { useSearchParams, useRouter } from 'next/navigation';

// FAQ type
type FAQ = {
  question: string;
  answer: string;
};

// Test provider type
type TestProvider = {
  name: string;
  logoUrl: string;
  price: string;
  featuresIncluded: string[];
  compatibility: string;
  timeToResults: string;
  website: string;
};

export default function GeneticTestingGuidePage() {
  const [activeTab, setActiveTab] = useState<'why' | 'options' | 'howto'>('why');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get the 'from' parameter to detect if user came from onboarding
  const fromOnboarding = searchParams.get('from') === 'onboarding';
  const onboardingStep = searchParams.get('step') || '';

  // Function to handle returning to onboarding
  const returnToOnboarding = () => {
    if (onboardingStep) {
      router.push(`/onboarding?step=${onboardingStep}`);
    } else {
      router.push('/onboarding');
    }
  };

  // Test providers data
  const testProviders: TestProvider[] = [
    {
      name: "23andMe",
      logoUrl: "/images/providers/23andme-logo.png",
      price: "$99+",
      featuresIncluded: [
        "Raw DNA data download",
        "Health predispositions",
        "Trait reports",
        "Carrier status reports"
      ],
      compatibility: "Excellent - Direct integration with our platform",
      timeToResults: "3-4 weeks",
      website: "https://www.23andme.com"
    },
    {
      name: "AncestryDNA",
      logoUrl: "/images/providers/ancestry-logo.png",
      price: "$99+",
      featuresIncluded: [
        "Raw DNA data download",
        "Ethnicity estimate",
        "DNA matches"
      ],
      compatibility: "Good - Some manual steps required",
      timeToResults: "6-8 weeks",
      website: "https://www.ancestry.com/dna"
    },
    {
      name: "MyHeritage",
      logoUrl: "/images/providers/myheritage-logo.png",
      price: "$79+",
      featuresIncluded: [
        "Raw DNA data download",
        "Ethnicity estimate",
        "DNA matches"
      ],
      compatibility: "Good - Some manual steps required",
      timeToResults: "3-4 weeks",
      website: "https://www.myheritage.com/dna"
    },
    {
      name: "CircleDNA",
      logoUrl: "/images/providers/circledna-logo.png",
      price: "$189+",
      featuresIncluded: [
        "Raw DNA data download",
        "Health reports",
        "Diet & nutrition reports"
      ],
      compatibility: "Good - Some manual steps required",
      timeToResults: "2-3 weeks",
      website: "https://circledna.com"
    }
  ];

  // FAQ data
  const faqs: FAQ[] = [
    {
      question: "Is my genetic data secure with SupplementScribe?",
      answer: "Absolutely. We use bank-level encryption (AES-256) for all genetic data. Your data is never shared with third parties and you can request data deletion at any time. We only use your genetic information to provide personalized supplement recommendations."
    },
    {
      question: "Which genetic testing service provides the most useful data for supplements?",
      answer: "23andMe provides the most comprehensive genetic data relevant to nutrition and supplement needs. Their Health + Ancestry service includes many SNPs related to vitamin metabolism, detoxification pathways, and methylation cycles that are crucial for supplement optimization."
    },
    {
      question: "Do I need the most expensive genetic test kit?",
      answer: "No. For supplement optimization purposes, even the basic ancestry tests provide the raw genetic data we need. The premium features of these tests are mostly related to health conditions and ancestry information, not the raw genetic data itself."
    },
    {
      question: "How often do I need to get tested?",
      answer: "Your genetic information doesn't change, so you only need to get tested once. However, we recommend uploading new blood tests and biomarker data regularly (every 3-6 months) to continuously refine your supplement regimen."
    },
    {
      question: "What if I already got tested through another service?",
      answer: "If you already have your raw genetic data from 23andMe, AncestryDNA, MyHeritage, or FamilyTreeDNA, you can simply upload that file to our platform without purchasing a new test."
    },
    {
      question: "How long before I see results of my genetic testing?",
      answer: "Most genetic testing companies deliver results within 3-8 weeks after receiving your sample. Once you have your results, our platform can provide personalized supplement recommendations immediately after you upload your data."
    }
  ];

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Apple-style background with gradient and subtle patterns */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-apple-light-gray dark:bg-gray-900"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-apple-blue/5 dark:bg-apple-blue/10 blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[80px]"></div>
        <div className="absolute inset-0 dashboard-grid-bg opacity-[0.2] dark:opacity-[0.05]"></div>
      </div>

      <PrimaryNav />
      
      {/* Display a banner if user came from onboarding */}
      {fromOnboarding && (
        <div className="bg-apple-blue/10 border-b border-apple-blue/20">
          <div className="apple-container py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-2 rounded-lg bg-apple-blue/20">
                  <svg className="h-6 w-6 text-apple-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <p className="ml-3 font-medium text-apple-blue truncate">
                  <span className="md:inline">Taking a detour? You can continue your onboarding process anytime.</span>
                </p>
              </div>
              <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                <button
                  onClick={returnToOnboarding}
                  className="apple-button-small"
                >
                  Continue Onboarding
                </button>
              </div>
              <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                <button
                  type="button"
                  className="-mr-1 flex p-2 rounded-md hover:bg-apple-blue/10 focus:outline-none focus:ring-2 focus:ring-apple-blue"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-6 w-6 text-apple-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="apple-container py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="apple-headline mb-4">
            Genetic Testing Guide for Supplement Optimization
          </h1>
          <p className="apple-subheadline max-w-3xl mx-auto">
            Understand how genetic testing can revolutionize your supplement regimen with science-backed, personalized recommendations.
          </p>
        </div>
        
        {/* Tabs navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-10">
          <nav className="-mb-px flex space-x-8 justify-center">
            <button
              onClick={() => setActiveTab('why')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'why'
                  ? 'border-apple-blue text-apple-blue dark:text-apple-blue-light'
                  : 'border-transparent text-apple-gray hover:text-apple-black dark:hover:text-white hover:border-gray-300'
              }`}
            >
              Why Genetic Testing Matters
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'options'
                  ? 'border-apple-blue text-apple-blue dark:text-apple-blue-light'
                  : 'border-transparent text-apple-gray hover:text-apple-black dark:hover:text-white hover:border-gray-300'
              }`}
            >
              Testing Options
            </button>
            <button
              onClick={() => setActiveTab('howto')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'howto'
                  ? 'border-apple-blue text-apple-blue dark:text-apple-blue-light'
                  : 'border-transparent text-apple-gray hover:text-apple-black dark:hover:text-white hover:border-gray-300'
              }`}
            >
              How to Use Your Results
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="max-w-4xl mx-auto">
          {/* Why Genetic Testing Matters */}
          {activeTab === 'why' && (
            <div className="animate-fade-in">
              <div className="apple-card mb-10">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-apple-blue to-purple-600 text-white p-8">
                    <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="p-8">
                    <h2 className="apple-title mb-4">The Genetic Advantage</h2>
                    <p className="apple-body mb-4">
                      Your DNA contains crucial information about how your body processes nutrients, vitamins, and minerals. These genetic variations can significantly impact which supplements will benefit you most and in what dosages.
                    </p>
                    <p className="apple-body">
                      By understanding your unique genetic profile, we can create a supplement regimen that works with your biology, not against it, leading to better health outcomes and more efficient use of your supplement budget.
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="apple-title mb-6">Key Benefits of Genetic Testing for Supplements</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="apple-card">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="apple-feature-icon">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="ml-4 text-lg font-medium text-apple-black dark:text-white">Personalized Nutrient Forms</h4>
                    </div>
                    <p className="apple-body">
                      Many people have genetic variations that affect how they absorb and metabolize certain nutrients. For example, about 40% of people have MTHFR variants that limit their ability to process standard folic acid, making methylated forms more effective.
                    </p>
                  </div>
                </div>
                
                <div className="apple-card">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="apple-feature-icon">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                        </svg>
                      </div>
                      <h4 className="ml-4 text-lg font-medium text-apple-black dark:text-white">Dosage Optimization</h4>
                    </div>
                    <p className="apple-body">
                      Genetic variations can affect how quickly you metabolize certain compounds. Some people need higher or lower doses based on their genetic profile to achieve optimal levels without wasting money on ineffective dosing.
                    </p>
                  </div>
                </div>
                
                <div className="apple-card">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="apple-feature-icon">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <h4 className="ml-4 text-lg font-medium text-apple-black dark:text-white">Identify Hidden Sensitivities</h4>
                    </div>
                    <p className="apple-body">
                      Certain genetic variants can indicate sensitivities to supplements that might otherwise go undetected. By knowing these in advance, you can avoid supplements that might cause adverse reactions.
                    </p>
                  </div>
                </div>
                
                <div className="apple-card">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="apple-feature-icon">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="ml-4 text-lg font-medium text-apple-black dark:text-white">Long-term Health Optimization</h4>
                    </div>
                    <p className="apple-body">
                      By addressing your specific genetic predispositions with targeted supplements, you can help mitigate potential health risks and optimize long-term wellness outcomes specific to your genetic profile.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="apple-card apple-glass mb-10">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-apple-blue mb-3">Key Genetic Markers We Analyze</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-apple-blue mb-1">Methylation Pathways</h4>
                      <ul className="text-apple-body text-sm space-y-1">
                        <li>• MTHFR (C677T, A1298C)</li>
                        <li>• MTR & MTRR</li>
                        <li>• COMT</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-apple-blue mb-1">Vitamin D Metabolism</h4>
                      <ul className="text-apple-body text-sm space-y-1">
                        <li>• VDR (Taq1, Bsm)</li>
                        <li>• GC (Vitamin D binding protein)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-apple-blue mb-1">Detoxification</h4>
                      <ul className="text-apple-body text-sm space-y-1">
                        <li>• GSTP1, GSTM1, GSTT1</li>
                        <li>• SOD2</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-apple-blue mb-1">Inflammation</h4>
                      <ul className="text-apple-body text-sm space-y-1">
                        <li>• IL-6</li>
                        <li>• TNF-α</li>
                        <li>• CRP related genes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/get-started" className="apple-button">
                  Start Your Personalized Plan
                </Link>
                
                {fromOnboarding && (
                  <div className="mt-4">
                    <button
                      onClick={returnToOnboarding}
                      className="apple-button-secondary"
                    >
                      Back to Onboarding
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Testing Options */}
          {activeTab === 'options' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Testing Options</h2>
              <p className="text-gray-600 mb-8">
                We've evaluated the most popular genetic testing services based on cost, compatibility with our platform, and the usefulness of the data they provide for supplement optimization.
              </p>
              
              <div className="space-y-8 mb-12">
                {testProviders.map((provider, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="h-12 w-36 relative flex items-center justify-center bg-gray-100 rounded-md">
                            {/* Placeholder for provider logo */}
                            <span className="text-lg font-semibold text-gray-800">{provider.name}</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">Pricing from {provider.price}</h3>
                          </div>
                        </div>
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-blue-500 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
                        >
                          Visit Website
                        </a>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Features Included</h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {provider.featuresIncluded.map((feature, fidx) => (
                              <li key={fidx} className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Compatibility with SupplementScribe</h4>
                            <p className="text-sm text-gray-700">{provider.compatibility}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Time to Results</h4>
                            <p className="text-sm text-gray-700">{provider.timeToResults}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">Important Note</h3>
                    <div className="mt-2 text-yellow-700">
                      <p>
                        When ordering a genetic test, ensure you select the option to download your raw genetic data. This is essential for using the test with SupplementScribe. If you're uncomfortable with the health reports these companies provide, you can opt-out of those features while still getting the raw data we need.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/get-started" className="apple-button">
                  Start Your Personalized Plan
                </Link>
                
                {fromOnboarding && (
                  <div className="mt-4">
                    <button
                      onClick={returnToOnboarding}
                      className="apple-button-secondary"
                    >
                      Back to Onboarding
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* How to Use Your Results */}
          {activeTab === 'howto' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Using Your Genetic Test Results</h2>
              <p className="text-gray-600 mb-8">
                Once you have your genetic test results, here's how to use them with SupplementScribe to get your personalized supplement recommendations.
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Step 1: Download Your Raw Data</h3>
                  <p className="text-gray-600 mb-4">
                    After receiving your results notification from your testing provider, log into their website and download your raw genetic data file. This is typically a .txt or .csv file.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">How to download from popular services:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><span className="font-medium">23andMe:</span> Go to your account settings → Browse Raw Data → Download</li>
                      <li><span className="font-medium">AncestryDNA:</span> Go to Settings → Download Raw DNA Data</li>
                      <li><span className="font-medium">MyHeritage:</span> Go to DNA → Manage DNA kits → Actions → Download</li>
                      <li><span className="font-medium">CircleDNA:</span> Sign in → Profile → Download Raw Data</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Step 2: Upload to SupplementScribe</h3>
                  <p className="text-gray-600 mb-4">
                    Sign up or log in to your SupplementScribe account, navigate to the onboarding process or Settings → Health Data, and upload your raw data file in the designated area.
                  </p>
                  <div className="flex items-center justify-center bg-gray-50 p-6 rounded-md">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <h4 className="mt-2 text-sm font-medium text-gray-700">Upload Data File</h4>
                      <p className="mt-1 text-xs text-gray-500">Drag and drop or click to select file</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Step 3: Complete Health Questionnaire</h3>
                  <p className="text-gray-600 mb-4">
                    For the most accurate recommendations, complete the health questionnaire that covers your symptoms, goals, medical history, and lifestyle factors. This context helps our algorithm interpret your genetic data more effectively.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Step 4: Review Your Personalized Recommendations</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI-powered system will analyze your genetic data and questionnaire responses to generate personalized supplement recommendations. These include specific forms, dosages, and timing guidelines tailored to your unique genetic profile.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Your recommendations will include:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Personalized supplement stack with specific forms and dosages</li>
                      <li>• Explanation of how each recommendation relates to your genetic variants</li>
                      <li>• Scientific references supporting each recommendation</li>
                      <li>• Potential interactions with medications or other supplements</li>
                      <li>• Recommended timing and cycling protocols</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-pink-500">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Step 5: Track and Refine</h3>
                  <p className="text-gray-600 mb-4">
                    As you implement your supplement protocol, track your progress and any changes in symptoms using our tracking tools. Our system will help you refine your regimen over time, especially when combined with periodic blood tests.
                  </p>
                </div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100 mb-8">
                <h3 className="text-lg font-medium text-indigo-900 mb-3">Combining Genetic Data with Blood Tests</h3>
                <p className="text-indigo-700 mb-4">
                  For the most complete picture of your health and supplement needs, we strongly recommend combining your genetic data with periodic blood tests. This approach allows us to:
                </p>
                <ul className="space-y-2 text-indigo-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>See how your body is currently functioning, not just its genetic tendencies</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Track your progress and adjust recommendations based on how your body responds</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Identify deficiencies that might not be predicted by genetics alone</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <Link href="/get-started" className="apple-button">
                  Start Your Personalized Plan
                </Link>
                
                {fromOnboarding && (
                  <div className="mt-4">
                    <button
                      onClick={returnToOnboarding}
                      className="apple-button-secondary"
                    >
                      Back to Onboarding
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* FAQs */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="apple-title text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="apple-card overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                >
                  <span className="font-medium text-apple-black dark:text-white">{faq.question}</span>
                  <svg 
                    className={`h-5 w-5 text-apple-gray transform ${expandedFaq === index ? 'rotate-180' : ''} transition-transform duration-200`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="apple-body">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section with Return to Onboarding */}
        <div className="mt-16 bg-gradient-to-r from-apple-blue to-purple-600 rounded-2xl shadow-lg overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white">Ready to optimize your supplements?</h2>
              <p className="mt-4 text-lg text-blue-100">
                Upload your genetic data and get personalized recommendations backed by science, not generic advice.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="inline-flex rounded-md shadow">
                  <Link href="/get-started" className="apple-button bg-white text-apple-blue hover:bg-gray-50">
                    Get Started
                  </Link>
                </div>
                
                {fromOnboarding ? (
                  <div className="inline-flex">
                    <button
                      onClick={returnToOnboarding}
                      className="apple-button-secondary border-white text-white"
                    >
                      Return to Onboarding
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex">
                    <Link href="/pricing" className="apple-button-secondary border-white text-white">
                      View Pricing
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 