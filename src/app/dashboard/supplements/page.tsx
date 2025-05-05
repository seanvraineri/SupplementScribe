'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AddSupplementModal from '@/components/ui/AddSupplementModal';
import { Supplement } from '@/types/supplement';
import ProtocolPrintView from '@/components/reports/ProtocolPrintView';

// Define category type
type Category = {
  id: string;
  name: string;
};

// Define the data with shopping links
const categories: Category[] = [
  { id: 'all', name: '🧪 All Supplements' },
  { id: 'vitamins', name: '🍊 Vitamins' },
  { id: 'minerals', name: '🪨 Minerals' },
  { id: 'omega', name: '🐟 Omega Fatty Acids' },
  { id: 'probiotics', name: '🦠 Probiotics' },
  { id: 'amino-acids', name: '🧬 Amino Acids' },
  { id: 'herbs', name: '🌿 Herbs & Botanicals' },
];

const supplements: Supplement[] = [
  { 
    id: 1, 
    name: '☀️ Vitamin D3', 
    dosage: '2000 IU', 
    frequency: 'Daily with breakfast', 
    priority: 'High', 
    category: 'vitamins',
    description: 'Vitamin D3 (cholecalciferol) is crucial for calcium absorption and bone health. It also supports immune function and cellular growth.',
    benefits: ['🦴 Bone strength', '🛡️ Immune support', '😊 Mood regulation'],
    recommendation: 'Based on your blood test showing 28 ng/mL (below optimal range).',
    recommendedFor: ['Bone health', 'Immune support', 'Mood regulation'],
    link: 'https://example.com/vitamin-d3',
    price: '$15.99',
    rating: 4.7,
    brand: 'NutriPure'
  },
  { 
    id: 2, 
    name: '✨ Magnesium Glycinate', 
    dosage: '400mg', 
    frequency: 'Daily before bed', 
    priority: 'Medium', 
    category: 'minerals',
    description: 'Magnesium is involved in over 300 enzymatic reactions in the body. This glycinate form is highly bioavailable and gentle on the stomach.',
    benefits: ['💪 Muscle relaxation', '😴 Sleep quality', '🧘 Stress reduction'],
    recommendation: 'Recommended based on your reported muscle tension and sleep difficulties.',
    recommendedFor: ['Muscle relaxation', 'Sleep quality', 'Stress reduction'],
    link: 'https://example.com/magnesium-glycinate',
    price: '$19.99',
    rating: 4.5,
    brand: 'PureForm'
  },
  { 
    id: 3, 
    name: '🐟 Omega-3 Fish Oil', 
    dosage: '1000mg', 
    frequency: 'Daily with meal', 
    priority: 'High', 
    category: 'omega',
    description: 'Contains essential EPA and DHA fatty acids that support heart and brain health. These fatty acids are also important for reducing inflammation.',
    benefits: ['❤️ Heart health', '🧠 Brain function', '🦵 Joint mobility'],
    recommendation: 'Recommended based on your dietary questionnaire showing low fatty fish consumption.',
    recommendedFor: ['Heart health', 'Brain function', 'Joint mobility'],
    link: 'https://example.com/omega-3',
    price: '$24.99',
    rating: 4.8,
    brand: 'OceanHealth'
  },
];

// Map priority labels to new terminology
const priorityLabels = {
  'High': 'Vital',
  'Medium': 'Helpful',
  'Low': 'Optional'
};

export default function SupplementsPage() {
  // Client-side state
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localSupplements, setLocalSupplements] = useState<Supplement[]>(supplements);
  const [showPrintView, setShowPrintView] = useState(false);
  const [printFormat, setPrintFormat] = useState<'simple' | 'detailed' | 'comprehensive'>('detailed');
  const printRef = useRef<HTMLDivElement>(null);
  
  // Set mounted state on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Load supplements from localStorage on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSupplements = localStorage.getItem('customSupplements');
      if (savedSupplements) {
        try {
          const parsedSupplements = JSON.parse(savedSupplements);
          setLocalSupplements([...supplements, ...parsedSupplements]);
        } catch (e) {
          console.error('Failed to parse saved supplements', e);
        }
      }
    }
  }, []);
  
  // Handle adding a new supplement
  const handleAddSupplement = (newSupplement: Supplement) => {
    const updatedSupplements = [...localSupplements, newSupplement];
    setLocalSupplements(updatedSupplements);
    
    // Save custom supplements to localStorage
    try {
      const customSupplements = updatedSupplements.filter(s => !supplements.some(os => os.id === s.id));
      localStorage.setItem('customSupplements', JSON.stringify(customSupplements));
    } catch (e) {
      console.error('Failed to save supplements to localStorage', e);
    }
  };
  
  // Skeleton loader for initial server render
  if (!mounted) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded-full w-24"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Filter supplements based on active category and search query
  const filteredSupplements = localSupplements.filter(supplement => {
    const matchesCategory = activeFilter === 'all' || supplement.category === activeFilter;
    const matchesSearch = supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          supplement.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Function to handle clicking on a supplement
  const handleSupplementClick = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
  };

  // Function to export supplement list as CSV
  const handleExportList = () => {
    // Filter supplements based on current filters
    const exportableSupplements = filteredSupplements.map(s => ({
      Name: s.name.replace(/[^\w\s]/gi, ''), // Remove emojis
      Category: categories.find(c => c.id === s.category)?.name.split(' ')[1] || s.category,
      Dosage: s.dosage,
      Frequency: s.frequency,
      Priority: priorityLabels[s.priority as keyof typeof priorityLabels],
      Brand: s.brand,
      Price: s.price
    }));

    // Generate CSV content
    const headers = Object.keys(exportableSupplements[0]);
    const csvContent = [
      headers.join(','),
      ...exportableSupplements.map(s => 
        headers.map(h => `"${s[h as keyof typeof s]}"`.replace(/"/g, '""')).join(',')
      )
    ].join('\n');

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `supplement-protocol-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to print supplement list - use our new ProtocolPrintView component instead
  const handlePrintProtocol = () => {
    setShowPrintView(true);
  };

  // Mock user info for the report
  const userInfo = {
    name: "John Smith",
    doctor: "Dr. Jane Doe",
    notes: "Patient is following a personalized protocol to address vitamin D deficiency and improve overall health."
  };

  return (
    <>
      {/* Atmospheric background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-radial from-primary-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-gradient-radial from-primary-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
    
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left sidebar with new styling */}
        <div className="w-full md:w-[230px] bg-white/60 backdrop-blur-sm md:my-6 md:ml-6 p-5 md:p-6 border border-white/[0.15] rounded-xl shadow-sm flex-shrink-0">
          <h2 className="font-semibold text-xl mb-6 font-inter-tight text-gray-900">Filter Options</h2>
          
          {/* Categories section with improved styling */}
          <div className="mb-8">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`w-full text-left pl-4 pr-3 py-2.5 rounded-lg transition-colors relative overflow-hidden group ${
                    activeFilter === category.id 
                      ? 'text-primary-600 font-medium' 
                      : 'text-gray-700 hover:bg-primary-50'
                  }`}
                >
                  {activeFilter === category.id && (
                    <motion.div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4/5 bg-glow-gradient"
                      layoutId="activeCategory"
                      initial={{ height: '30%' }}
                      animate={{ height: '80%' }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Priority section with updated terminology */}
          <div className="mb-8">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">Priority Legend</h3>
            <div className="space-y-3 bg-primary-50/60 backdrop-blur-sm p-4 rounded-lg border border-white/[0.15]">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-rose-400 mr-3"></span>
                <span className="text-gray-700">Vital</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-amber-400 mr-3"></span>
                <span className="text-gray-700">Helpful</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-emerald-400 mr-3"></span>
                <span className="text-gray-700">Optional</span>
              </div>
            </div>
          </div>
          
          {/* Quick Help section with updated styling */}
          <div className="bg-gradient-to-br from-primary-500/10 to-primary-500/5 backdrop-blur-sm p-4 rounded-lg border border-white/[0.15]">
            <h3 className="font-medium text-primary-600 mb-2 font-inter-tight">Need Help?</h3>
            <p className="text-sm text-primary-500/90 mb-3">Questions about your supplement protocol or dosages?</p>
            <Link href="/dashboard/chat" className="text-sm text-white bg-primary-600 px-4 py-2 rounded-lg inline-block hover:bg-primary-500 transition-colors">
              Chat with Nutri
            </Link>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-inter-tight">My Supplement Protocol</h1>
            <p className="text-gray-600 font-inter">Your personalized supplements based on your health profile, goals, and biomarkers</p>
          </div>
          
          {/* Search and actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search supplements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-inter"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Supplement
              </button>
              <button 
                onClick={handleExportList}
                className="px-4 py-2 text-primary-600 bg-primary-50 border border-primary-500/10 rounded-lg hover:bg-primary-50/80 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export List
              </button>
              <div className="relative group">
                <button 
                  onClick={handlePrintProtocol}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Protocol
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Print format dropdown */}
                <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-2 w-48 hidden group-hover:block z-10">
                  <p className="text-xs text-gray-500 mb-2">Format:</p>
                  <div className="space-y-1">
                    {[
                      { id: 'simple', label: 'Simple' },
                      { id: 'detailed', label: 'Detailed' },
                      { id: 'comprehensive', label: 'Comprehensive' }
                    ].map(format => (
                      <button
                        key={format.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrintFormat(format.id as 'simple' | 'detailed' | 'comprehensive');
                          setShowPrintView(true);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded ${
                          printFormat === format.id ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
                        }`}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="bg-white/60 backdrop-blur-sm shadow-sm rounded-xl border border-white/[0.15] p-5 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === category.id 
                      ? 'bg-primary-50 text-primary-600 border border-primary-500/20' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Supplements Grid with improved card design */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSupplements.map((supplement, index) => (
              <motion.div
                key={supplement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/[0.15] shadow-sm overflow-hidden flex flex-col hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                {/* Card header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center min-w-0 mr-2">
                      <div className="w-[36px] h-[36px] rounded-full bg-glow-gradient flex items-center justify-center text-white font-bold text-lg mr-3 flex-shrink-0">
                        {supplement.name.split(' ')[0]}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate font-inter-tight">{supplement.name}</h3>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      supplement.priority === 'High' ? 'bg-rose-100 text-rose-800' : 
                      supplement.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {priorityLabels[supplement.priority as keyof typeof priorityLabels]}
                    </div>
                  </div>
                </div>
                
                {/* Card body */}
                <div className="p-5 flex-grow">
                  {/* Dosage info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="bg-primary-50 rounded-full p-2.5 flex flex-col items-center">
                      <span className="text-xs text-primary-500 mb-1">Dosage</span>
                      <span className="text-sm font-medium text-primary-600">{supplement.dosage}</span>
                    </div>
                    <div className="bg-primary-50 rounded-full p-2.5 flex flex-col items-center">
                      <span className="text-xs text-primary-500 mb-1">Frequency</span>
                      <span className="text-sm font-medium text-primary-600">{supplement.frequency}</span>
                    </div>
                    <div className="bg-gray-50 rounded-full p-2.5 flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">Category</span>
                      <span className="text-sm font-medium text-gray-700">{
                        categories.find(cat => cat.id === supplement.category)?.name.split(' ')[1] || supplement.category
                      }</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2 font-inter">{supplement.description}</p>
                  </div>
                  
                  {/* Benefits */}
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Key Benefits</h4>
                    <ul className="text-sm text-gray-700 space-y-1.5 font-inter">
                      {supplement.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Card footer */}
                <div className="p-5 bg-gray-50/80 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-900 mr-1">{supplement.price}</span>
                      <span className="text-xs text-gray-500">est.</span>
                    </div>
                    <button
                      onClick={() => handleSupplementClick(supplement)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredSupplements.length === 0 && (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/[0.15]">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1 font-inter-tight">No supplements found</h3>
              <p className="text-gray-500 font-inter">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {setActiveFilter('all'); setSearchQuery('');}}
                className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 font-medium rounded-lg hover:bg-primary-50/80 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Supplement detail modal with updated design */}
      <AnimatePresence>
        {selectedSupplement && (
          <div 
            className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedSupplement(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-white/[0.15]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="bg-glow-gradient p-6 pb-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1 font-inter-tight">{selectedSupplement.name}</h3>
                    <div className="flex items-center text-white/90">
                      <span className="mr-2">by {selectedSupplement.brand}</span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-4 h-4 ${i < (selectedSupplement.rating ? Math.floor(selectedSupplement.rating) : 0) ? 'text-yellow-300' : 'text-white/30'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1">{selectedSupplement.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSupplement(null)}
                    className="text-white bg-white/20 rounded-full p-1 hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal body */}
              <div className="p-6">
                {/* Basic info cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary-50 rounded-lg p-3 text-center">
                    <h4 className="text-xs text-primary-500/80 mb-1">Dosage</h4>
                    <p className="text-primary-600 font-medium">{selectedSupplement.dosage}</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3 text-center">
                    <h4 className="text-xs text-primary-500/80 mb-1">Frequency</h4>
                    <p className="text-primary-600 font-medium">{selectedSupplement.frequency}</p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3 text-center">
                    <h4 className="text-xs text-primary-500/80 mb-1">Priority</h4>
                    <p className={`font-medium ${
                      selectedSupplement.priority === 'High' ? 'text-rose-600' : 
                      selectedSupplement.priority === 'Medium' ? 'text-amber-600' : 
                      'text-emerald-600'
                    }`}>
                      {priorityLabels[selectedSupplement.priority as keyof typeof priorityLabels]}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter-tight">Description</h4>
                  <p className="text-gray-700 font-inter">{selectedSupplement.description}</p>
                </div>
                
                <div className="space-y-5 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter-tight">Benefits</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 font-inter">
                      {selectedSupplement.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter-tight">Why It's Recommended</h4>
                    <div className="bg-primary-50 border border-primary-500/10 rounded-lg p-4 text-primary-600 font-inter">
                      {selectedSupplement.recommendation}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/[0.15] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 font-inter-tight">Best Price Option</h4>
                      <p className="text-sm text-gray-500 font-inter">From verified retailers</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900 mr-2">{selectedSupplement.price}</span>
                      <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">Best Value</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 font-inter">Free shipping on orders over $25 • 30-day money back guarantee</p>
                </div>
                
                <div className="flex space-x-4">
                  <a 
                    href={selectedSupplement.link} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex-1 bg-glow-gradient text-white py-3 px-6 rounded-lg font-medium text-center hover:opacity-90 transition-opacity shadow-md flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Purchasing Options
                  </a>
                  <button 
                    onClick={() => setSelectedSupplement(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Add Supplement Modal */}
      <AddSupplementModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSupplement={handleAddSupplement}
        categories={categories.filter(c => c.id !== 'all')}
        existingIds={localSupplements.map(s => s.id).filter((id): id is number => id !== undefined)}
      />

      {/* Print View Modal */}
      {showPrintView && (
        <ProtocolPrintView 
          supplements={filteredSupplements}
          userInfo={userInfo}
          printFormat={printFormat}
          onClose={() => setShowPrintView(false)}
        />
      )}
    </>
  );
} 