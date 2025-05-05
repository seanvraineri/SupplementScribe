'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PrimaryNav from '@/components/ui/PrimaryNav';
import PrivacyDisclaimer from '@/components/ui/PrivacyDisclaimer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// Conversion functions
function convertHeightToCm(feet: number, inches: number): number {
  const totalInches = (feet * 12) + inches;
  return Math.round(totalInches * 2.54 * 10) / 10; // Convert to cm with 1 decimal place
}

function convertLbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10; // Convert to kg with 1 decimal place
}

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState('');
  const [showReferralBanner, setShowReferralBanner] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Basic info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Health questions
    age: '',
    biologicalSex: '',
    // Height and weight in American units
    heightFeet: '',
    heightInches: '',
    weightLbs: '',
    healthGoals: [] as string[],
    customGoal: '',
    medicalConditions: [] as string[],
    otherCondition: '',
    medications: '',
    allergies: [] as string[],
    otherAllergy: '',
    dnaFile: null,
    bloodTestFile: null,
    activityLevel: '',
    sleepHours: '',
    smokingStatus: '',
    alcoholFrequency: '',
    dietaryPattern: '',
    monthlyBudget: 50,
    // Genetic testing preferences
    hasGeneticTest: '',
    interestedInTest: '',
    preferredGeneticTest: '',
    disclaimerAccepted: false
  });

  const totalSteps = 12;
  
  useEffect(() => {
    // Check if there's a referral code in the URL
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      setShowReferralBanner(true);
      
      // In a real app, we would store this in localStorage or cookies
      // to persist it through the onboarding flow
      localStorage.setItem('referralCode', ref);
    }

    // Check if there's a step parameter in the URL
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepNumber = parseInt(stepParam, 10);
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= totalSteps) {
        setCurrentStep(stepNumber);

        // Also try to load any saved form data from localStorage
        try {
          const savedFormData = localStorage.getItem('onboardingFormData');
          if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
          }
        } catch (error) {
          console.error('Error loading saved form data:', error);
        }
      }
    }
  }, [searchParams]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('onboardingFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      const updatedArray = isChecked 
        ? [...formData.medicalConditions, value]
        : formData.medicalConditions.filter(item => item !== value);
      
      setFormData(prev => ({
        ...prev,
        [name === 'medicalConditions' ? 'medicalConditions' : 'allergies']: updatedArray
      }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAllergiesChange = (value: string) => {
    // If 'None' is selected, clear all other allergies
    if (value === 'None') {
      setFormData(prev => ({
        ...prev,
        allergies: prev.allergies.includes('None') ? [] : ['None']
      }));
      return;
    }
    
    // If any other allergy is selected, remove 'None'
    setFormData(prev => {
      const newAllergies = prev.allergies.includes(value)
        ? prev.allergies.filter(a => a !== value)
        : [...prev.allergies.filter(a => a !== 'None'), value];
      return { ...prev, allergies: newAllergies };
    });
  };

  const handleHealthGoalsChange = (value: string) => {
    setFormData(prev => {
      // Toggle the selected goal
      const newHealthGoals = prev.healthGoals.includes(value)
        ? prev.healthGoals.filter(goal => goal !== value)
        : [...prev.healthGoals, value];
      return { ...prev, healthGoals: newHealthGoals };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (!user) {
        // Store form data in localStorage for later
        localStorage.setItem('pendingOnboardingData', JSON.stringify(formData));
        
        // Redirect to login/signup
        router.push('/signup?redirect=/onboarding');
        return;
      }
      
      // First, save the form data
      // Get existing profile or create new one
      const { data: existingProfile, error: fetchError } = await supabase
        .from('health_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      // Prepare health goals string - combine selected goals and custom goal if provided
      const healthGoalsArray = [...formData.healthGoals];
      if (formData.customGoal.trim()) {
        healthGoalsArray.push(formData.customGoal.trim());
      }
      const healthGoalsString = healthGoalsArray.join(', ');
      
      const { error: profileError } = await supabase
        .from('health_profiles')
        .upsert({
          id: existingProfile?.id, // Use existing ID if available
          user_id: user.id,
          age: formData.age,
          gender: formData.biologicalSex,
          height: formData.heightFeet && formData.heightInches ? 
            convertHeightToCm(Number(formData.heightFeet), Number(formData.heightInches)) : null,
          weight: formData.weightLbs ? 
            convertLbsToKg(Number(formData.weightLbs)) : null,
          wellness_sensitivities: formData.allergies.join(', '), // Renamed from allergies
          wellness_considerations: formData.medicalConditions.join(', '), // Renamed from medical_conditions
          health_goals: healthGoalsString, // Save multiple health goals
          monthly_budget: parseInt(formData.monthlyBudget.toString()),
          onboarding_completed: true, // Mark onboarding as completed
          wellness_disclaimer_accepted: formData.disclaimerAccepted,
          disclaimer_accepted_at: formData.disclaimerAccepted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        });
        
      if (profileError) throw profileError;
      
      // Save genetic testing preferences if available
      if (formData.hasGeneticTest) {
        // Get the health profile ID first
        const { data: profileData, error: profileIdError } = await supabase
          .from('health_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (profileIdError) throw profileIdError;
        
        // Now insert the health file with correct schema fields
        const { error: geneticError } = await supabase
          .from('health_files')
          .insert({
            health_profile_id: profileData.id,
            file_path: formData.preferredGeneticTest || 'pending',
            file_type: 'genetic_test',
            file_name: `${formData.preferredGeneticTest || 'genetic'}_test.pdf`,
            file_size: 0 // Placeholder until actual file is uploaded
          });
          
        if (geneticError) throw geneticError;
      }
      
      // Clear stored form data
      localStorage.removeItem('onboardingFormData');
      localStorage.removeItem('pendingOnboardingData');
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSubmitError('There was an error saving your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Common Tailwind classes for styling consistency
  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-colors duration-200 ease-in-out text-sm md:text-base";
  const labelClass = "block text-gray-700 font-medium mb-2 text-sm md:text-base";
  const buttonClass = "inline-flex items-center justify-center rounded-full px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const checkboxClass = "sr-only";
  const customCheckboxClass = "w-5 h-5 rounded border-2 border-gray-300 mr-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ease-in-out";
  const customCheckboxCheckedClass = "border-indigo-600 bg-indigo-600";
  const checkboxLabelClass = "text-gray-700 select-none text-sm md:text-base pl-2";
  const radioClass = "sr-only";
  const customRadioClass = "w-5 h-5 rounded-full border-2 border-gray-300 mr-2 flex-shrink-0 flex items-center justify-center transition-colors duration-200 ease-in-out";
  const customRadioCheckedClass = "border-indigo-600 bg-indigo-600";
  const customRadioInnerClass = "w-1.5 h-1.5 rounded-full bg-white";
  const cardClass = "bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto border border-gray-100/80";
  // New class for select dropdowns
  const selectClass = `${inputClass} appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5em_1.5em] bg-[url(\'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3e%3cpath stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/%3e%3c/svg%3e\')]`;

  // Medical conditions list
  const commonConditions = [
    'Hypertension', 'Diabetes', 'Heart Disease', 'Thyroid Disorder', 
    'Depression/Anxiety', 'Autoimmune Condition', 'Gastrointestinal Issues', 
    'Migraines', 'Sleep Apnea', 'Chronic Pain', 'Cancer (current or history)'
  ];

  // Allergies list
  const commonAllergies = [
    'None', 'Soy', 'Gluten', 'Dairy', 'Shellfish', 'Nuts', 'Eggs'
  ];

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/10 to-purple-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-300/10 rounded-full blur-3xl"></div>
      </div>

      <PrimaryNav />
      
      {showReferralBanner && (
        <div className="bg-primary-50 border-b border-primary-100">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-2 rounded-lg bg-primary-100">
                  <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </span>
                <p className="ml-3 font-medium text-primary-800 truncate">
                  <span>You've been invited by a friend! You'll receive 20% off your first subscription.</span>
                </p>
              </div>
              <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                <span className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50">
                  Referral code: {referralCode}
                </span>
              </div>
              <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                <button
                  type="button"
                  onClick={() => setShowReferralBanner(false)}
                  className="-mr-1 flex p-2 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <section className="py-12 md:py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Wellness Profile</h1>
            <p className="text-gray-600">Let's set up your wellness profile to provide personalized supplement recommendations.</p>
            <p className="text-sm text-gray-500 mt-2">For general wellness purposes only. Not medical advice.</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 md:mb-10 max-w-3xl mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-right text-sm text-gray-500 font-medium">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Form Card */}
          <div className={cardClass}>
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Your Information</h2>
                    <div className="mb-6 space-y-4 md:space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className={labelClass}>First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className={labelClass}>Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            className={inputClass}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className={labelClass}>Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className={inputClass}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className={labelClass}>Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(123) 456-7890"
                          className={inputClass}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Optional. We'll only use this to send you important updates about your supplement plan.
                        </p>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-1">Privacy First</h3>
                        <p className="text-blue-700 text-sm">
                          Your data is protected with bank-grade encryption. We never sell or share your personal information with third parties.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Age */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Your Age</h2>
                    <div className="mb-6">
                      <label htmlFor="age" className={labelClass}>How old are you?</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        min="18"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter your age"
                        className={inputClass}
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        This helps us determine appropriate dosages and life-stage specific needs.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Biological Sex - Apply custom radio styles */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Biological Sex</h2>
                    <div className="mb-6">
                      <p className="mb-3 text-gray-700 text-sm md:text-base">For supplement recommendations related to specific biological needs.</p>
                      <div className="space-y-3">
                        {['Male', 'Female', 'Intersex', 'Prefer not to say'].map((option) => (
                          <label key={option} htmlFor={option.toLowerCase().replace(' ', '-')} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                            <input
                              type="radio"
                              id={option.toLowerCase().replace(' ', '-')}
                              name="biologicalSex"
                              value={option}
                              checked={formData.biologicalSex === option}
                              onChange={handleChange}
                              className={radioClass}
                            />
                            <span className={`${customRadioClass} ${formData.biologicalSex === option ? customRadioCheckedClass : 'bg-white'}`}>
                              {formData.biologicalSex === option && <span className={customRadioInnerClass}></span>}
                            </span>
                            <span className={checkboxLabelClass}>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-gray-500">
                        This information is used to determine needs for nutrients like iron, folate, and other hormone-related nutrients.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Health Goals - Using checkboxes for multiple selection */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Your Health Goals</h2>
                    <div className="mb-6">
                      <label className={labelClass}>What are you looking to improve? (Select all that apply)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {[
                          'Weight management',
                          'Energy & focus',
                          'Sleep & stress',
                          'Fitness performance',
                          'Longevity',
                          'Digestive health',
                          'Immune support',
                          'Cognitive function',
                          'Heart health',
                          'Joint & mobility'
                        ].map((goal) => (
                          <label key={goal} htmlFor={goal.toLowerCase().replace(/\s+/g, '-')} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                            <input
                              type="checkbox"
                              id={goal.toLowerCase().replace(/\s+/g, '-')}
                              name={goal}
                              value={goal}
                              checked={formData.healthGoals.includes(goal)}
                              onChange={() => handleHealthGoalsChange(goal)}
                              className={checkboxClass}
                            />
                            <span className={`${customCheckboxClass} ${formData.healthGoals.includes(goal) ? customCheckboxCheckedClass : 'bg-white'}`}>
                              {formData.healthGoals.includes(goal) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </span>
                            <span className={checkboxLabelClass}>
                              {goal}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="mt-3">
                        <label htmlFor="customGoal" className={labelClass}>Any other specific health goals? (Optional)</label>
                        <input
                          type="text"
                          id="customGoal"
                          name="customGoal"
                          value={formData.customGoal}
                          onChange={handleChange}
                          placeholder="Enter any additional health goals"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Your goals help us prioritize which scientific studies and nutrients will be most relevant for you.
                    </p>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 5: Medical Conditions */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Medical Conditions - Apply custom checkbox styles */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Medical Conditions</h2>
                    <div className="mb-6">
                      <label className={labelClass}>Select any conditions you have (if any):</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        {commonConditions.map((condition) => (
                          <label 
                            key={condition}
                            htmlFor={`condition-${condition.toLowerCase().replace(/\s+/g, '-')}`} 
                            className={`flex items-center cursor-pointer p-3 rounded-lg hover:bg-indigo-50/50 transition-colors`}
                          >
                            <input
                              type="checkbox"
                              id={`condition-${condition.toLowerCase().replace(/\s+/g, '-')}`}
                              name="medicalConditions"
                              value={condition}
                              checked={formData.medicalConditions.includes(condition)}
                              onChange={handleChange}
                              className={checkboxClass}
                            />
                            <span className={`${customCheckboxClass} ${formData.medicalConditions.includes(condition) ? customCheckboxCheckedClass : 'bg-white'}`}>
                              {formData.medicalConditions.includes(condition) && 
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              }
                            </span>
                            <span className={checkboxLabelClass}>
                              {condition}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="mt-4">
                        <label htmlFor="otherCondition" className={labelClass}>Other condition (if not listed):</label>
                        <input
                          type="text"
                          id="otherCondition"
                          name="otherCondition"
                          value={formData.otherCondition}
                          onChange={handleChange}
                          placeholder="Enter other medical condition"
                          className={inputClass}
                        />
                      </div>
                      
                      <p className="mt-3 text-sm text-gray-500">
                        This information is critical for our AI to check for potential interactions and contraindications with supplements.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Current Medications */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Current Medications</h2>
                    <div className="mb-6">
                      <label htmlFor="medications" className={labelClass}>List any prescription medications you're currently taking:</label>
                      <textarea
                        id="medications"
                        name="medications"
                        value={formData.medications}
                        onChange={handleChange}
                        placeholder="Example: Lisinopril, Levothyroxine, etc. (or type 'none')"
                        className={`${inputClass} h-28 md:h-32`}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        This helps us flag potentially dangerous interactions (e.g., St. John's wort with SSRIs).
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 7: Allergies/Intolerances - Apply custom checkbox styles */}
                {currentStep === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Allergies & Intolerances</h2>
                    <div className="mb-6">
                      <label className={labelClass}>Select any allergies or intolerances you have:</label>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {commonAllergies.map((allergy) => (
                           <label 
                            key={allergy}
                            htmlFor={`allergy-${allergy.toLowerCase()}`} 
                            className={`flex items-center cursor-pointer p-3 rounded-lg transition-colors ${allergy !== 'None' && formData.allergies.includes('None') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50/50'}`}
                          >
                            <input
                              type="checkbox"
                              id={`allergy-${allergy.toLowerCase()}`}
                              name="allergies"
                              value={allergy}
                              checked={formData.allergies.includes(allergy)}
                              onChange={() => handleAllergiesChange(allergy)}
                              className={checkboxClass}
                              disabled={allergy !== 'None' && formData.allergies.includes('None')}
                            />
                             {/* Custom Checkbox */}
                             <span className={`${customCheckboxClass} ${formData.allergies.includes(allergy) ? customCheckboxCheckedClass : 'bg-white'}`}>
                              {formData.allergies.includes(allergy) && 
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              }
                            </span>
                            <span className={checkboxLabelClass}>
                              {allergy}
                            </span>
                          </label>
                        ))}
                      </div>

                      {!formData.allergies.includes('None') && (
                        <div className="mt-4">
                          <label htmlFor="otherAllergy" className={labelClass}>Other allergies or intolerances:</label>
                          <input
                            type="text"
                            id="otherAllergy"
                            name="otherAllergy"
                            value={formData.otherAllergy}
                            onChange={handleChange}
                            placeholder="Enter other allergies"
                            className={inputClass}
                          />
                        </div>
                      )}
                      
                      <p className="mt-3 text-sm text-gray-500">
                        This helps us filter out supplements containing soy, gluten, dairy, shellfish, etc.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* New Step 8: Genetic Testing Information */}
                {currentStep === 8 && (
                  <motion.div
                    key="step8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Genetic Testing for Personalized Supplements</h2>
                    
                    <div className="mb-6 space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-blue-800 mb-2">Why Genetic Testing Matters</h3>
                        <p className="text-blue-700 text-sm mb-3">
                          Your genetic profile significantly impacts how your body processes nutrients. For example:
                        </p>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>MTHFR variants (found in ~40% of people) affect folate metabolism</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>VDR variants impact vitamin D absorption and utilization</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>GST gene variations affect detoxification pathways</span>
                          </li>
                        </ul>
                        <p className="text-blue-700 text-sm mt-3">
                          Genetic testing helps us recommend the right forms and doses of supplements specific to your needs.
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <label className={labelClass}>Have you already taken a genetic test?</label>
                        <div className="flex space-x-5 mt-2">
                          <label htmlFor="has-test-yes" className="flex items-center cursor-pointer p-2">
                            <input
                              type="radio"
                              id="has-test-yes"
                              name="hasGeneticTest"
                              value="Yes"
                              checked={formData.hasGeneticTest === 'Yes'}
                              onChange={handleChange}
                              className={radioClass}
                            />
                            <span className={`${customRadioClass} ${formData.hasGeneticTest === 'Yes' ? customRadioCheckedClass : 'bg-white'}`}>
                              {formData.hasGeneticTest === 'Yes' && <span className={customRadioInnerClass}></span>}
                            </span>
                            <span className={checkboxLabelClass}>Yes</span>
                          </label>
                          <label htmlFor="has-test-no" className="flex items-center cursor-pointer p-2">
                            <input
                              type="radio"
                              id="has-test-no"
                              name="hasGeneticTest"
                              value="No"
                              checked={formData.hasGeneticTest === 'No'}
                              onChange={handleChange}
                              className={radioClass}
                            />
                            <span className={`${customRadioClass} ${formData.hasGeneticTest === 'No' ? customRadioCheckedClass : 'bg-white'}`}>
                              {formData.hasGeneticTest === 'No' && <span className={customRadioInnerClass}></span>}
                            </span>
                            <span className={checkboxLabelClass}>No</span>
                          </label>
                        </div>
                      </div>

                      {formData.hasGeneticTest === 'No' && (
                        <div className="mt-4">
                          <label className={labelClass}>Would you be interested in taking a genetic test?</label>
                          <div className="flex space-x-5 mt-2">
                            <label htmlFor="interested-yes" className="flex items-center cursor-pointer p-2">
                              <input
                                type="radio"
                                id="interested-yes"
                                name="interestedInTest"
                                value="Yes"
                                checked={formData.interestedInTest === 'Yes'}
                                onChange={handleChange}
                                className={radioClass}
                              />
                              <span className={`${customRadioClass} ${formData.interestedInTest === 'Yes' ? customRadioCheckedClass : 'bg-white'}`}>
                                {formData.interestedInTest === 'Yes' && <span className={customRadioInnerClass}></span>}
                              </span>
                              <span className={checkboxLabelClass}>Yes</span>
                            </label>
                            <label htmlFor="interested-no" className="flex items-center cursor-pointer p-2">
                              <input
                                type="radio"
                                id="interested-no"
                                name="interestedInTest"
                                value="No"
                                checked={formData.interestedInTest === 'No'}
                                onChange={handleChange}
                                className={radioClass}
                              />
                              <span className={`${customRadioClass} ${formData.interestedInTest === 'No' ? customRadioCheckedClass : 'bg-white'}`}>
                                {formData.interestedInTest === 'No' && <span className={customRadioInnerClass}></span>}
                              </span>
                              <span className={checkboxLabelClass}>No</span>
                            </label>
                            <label htmlFor="interested-maybe" className="flex items-center cursor-pointer p-2">
                              <input
                                type="radio"
                                id="interested-maybe"
                                name="interestedInTest"
                                value="Maybe"
                                checked={formData.interestedInTest === 'Maybe'}
                                onChange={handleChange}
                                className={radioClass}
                              />
                              <span className={`${customRadioClass} ${formData.interestedInTest === 'Maybe' ? customRadioCheckedClass : 'bg-white'}`}>
                                {formData.interestedInTest === 'Maybe' && <span className={customRadioInnerClass}></span>}
                              </span>
                              <span className={checkboxLabelClass}>Maybe later</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {formData.interestedInTest === 'Yes' && (
                        <div className="mt-4">
                          <label htmlFor="preferredGeneticTest" className={labelClass}>Which genetic testing service would you prefer?</label>
                          <select
                            id="preferredGeneticTest"
                            name="preferredGeneticTest"
                            value={formData.preferredGeneticTest}
                            onChange={handleChange}
                            className={selectClass}
                          >
                            <option value="">Select test provider</option>
                            <option value="23andMe">23andMe ($99+)</option>
                            <option value="AncestryDNA">AncestryDNA ($99+)</option>
                            <option value="MyHeritage">MyHeritage ($79+)</option>
                            <option value="CircleDNA">CircleDNA ($189+)</option>
                            <option value="Undecided">Not sure yet</option>
                          </select>
                        </div>
                      )}

                      <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h3 className="font-medium text-indigo-800 mb-2">Recommended Tests</h3>
                        <p className="text-indigo-700 text-sm mb-2">
                          For supplement optimization, we recommend any of these tests:
                        </p>
                        <ul className="text-indigo-700 text-sm space-y-2">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-200 text-indigo-800 font-bold text-xs mr-2">1</div>
                            <div>
                              <span className="font-medium">23andMe</span> - Most comprehensive for nutrition & supplement needs
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-200 text-indigo-800 font-bold text-xs mr-2">2</div>
                            <div>
                              <span className="font-medium">AncestryDNA</span> - Good coverage of relevant SNPs
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-200 text-indigo-800 font-bold text-xs mr-2">3</div>
                            <div>
                              <span className="font-medium">MyHeritage</span> - Budget-friendly option with adequate coverage
                            </div>
                          </li>
                        </ul>
                        <div className="mt-4 text-center">
                          <Link 
                            href="/genetic-testing-guide?from=onboarding&step=8" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline inline-flex items-center"
                          >
                            View our complete genetic testing guide
                            <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Rename the original Step 8 (Upload Existing Data) to step 9 */}
                {currentStep === 9 && (
                  <motion.div
                    key="step9"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Upload Your Existing Data (Optional)</h2>
                    <div className="mb-6">
                      <p className="mb-4 text-gray-700">
                        This is where the magic happens! Upload your files to unlock biomarker-driven recommendations.
                      </p>
                      
                      <div className="space-y-5 md:space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 bg-gray-50/50 transition-all hover:border-blue-400 hover:bg-white">
                          <label htmlFor="dnaFile" className="cursor-pointer block text-center">
                            <div className="text-indigo-600 font-semibold mb-2 text-sm md:text-base">23andMe / Raw DNA File</div>
                            <div className="text-gray-500 text-xs md:text-sm mb-3">Drag & drop or click to upload (.txt, .csv, or .zip)</div>
                            <div className="flex justify-center">
                              <div className="bg-indigo-100 text-indigo-800 py-1.5 px-4 rounded-full text-xs md:text-sm font-medium inline-block">
                                {formData.dnaFile ? 'File selected' : 'Select file'}
                              </div>
                            </div>
                            <input
                              type="file"
                              id="dnaFile"
                              name="dnaFile"
                              onChange={handleChange}
                              className="hidden"
                              accept=".txt,.csv,.zip"
                            />
                          </label>
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 bg-gray-50/50 transition-all hover:border-blue-400 hover:bg-white">
                          <label htmlFor="bloodTestFile" className="cursor-pointer block text-center">
                            <div className="text-indigo-600 font-semibold mb-2 text-sm md:text-base">Blood Test Results</div>
                            <div className="text-gray-500 text-xs md:text-sm mb-3">Drag & drop or click to upload (.pdf, .jpg, or .csv)</div>
                            <div className="flex justify-center">
                              <div className="bg-indigo-100 text-indigo-800 py-1.5 px-4 rounded-full text-xs md:text-sm font-medium inline-block">
                                {formData.bloodTestFile ? 'File selected' : 'Select file'}
                              </div>
                            </div>
                            <input
                              type="file"
                              id="bloodTestFile"
                              name="bloodTestFile"
                              onChange={handleChange}
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.csv"
                            />
                          </label>
                        </div>
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-500">
                        These documents help us create a truly personalized plan based on your unique biomarkers and genetic SNPs.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 10: Lifestyle Snapshot (previously Step 9) */}
                {currentStep === 10 && (
                  <motion.div
                    key="step10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Lifestyle Snapshot</h2>
                    <div className="mb-6 space-y-4 md:space-y-5">
                      <div>
                        <label htmlFor="activityLevel" className={labelClass}>Activity Level</label>
                        <select
                          id="activityLevel"
                          name="activityLevel"
                          value={formData.activityLevel}
                          onChange={handleChange}
                          className={selectClass}
                          required
                        >
                          <option value="">Select your activity level</option>
                          <option value="Sedentary">Sedentary (little to no exercise)</option>
                          <option value="Moderate">Moderate (exercise 1-3 times/week)</option>
                          <option value="Active">Active (exercise 4-5 times/week)</option>
                          <option value="Athlete">Athlete (intense training 6+ times/week)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="sleepHours" className={labelClass}>Average Sleep Hours (per night)</label>
                        <select
                          id="sleepHours"
                          name="sleepHours"
                          value={formData.sleepHours}
                          onChange={handleChange}
                          className={selectClass}
                          required
                        >
                          <option value="">Select average sleep hours</option>
                          <option value="Less than 5">Less than 5 hours</option>
                          <option value="5-6">5-6 hours</option>
                          <option value="7-8">7-8 hours</option>
                          <option value="9+">9+ hours</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Smoking Status</label>
                        <div className="flex space-x-5">
                          <label htmlFor="smoking-yes" className="flex items-center cursor-pointer p-2">
                            <input
                              type="radio"
                              id="smoking-yes"
                              name="smokingStatus"
                              value="Yes"
                              checked={formData.smokingStatus === 'Yes'}
                              onChange={handleChange}
                              className={radioClass}
                            />
                            <span className={`${customRadioClass} ${formData.smokingStatus === 'Yes' ? customRadioCheckedClass : 'bg-white'}`}>
                              {formData.smokingStatus === 'Yes' && <span className={customRadioInnerClass}></span>}
                            </span>
                            <span className={checkboxLabelClass}>Yes</span>
                          </label>
                          <label htmlFor="smoking-no" className="flex items-center cursor-pointer p-2">
                            <input
                              type="radio"
                              id="smoking-no"
                              name="smokingStatus"
                              value="No"
                              checked={formData.smokingStatus === 'No'}
                              onChange={handleChange}
                              className={radioClass}
                            />
                            <span className={`${customRadioClass} ${formData.smokingStatus === 'No' ? customRadioCheckedClass : 'bg-white'}`}>
                              {formData.smokingStatus === 'No' && <span className={customRadioInnerClass}></span>}
                            </span>
                            <span className={checkboxLabelClass}>No</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="alcoholFrequency" className={labelClass}>Alcohol Consumption</label>
                        <select
                          id="alcoholFrequency"
                          name="alcoholFrequency"
                          value={formData.alcoholFrequency}
                          onChange={handleChange}
                          className={selectClass}
                          required
                        >
                          <option value="">Select frequency</option>
                          <option value="None">None</option>
                          <option value="Social">Social (occasional)</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Daily">Daily</option>
                        </select>
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        These factors help adjust recommendations for antioxidants, B-vitamins, and recovery nutrients.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 11: Dietary Pattern (previously Step 10) */}
                {currentStep === 11 && (
                  <motion.div
                    key="step11"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Dietary Pattern</h2>
                    <div className="mb-6">
                      <label className={labelClass}>What best describes your eating pattern?</label>
                      <div className="space-y-3">
                        {['Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 'Other'].map((diet) => (
                          <label key={diet} htmlFor={`diet-${diet.toLowerCase()}`} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-indigo-50/50 transition-colors">
                            <input
                              type="radio"
                              id={`diet-${diet.toLowerCase()}`}
                              name="dietaryPattern"
                              value={diet}
                              checked={formData.dietaryPattern === diet}
                              onChange={handleChange}
                              className={radioClass}
                            />
                            <span className={`${customRadioClass} ${formData.dietaryPattern === diet ? customRadioCheckedClass : 'bg-white'}`}>
                              {formData.dietaryPattern === diet && <span className={customRadioInnerClass}></span>}
                            </span>
                            <span className={checkboxLabelClass}>
                              {diet}
                            </span>
                          </label>
                        ))}
                      </div>
                      
                      <p className="mt-4 text-sm text-gray-500">
                        Different diets have common micronutrient gaps. This helps us identify potential deficiencies based on your food choices.
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600`}
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 12: Monthly Budget (previously Step 11) */}
                {currentStep === 12 && (
                  <motion.div
                    key="step12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Monthly Supplement Budget</h2>
                    <div className="mb-6">
                      <label htmlFor="monthlyBudget" className={labelClass}>
                        What's your monthly budget for supplements?
                        <span className="text-blue-600 font-bold ml-2">${formData.monthlyBudget}</span>
                      </label>
                      
                      <div className="mt-6 mb-8">
                        <input
                          type="range"
                          id="monthlyBudget"
                          name="monthlyBudget"
                          min="20"
                          max="200"
                          step="5"
                          value={formData.monthlyBudget}
                          onChange={handleChange}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>$20</span>
                          <span>$50</span>
                          <span>$100</span>
                          <span>$150</span>
                          <span>$200+</span>
                        </div>
                      </div>

                      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Ready to create your personalized plan</h3>
                        <p className="text-blue-700 text-sm">
                          We'll recommend supplements aligned with your goals and budget, prioritizing those with the strongest scientific evidence.
                        </p>
                      </div>
                      
                      <div className="mt-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                        <div className="flex items-start mb-2">
                          <div className="flex items-center h-5 mt-1">
                            <input
                              id="disclaimerAccepted"
                              name="disclaimerAccepted"
                              type="checkbox"
                              checked={formData.disclaimerAccepted}
                              onChange={(e) => setFormData({...formData, disclaimerAccepted: e.target.checked})}
                              className="w-4 h-4 border border-amber-300 rounded bg-amber-50 focus:ring-3 focus:ring-amber-300"
                              required
                            />
                          </div>
                          <div className="ml-3">
                            <label htmlFor="disclaimerAccepted" className="font-medium text-amber-800">
                              I understand that SupplementScribe is a <span className="font-bold">wellness application</span>, not a medical service
                            </label>
                            <p className="text-xs text-amber-700 mt-1">
                              By checking this box, I confirm that I understand SupplementScribe provides general wellness recommendations only, not medical advice. My information is processed for wellness purposes only and is not subject to HIPAA protections.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!formData.disclaimerAccepted || isSubmitting}
                        className={`${buttonClass} bg-gradient-to-r from-blue-600 to-indigo-600 ${!formData.disclaimerAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Creating...' : 'Create My Plan'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Trust badges */}
          <div className="mt-8 md:mt-10 max-w-3xl mx-auto text-center">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 text-sm font-medium">Bank-grade encryption</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 text-sm font-medium">Evidence-based protocol</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 text-sm font-medium">One-click data deletion</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 