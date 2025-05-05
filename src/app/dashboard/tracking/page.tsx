'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CalendarView from '@/components/ui/CalendarView';
import { Supplement } from '@/types/supplement';

export default function TrackingPage() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const [supplements, setSupplements] = useState<Supplement[]>([
    {
        id: 1,
        name: '☀️ Vitamin D3',
        dosage: '2000 IU',
        frequency: 'Daily',
        timeOfDay: ['Morning'],
        taken: false,
        streak: 12,
        adherence: 92,
        priority: 'High',
        category: 'vitamins',
        description: 'Vitamin D3 (cholecalciferol) is crucial for calcium absorption and bone health.',
        benefits: ['Bone strength', 'Immune support', 'Mood regulation'],
        recommendation: 'Based on your vitamin D levels being below optimal range.',
        recommendedFor: ['Vitamin D Deficiency']
    },
    {
        id: 2,
        name: '✨ Magnesium Glycinate',
        dosage: '400mg',
        frequency: 'Daily',
        timeOfDay: ['Evening'],
        taken: false,
        streak: 8,
        adherence: 85,
        priority: 'Medium',
        category: 'minerals',
        description: 'Magnesium is involved in over 300 enzymatic reactions in the body.',
        benefits: ['Muscle relaxation', 'Sleep quality', 'Stress reduction'],
        recommendation: 'Recommended for sleep quality and muscle tension.',
        recommendedFor: ['Sleep Quality Issues', 'Stress Management']
    },
    {
        id: 3,
        name: '🐟 Omega-3 Fish Oil',
        dosage: '1000mg',
        frequency: 'Daily',
        timeOfDay: ['Morning', 'Evening'],
        taken: false,
        streak: 15,
        adherence: 95,
        priority: 'High',
        category: 'omega',
        description: 'Contains essential EPA and DHA fatty acids that support heart and brain health.',
        benefits: ['Heart health', 'Brain function', 'Joint mobility'],
        recommendation: 'Recommended for cardiovascular support and inflammation reduction.',
        recommendedFor: ['Elevated Cholesterol', 'Cardiovascular Health']
    },
    {
        id: 4,
        name: '⚡ Zinc',
        dosage: '15mg',
        frequency: 'Daily',
        timeOfDay: ['Morning'],
        taken: false,
        streak: 10,
        adherence: 88,
        priority: 'Medium',
        category: 'minerals',
        description: 'Essential mineral for immune function and protein synthesis.',
        benefits: ['Immune support', 'Skin health', 'Enzyme function'],
        recommendation: 'Recommended for immune system support.',
        recommendedFor: ['Immune Support']
    },
    {
        id: 5,
        name: '🦠 Probiotics',
        dosage: '10 Billion CFU',
        frequency: 'Daily',
        timeOfDay: ['Morning'],
        taken: false,
        streak: 5,
        adherence: 70,
        priority: 'Low',
        category: 'probiotics',
        description: 'Supports gut health and microbiome balance.',
        benefits: ['Gut health', 'Immune modulation', 'Digestive comfort'],
        recommendation: 'Recommended for digestive health and immune support.',
        recommendedFor: ['Digestive Health', 'Immune Support']
    }
  ]);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeView, setActiveView] = useState<'daily' | 'calendar'>('daily');
  
  const handleToggleTaken = (id: number) => {
    setSupplements(supplements.map(supplement => 
      supplement.id === id 
        ? { 
            ...supplement,
            taken: !supplement.taken,
            streak: !supplement.taken ? (supplement.streak ?? 0) + 1 : (supplement.streak ?? 0) - 1,
            // Update adherence rate calculation
            adherence: !supplement.taken
              ? Math.min(100, Math.round(((supplement.adherence ?? 0) * 0.9) + 10))
              : Math.max(0, Math.round(((supplement.adherence ?? 0) * 0.9) - 5))
          } 
        : supplement
    ));
  };
  
  const handleCalendarToggleTaken = (id: number, date: Date) => {
    // For now, this just toggles the current day's supplements
    // In a real app, this would update a database record for the specific date
    if (isSameDay(date, new Date())) {
      handleToggleTaken(id);
    }
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  const filteredSupplements = supplements.filter(supplement => {
    if (!showCompleted && supplement.taken) return false;
    
    if (activeFilter === 'all') return true;
    if (activeFilter === 'morning' && supplement.timeOfDay?.includes('Morning')) return true;
    if (activeFilter === 'afternoon' && supplement.timeOfDay?.includes('Afternoon')) return true;
    if (activeFilter === 'evening' && supplement.timeOfDay?.includes('Evening')) return true;
    
    return false;
  });
  
  const completionRate = Math.round((supplements.filter(s => s.taken).length / supplements.length) * 100);

  return (
    <div className="container mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Supplement Tracking</h1>
      <p className="text-gray-600 mb-6">Log your daily supplement intake and track your adherence over time</p>
      
      {/* Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-1"
        >
          <h2 className="font-semibold text-lg mb-4">Today's Progress</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-4xl font-bold text-indigo-600">{completionRate}%</span>
              <span className="text-sm ml-2 text-gray-500">Completed</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
            <div 
              className="h-2 bg-indigo-600 rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500 mb-1">Current Streak</div>
              <div className="text-gray-900 font-medium">5 days</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-500 mb-1">Adherence</div>
              <div className="text-gray-900 font-medium">92%</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-2"
        >
          <h2 className="font-semibold text-lg mb-4">Weekly Overview</h2>
          <div className="flex items-end justify-between h-32 mb-2">
            {/* Placeholder for weekly adherence chart */}
            <div className="w-1/7 mx-1">
              <div className="h-24 bg-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-5/6 bg-indigo-500 rounded-t-lg"></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-500">Mon</div>
            </div>
            <div className="w-1/7 mx-1">
              <div className="h-24 bg-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-full bg-indigo-500 rounded-t-lg"></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-500">Tue</div>
            </div>
            <div className="w-1/7 mx-1">
              <div className="h-24 bg-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-4/6 bg-indigo-500 rounded-t-lg"></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-500">Wed</div>
            </div>
            <div className="w-1/7 mx-1">
              <div className="h-24 bg-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-5/6 bg-indigo-500 rounded-t-lg"></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-500">Thu</div>
            </div>
            <div className="w-1/7 mx-1">
              <div className="h-24 bg-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-3/4 bg-indigo-500 rounded-t-lg"></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-500">Fri</div>
            </div>
            <div className="w-1/7 mx-1">
              <div className="h-24 bg-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-2/3 bg-indigo-500 rounded-t-lg"></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-500">Sat</div>
            </div>
            <div className="w-1/7 mx-1">
              <div className="h-24 bg-indigo-100 rounded-t-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-1/2 bg-indigo-300 rounded-t-lg"></div>
              </div>
              <div className="text-xs text-center mt-1 text-gray-500">Sun</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* View Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveView('daily')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            activeView === 'daily' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Daily View
        </button>
        <button
          onClick={() => setActiveView('calendar')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            activeView === 'calendar' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Calendar View
        </button>
      </div>
      
      {activeView === 'daily' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between mb-5">
            <div className="flex space-x-2 mb-4 lg:mb-0">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter('morning')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'morning' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Morning
              </button>
              <button 
                onClick={() => setActiveFilter('afternoon')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'afternoon' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Afternoon
              </button>
              <button 
                onClick={() => setActiveFilter('evening')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'evening' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Evening
              </button>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                />
                <div className={`w-10 h-5 relative rounded-full transition-colors ${showCompleted ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                  <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${showCompleted ? 'transform translate-x-5' : ''}`}></div>
                </div>
                <span className="ml-2 text-sm text-gray-700">Show completed</span>
              </label>
            </div>
          </div>
          
          {/* Supplements List */}
          <div className="space-y-4">
            {filteredSupplements.map((supplement) => (
              <motion.div
                key={supplement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transform transition-all ${
                  supplement.taken ? 'border-green-200 bg-green-50' : ''
                }`}
              >
                <div className="p-4 flex items-center">
                  <button 
                    onClick={() => handleToggleTaken(supplement.id)}
                    className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center mr-4 ${
                      supplement.taken 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 text-transparent hover:border-gray-400'
                    }`}
                  >
                    {supplement.taken && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900">{supplement.name}</h3>
                      <div className="flex ml-2 space-x-1">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                          {supplement.dosage}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                          {supplement.timeOfDay?.join(', ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{supplement.frequency}</p>
                  </div>
                  
                  <div className="flex items-center">
                    {supplement.taken ? (
                      <div className="text-green-600 text-sm font-medium mr-4 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Taken
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm mr-4">Not taken</div>
                    )}
                    
                    <div className="flex space-x-1 items-center">
                      <div className="text-xs font-medium text-gray-500">
                        Streak: {supplement.streak} days
                      </div>
                      <div className="w-16 h-1 bg-gray-200 rounded-full">
                        <div 
                          className="h-1 bg-indigo-500 rounded-full" 
                          style={{ width: `${supplement.adherence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredSupplements.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No supplements found</h3>
                <p className="text-gray-500">Try changing your filters or check back later.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <CalendarView 
          supplements={supplements}
          onToggleTaken={handleCalendarToggleTaken}
        />
      )}
    </div>
  );
} 