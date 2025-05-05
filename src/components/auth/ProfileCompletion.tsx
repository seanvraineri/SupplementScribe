'use client';

import { useState } from 'react';
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

export default function ProfileCompletion() {
  const { user, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [heightFeet, setHeightFeet] = useState('');  
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill data if available from Google profile
  useState(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName) {
      setError('Please provide your full name');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          age: age || null,
          gender: gender || null,
          height: heightFeet && heightInches ? convertHeightToCm(parseInt(heightFeet), parseInt(heightInches)) : null,
          weight: weightLbs ? convertLbsToKg(parseInt(weightLbs)) : null,
          profile_completed: true
        }
      });
      
      if (updateError) throw updateError;
      
      // Create or update user profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: fullName,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          height: heightFeet && heightInches ? convertHeightToCm(parseInt(heightFeet), parseInt(heightInches)) : null,
          weight: weightLbs ? convertLbsToKg(parseInt(weightLbs)) : null,
          updated_at: new Date().toISOString()
        });
        
      if (profileError) throw profileError;
      
      setSuccess('Profile completed successfully! Redirecting...');
      
      // Force a refresh of the page which will trigger the auth context to redirect
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Authentication Required</h2>
          <p className="mt-2 text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h1>
      <p className="text-gray-600 text-center mb-8">
        Please provide some additional information to help us personalize your supplement recommendations.
      </p>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name*
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age (years)
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            min="18"
            max="120"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (feet & inches)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center">
                <input
                  type="number"
                  id="heightFeet"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="4"
                  max="7"
                  placeholder="Feet"
                />
                <span className="ml-2 text-gray-700">ft</span>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <input
                  type="number"
                  id="heightInches"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  max="11"
                  placeholder="Inches"
                />
                <span className="ml-2 text-gray-700">in</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="weightLbs" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (pounds)
          </label>
          <div className="flex items-center">
            <input
              type="number"
              id="weightLbs"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="70"
              max="650"
              placeholder="Weight in pounds"
            />
            <span className="ml-2 text-gray-700">lbs</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-6">
          *Required field. Other fields are optional but help us provide better recommendations.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isSubmitting ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
} 