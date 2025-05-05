'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { calculateHealthScore, getHealthScore, HealthScoreResult } from '@/lib/health-score';

export default function HealthScoreWidget() {
  const { user } = useAuth();
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHealthScore() {
      if (!user) return;
      
      try {
        setLoading(true);
        const score = await getHealthScore(user.id);
        setHealthScore(score);
      } catch (err) {
        console.error('Error loading health score:', err);
        setError('Failed to load health score');
      } finally {
        setLoading(false);
      }
    }

    loadHealthScore();
  }, [user]);

  const handleRecalculate = async () => {
    if (!user) return;
    
    try {
      setCalculating(true);
      setError(null);
      const newScore = await calculateHealthScore(user.id);
      setHealthScore(newScore);
    } catch (err) {
      console.error('Error calculating health score:', err);
      setError('Failed to calculate health score');
    } finally {
      setCalculating(false);
    }
  };

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Helper function to get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!healthScore) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Score</h3>
        <p className="text-gray-600 mb-4">Your health score hasn't been calculated yet.</p>
        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {calculating ? 'Calculating...' : 'Calculate Now'}
        </button>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Health Score</h3>
        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          {calculating ? 'Updating...' : 'Update'}
        </button>
      </div>
      
      {/* Main score */}
      <div className="flex items-center justify-center mb-6">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center ${getScoreBgColor(healthScore.totalScore)} border-4 ${getScoreColor(healthScore.totalScore)} border-opacity-50`}>
          <div className="text-center">
            <span className={`text-3xl font-bold ${getScoreColor(healthScore.totalScore)}`}>{healthScore.totalScore}</span>
            <span className="block text-xs text-gray-500">out of 100</span>
          </div>
        </div>
      </div>
      
      {/* Sub-scores */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center">
          <div className={`text-xl font-semibold ${getScoreColor(healthScore.biomarkerScore)}`}>
            {healthScore.biomarkerScore}
          </div>
          <div className="text-xs text-gray-500">Biomarkers</div>
        </div>
        <div className="text-center">
          <div className={`text-xl font-semibold ${getScoreColor(healthScore.geneticScore)}`}>
            {healthScore.geneticScore}
          </div>
          <div className="text-xs text-gray-500">Genetics</div>
        </div>
        <div className="text-center">
          <div className={`text-xl font-semibold ${getScoreColor(healthScore.lifestyleScore)}`}>
            {healthScore.lifestyleScore}
          </div>
          <div className="text-xs text-gray-500">Lifestyle</div>
        </div>
      </div>
      
      {/* Improvement tips */}
      {healthScore.improvementTips.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ways to improve your score:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {healthScore.improvementTips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Last updated */}
      <div className="mt-4 text-xs text-gray-400 text-right">
        Last updated: {new Date().toLocaleDateString()}
      </div>
      
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}
