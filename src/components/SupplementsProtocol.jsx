'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Download, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import FilterSidebar from './supplements/FilterSidebar';
import SupplementSearchBar from './supplements/SupplementSearchBar';
import SupplementList from './supplements/SupplementList';
import ActionButtons from './supplements/ActionButtons';

// Supplement category data
const categories = [
  { id: 'all', name: 'All Supplements', icon: '✓', color: 'bg-blue-100 text-blue-700' },
  { id: 'vitamins', name: 'Vitamins', icon: '🍊', color: 'bg-orange-100 text-orange-700' },
  { id: 'minerals', name: 'Minerals', icon: '🪨', color: 'bg-gray-100 text-gray-700' },
  { id: 'omega', name: 'Omega Fatty Acids', icon: '🐟', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'probiotics', name: 'Probiotics', icon: '🦠', color: 'bg-green-100 text-green-700' },
  { id: 'amino', name: 'Amino Acids', icon: '🧬', color: 'bg-purple-100 text-purple-700' },
  { id: 'herbs', name: 'Herbs & Botanicals', icon: '🌿', color: 'bg-emerald-100 text-emerald-700' },
];

// Supplement data
const supplementsData = [
  {
    id: 1,
    name: 'Vitamin D3',
    icon: '☀️',
    iconBg: 'bg-amber-100',
    category: 'vitamins',
    priority: 'Vital',
    dosage: '2000 IU',
    frequency: 'Daily with breakfast',
    description: 'Vitamin D3 (cholecalciferol) is crucial for calcium absorption and bone health. It also supports immune function and mood regulation.',
    benefits: [
      { icon: '🦴', text: 'Bone strength' },
      { icon: '🛡️', text: 'Immune support' },
      { icon: '😊', text: 'Mood regulation' }
    ]
  },
  {
    id: 2,
    name: 'Magnesium Glycinate',
    icon: '⚡',
    iconBg: 'bg-purple-100',
    category: 'minerals',
    priority: 'Helpful',
    dosage: '400mg',
    frequency: 'Daily before bed',
    description: 'Magnesium is involved in over 300 enzymatic reactions in the body. It supports muscle relaxation, sleep quality, and stress reduction.',
    benefits: [
      { icon: '💪', text: 'Muscle relaxation' },
      { icon: '😴', text: 'Sleep quality' },
      { icon: '🧘', text: 'Stress reduction' }
    ]
  },
  {
    id: 3,
    name: 'Omega-3 Fish Oil',
    icon: '🐟',
    iconBg: 'bg-blue-100',
    category: 'omega',
    priority: 'Vital',
    dosage: '1000mg',
    frequency: 'Daily with meal',
    description: 'Contains essential EPA and DHA fatty acids that support heart and brain health. May reduce inflammation and support cognitive function.',
    benefits: [
      { icon: '❤️', text: 'Heart health' },
      { icon: '🧠', text: 'Brain function' },
      { icon: '🔥', text: 'Reduce inflammation' }
    ]
  }
];

const SupplementsProtocol = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter supplements based on search and category
  const filteredSupplements = supplementsData.filter(supp => {
    const matchesSearch = supp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || supp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Supplements Protocol</h1>
          <p className="text-gray-600">Your personalized supplements based on your health profile, goals, and biomarkers</p>
        </div>
        <ActionButtons />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="flex-1 space-y-6">
          <SupplementSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <SupplementList supplements={filteredSupplements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementsProtocol; 