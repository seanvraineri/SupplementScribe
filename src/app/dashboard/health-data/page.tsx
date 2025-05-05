'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BloodTestMetric {
  name: string;
  value: string;
  range: string;
  status: string;
}

// Removed duplicate BloodTest interface since it's defined as a type below

interface TrendDataPoint {
  date: string;
  value: number;
}

interface TrendData {
  metric: string;
  unit: string;
  values: TrendDataPoint[];
  optimal: {
    min: number;
    max: number;
  };
}

interface GeneVariant {
  gene: string;
  variant: string;
  status: 'Normal' | 'Heterozygous' | 'Homozygous';
  impact: 'Low' | 'Moderate' | 'High';
  description: string;
  supplementRecommendation: string;
}

// Define tab type
type Tab = {
  id: string;
  label: string;
};

// Define blood test type
type BloodTest = {
  id: number;
  date: string;
  lab: string;
  metrics: {
    name: string;
    value: string;
    range: string;
    status: string;
  }[];
};

type HealthDataSource = {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
};

type HealthMetric = {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  range?: string;
  status: 'normal' | 'low' | 'high';
  date: string;
  category: 'vitamin' | 'mineral' | 'hormone' | 'lipid' | 'basic';
};

export default function HealthDataPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'data' | 'integrations'>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [healthData, setHealthData] = useState<HealthMetric[]>([
    { id: '1', name: 'Vitamin D', value: 28, unit: 'ng/mL', range: '30-50', status: 'low', date: '2023-09-15', category: 'vitamin' },
    { id: '2', name: 'Vitamin B12', value: 550, unit: 'pg/mL', range: '200-900', status: 'normal', date: '2023-09-15', category: 'vitamin' },
    { id: '3', name: 'Ferritin', value: 95, unit: 'μg/L', range: '20-250', status: 'normal', date: '2023-09-15', category: 'mineral' },
    { id: '4', name: 'Magnesium', value: 1.7, unit: 'mg/dL', range: '1.7-2.2', status: 'normal', date: '2023-09-15', category: 'mineral' },
    { id: '5', name: 'Total Cholesterol', value: 190, unit: 'mg/dL', range: '< 200', status: 'normal', date: '2023-09-15', category: 'lipid' },
    { id: '6', name: 'HDL Cholesterol', value: 62, unit: 'mg/dL', range: '> 60', status: 'normal', date: '2023-09-15', category: 'lipid' },
    { id: '7', name: 'LDL Cholesterol', value: 110, unit: 'mg/dL', range: '< 100', status: 'high', date: '2023-09-15', category: 'lipid' },
    { id: '8', name: 'Triglycerides', value: 88, unit: 'mg/dL', range: '< 150', status: 'normal', date: '2023-09-15', category: 'lipid' },
  ]);
  
  const healthDataSources: HealthDataSource[] = [
    { id: '1', name: '23andMe', icon: '🧬', description: 'Genetic information and genetic health risk reports', connected: false },
    { id: '2', name: 'Apple Health', icon: '❤️', description: 'Activity, sleep, and heart health data', connected: true },
    { id: '3', name: 'Fitbit', icon: '⌚', description: 'Activity, sleep, and heart rate monitoring', connected: false },
    { id: '4', name: 'Lab Results', icon: '🔬', description: 'Upload PDF or CSV files of lab test results', connected: false },
    { id: '5', name: 'Oura Ring', icon: '💍', description: 'Sleep, activity, and recovery metrics', connected: false },
    { id: '6', name: 'Whoop', icon: '🔄', description: 'Recovery, strain, and sleep tracking', connected: false },
  ];
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    // Mock file upload process
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Add file names to uploaded files list
          const newFiles = Array.from(files).map(file => file.name);
          setUploadedFiles(prev => [...prev, ...newFiles]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleProcessFiles = () => {
    // In a real app, this would process the uploaded files and extract health data
    setActiveTab('data');
  };
  
  const handleConnectSource = (sourceId: string) => {
    // In a real app, this would initiate the OAuth flow or other connection method
    alert(`Connecting to source ${sourceId}. This would open the provider's authentication flow.`);
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Health Data</h1>
      <p className="text-gray-600 mb-6">Upload and connect your health data to get personalized supplement recommendations</p>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'upload' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Upload Data
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'integrations' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`py-2 px-4 border-b-2 font-medium text-sm ${
            activeTab === 'data' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          My Health Data
        </button>
      </div>
      
      {/* Upload Data Tab */}
      {activeTab === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Upload Health Data</h2>
            <p className="text-gray-600 mb-6">
              Upload your health data files to get personalized supplement recommendations. 
              We support CSV, PDF, and JSON formats from various health providers.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".csv,.pdf,.json"
                onChange={handleFileChange}
              />
              <div className="mb-4">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Drag and drop files here</h3>
              <p className="text-sm text-gray-600 mb-4">or</p>
              <button
                onClick={handleFileSelect}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Select Files'}
              </button>
              <p className="text-xs text-gray-500 mt-4">Supported formats: CSV, PDF, JSON</p>
            </div>
            
            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Uploading...</span>
                  <span className="text-gray-700">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div 
                    className="h-2 bg-indigo-600 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {uploadedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files</h3>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg mr-3">📄</span>
                      <span className="text-sm text-gray-800">{file}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleProcessFiles}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                  >
                    Process Files
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Secure & Private</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">End-to-End Encryption</h3>
                <p className="text-sm text-gray-600">Your health data is encrypted in transit and at rest</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Privacy Focused</h3>
                <p className="text-sm text-gray-600">We never share your health data with third parties</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Transparent Access</h3>
                <p className="text-sm text-gray-600">Download or delete your data anytime</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {healthDataSources.map(source => (
            <div key={source.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-xl mr-4">
                    {source.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-600">{source.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto">
                {source.connected ? (
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      Connected
                    </span>
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleConnectSource(source.id)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}
      
      {/* Health Data Tab */}
      {activeTab === 'data' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Health Metrics</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  Filter
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  Export
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Range
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {healthData.map(metric => (
                    <tr key={metric.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{metric.name}</div>
                        <div className="text-xs text-gray-500">{metric.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{metric.value} {metric.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{metric.range}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          metric.status === 'normal' ? 'bg-green-100 text-green-800' : 
                          metric.status === 'low' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {metric.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Supplement Recommendations</h2>
              <Link 
                href="/dashboard/recommendations"
                className="text-indigo-600 hover:text-indigo-500 text-sm"
              >
                View All
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {healthData
                .filter(m => m.status !== 'normal')
                .slice(0, 3)
                .map(metric => (
                  <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{metric.name}</h3>
                        <p className="text-xs text-gray-500">
                          {metric.value} {metric.unit} ({metric.status})
                        </p>
                      </div>
                      <span className={`w-3 h-3 rounded-full ${
                        metric.status === 'low' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {metric.status === 'low' 
                        ? `Your ${metric.name} levels are below the optimal range.` 
                        : `Your ${metric.name} levels are above the optimal range.`
                      }
                    </p>
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-indigo-800 mb-1">Recommended Supplements:</h4>
                      <ul className="text-sm text-indigo-600">
                        {metric.name === 'Vitamin D' && (
                          <>
                            <li>• Vitamin D3 (2000-5000 IU daily)</li>
                            <li>• Vitamin K2 (100 mcg daily)</li>
                          </>
                        )}
                        {metric.name === 'LDL Cholesterol' && (
                          <>
                            <li>• Red Yeast Rice (1200 mg daily)</li>
                            <li>• Omega-3 Fish Oil (1000 mg daily)</li>
                            <li>• CoQ10 (100 mg daily)</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 