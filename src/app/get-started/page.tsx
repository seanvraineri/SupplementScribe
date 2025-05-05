'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// Conversion functions
function convertHeightToCm(feet: number, inches: number): number {
  const totalInches = (feet * 12) + inches;
  return Math.round(totalInches * 2.54 * 10) / 10; // Convert to cm with 1 decimal place
}

function convertLbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10; // Convert to kg with 1 decimal place
}

type FormStep = 'basicInfo' | 'healthMetrics' | 'fileUpload' | 'budget';

export default function GetStarted() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<FormStep>('basicInfo');
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    email: '',
    age: '',
    gender: '',
    
    // Health metrics
    heightFeet: '',
    heightInches: '',
    weightLbs: '',
    allergies: '',
    conditions: '',
    
    // Budget
    monthlyBudget: '',
  });

  // Initialize form data from localStorage and check URL parameters on mount
  useEffect(() => {
    // Set client-side rendering flag
    setIsClient(true);
    
    // Try to load saved form data
    try {
      const savedFormData = localStorage.getItem('getStartedFormData');
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }

    // Check for the step parameter in the URL
    const stepParam = searchParams.get('step');
    if (stepParam) {
      if (stepParam === 'basicInfo' || stepParam === 'healthMetrics' || 
          stepParam === 'fileUpload' || stepParam === 'budget') {
        setCurrentStep(stepParam);
      }
    }
    
    // Preload images that will be needed later
    const preloadImages = () => {
      const imagesToPreload = [
        '/images/form-background.webp',
        '/images/upload-icon.svg'
      ];
      
      imagesToPreload.forEach(src => {
        // Use the global HTMLImageElement constructor instead of Next.js Image
        const img = new window.Image();
        img.src = src;
      });
    };
    
    preloadImages();
  }, [searchParams]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('getStartedFormData', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }
  }, [formData, isClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const goToNextStep = () => {
    if (currentStep === 'basicInfo') setCurrentStep('healthMetrics');
    else if (currentStep === 'healthMetrics') setCurrentStep('fileUpload');
    else if (currentStep === 'fileUpload') setCurrentStep('budget');
  };

  const goToPreviousStep = () => {
    if (currentStep === 'healthMetrics') setCurrentStep('basicInfo');
    else if (currentStep === 'fileUpload') setCurrentStep('healthMetrics');
    else if (currentStep === 'budget') setCurrentStep('fileUpload');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert American units to metric for database storage
    const heightCm = formData.heightFeet && formData.heightInches ? 
      convertHeightToCm(Number(formData.heightFeet), Number(formData.heightInches)) : null;
    
    const weightKg = formData.weightLbs ? 
      convertLbsToKg(Number(formData.weightLbs)) : null;
    
    // Create submission data with converted values
    const submissionData = {
      ...formData,
      height: heightCm, // Store height in cm in the database
      weight: weightKg, // Store weight in kg in the database
    };
    
    console.log('Form submitted:', submissionData);
    // TODO: Send data to API/Supabase
  };

  // Show loading state while client-side code initializes
  if (!isClient) {
    return (
      <main className="min-h-screen py-12 px-4 md:px-6 lg:px-8 bg-apple-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-apple-gray-600">Loading your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 md:px-6 lg:px-8 bg-apple-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-apple shadow-apple p-8">
        <h1 className="text-3xl font-bold text-apple-gray-900 mb-8 text-center">
          Create Your Personalized Supplement Plan
        </h1>
        
        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'basicInfo' ? 'bg-apple-blue text-white' : 'bg-apple-gray-200 text-apple-gray-600'
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm ${
                currentStep === 'basicInfo' ? 'text-apple-gray-900 font-medium' : 'text-apple-gray-500'
              }`}>Basic Info</span>
            </div>
            
            <div className="h-0.5 w-12 bg-apple-gray-200"></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'healthMetrics' ? 'bg-apple-blue text-white' : 'bg-apple-gray-200 text-apple-gray-600'
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm ${
                currentStep === 'healthMetrics' ? 'text-apple-gray-900 font-medium' : 'text-apple-gray-500'
              }`}>Health Metrics</span>
            </div>
            
            <div className="h-0.5 w-12 bg-apple-gray-200"></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'fileUpload' ? 'bg-apple-blue text-white' : 'bg-apple-gray-200 text-apple-gray-600'
              }`}>
                3
              </div>
              <span className={`ml-2 text-sm ${
                currentStep === 'fileUpload' ? 'text-apple-gray-900 font-medium' : 'text-apple-gray-500'
              }`}>Data Upload</span>
            </div>
            
            <div className="h-0.5 w-12 bg-apple-gray-200"></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'budget' ? 'bg-apple-blue text-white' : 'bg-apple-gray-200 text-apple-gray-600'
              }`}>
                4
              </div>
              <span className={`ml-2 text-sm ${
                currentStep === 'budget' ? 'text-apple-gray-900 font-medium' : 'text-apple-gray-500'
              }`}>Budget</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {currentStep === 'basicInfo' && (
            <div>
              <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-apple-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-apple-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-apple-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="18"
                    max="120"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-apple-gray-700 mb-1">Biological Sex</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Health Metrics */}
          {currentStep === 'healthMetrics' && (
            <div>
              <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Health Metrics</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="heightFeet" className="block text-sm font-medium text-apple-gray-700 mb-1">Height (ft)</label>
                    <input
                      type="number"
                      id="heightFeet"
                      name="heightFeet"
                      min="3"
                      max="8"
                      value={formData.heightFeet}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="heightInches" className="block text-sm font-medium text-apple-gray-700 mb-1">Height (in)</label>
                    <input
                      type="number"
                      id="heightInches"
                      name="heightInches"
                      min="0"
                      max="11"
                      value={formData.heightInches}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="weightLbs" className="block text-sm font-medium text-apple-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    id="weightLbs"
                    name="weightLbs"
                    min="50"
                    max="500"
                    value={formData.weightLbs}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium text-apple-gray-700 mb-1">Allergies or Sensitivities (Optional)</label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    rows={2}
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any allergies or sensitivities you have"
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="conditions" className="block text-sm font-medium text-apple-gray-700 mb-1">Health Conditions (Optional)</label>
                  <textarea
                    id="conditions"
                    name="conditions"
                    rows={2}
                    value={formData.conditions}
                    onChange={handleInputChange}
                    placeholder="List any health conditions you have"
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: File Upload - Conditionally rendered only on client side */}
          {currentStep === 'fileUpload' && (
            <div>
              <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Upload Your Health Data (Optional)</h2>
              
              <div className="space-y-6">
                <div className="bg-apple-gray-50 p-6 rounded-apple">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-apple-gray-900 mb-2">Blood Test Results</h3>
                    <p className="text-sm text-apple-gray-600 mb-4">
                      Upload your recent blood test results to get more personalized supplement recommendations.
                    </p>
                    
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="blood-work" className="flex flex-col items-center justify-center w-full h-32 border-2 border-apple-gray-300 border-dashed rounded-apple cursor-pointer bg-apple-gray-50 hover:bg-apple-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {/* Optimized SVG with reduced complexity */}
                          <svg className="w-10 h-10 mb-3 text-apple-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mb-2 text-sm text-apple-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-apple-gray-500">PDF, CSV, or TXT (Max 10MB)</p>
                        </div>
                        <input id="blood-work" name="blood-work" type="file" className="sr-only" accept=".csv,.txt,.pdf" />
                      </label>
                    </div>
                    <div className="mt-3 text-xs text-apple-gray-500">
                      Compatible with most lab results formats (LabCorp, Quest, etc.)
                    </div>
                  </div>
                </div>
                
                <div className="bg-apple-gray-50 p-6 rounded-apple">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-apple-gray-900 mb-2">Genetic Data</h3>
                    <p className="text-sm text-apple-gray-600 mb-4">
                      Upload your genetic data to receive personalized nutrigenomic recommendations.
                    </p>
                    
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="genetic-data" className="flex flex-col items-center justify-center w-full h-32 border-2 border-apple-gray-300 border-dashed rounded-apple cursor-pointer bg-apple-gray-50 hover:bg-apple-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-10 h-10 mb-3 text-apple-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mb-2 text-sm text-apple-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-apple-gray-500">PDF, CSV, or TXT (Max 10MB)</p>
                        </div>
                        <input id="genetic-data" name="genetic-data" type="file" className="sr-only" accept=".csv,.txt,.pdf" />
                      </label>
                    </div>
                    <div className="mt-3 text-xs text-apple-gray-500">
                      Compatible with: 23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-apple-gray-500">
                  Uploading your data is optional but helps us provide more accurate recommendations. Your data is encrypted and never shared with third parties.
                </p>
              </div>
            </div>
          )}
          
          {/* Step 4: Budget */}
          {currentStep === 'budget' && (
            <div>
              <h2 className="text-xl font-semibold text-apple-gray-900 mb-6">Supplement Budget</h2>
              
              <div className="space-y-4">
                <p className="text-sm text-apple-gray-600 mb-4">
                  Please specify your monthly budget for supplements. This helps us recommend products that fit within your price range.
                </p>
                
                <div>
                  <label htmlFor="monthlyBudget" className="block text-sm font-medium text-apple-gray-700 mb-1">Monthly Budget (USD)</label>
                  <input
                    type="number"
                    id="monthlyBudget"
                    name="monthlyBudget"
                    min="0"
                    step="10"
                    value={formData.monthlyBudget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-apple-gray-300 rounded-apple focus:ring-apple-blue focus:border-apple-blue"
                    required
                  />
                </div>
                
                <div className="bg-apple-gray-50 p-4 rounded-apple mt-6">
                  <p className="text-sm text-apple-gray-600">
                    We'll use your budget to prioritize high-quality supplements that provide the best value for your specific health needs.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="mt-10 flex justify-between">
            {currentStep !== 'basicInfo' ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="inline-flex items-center px-4 py-2 border border-apple-gray-300 rounded-apple text-sm font-medium text-apple-gray-700 bg-white hover:bg-apple-gray-50"
              >
                Back
              </button>
            ) : (
              <Link href="/" className="inline-flex items-center px-4 py-2 border border-apple-gray-300 rounded-apple text-sm font-medium text-apple-gray-700 bg-white hover:bg-apple-gray-50">
                Cancel
              </Link>
            )}
            
            {currentStep !== 'budget' ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-apple shadow-sm text-sm font-medium text-white bg-apple-blue hover:bg-apple-light-blue"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-apple shadow-sm text-sm font-medium text-white bg-apple-blue hover:bg-apple-light-blue"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
