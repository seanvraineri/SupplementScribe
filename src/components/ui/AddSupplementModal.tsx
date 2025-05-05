'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Supplement } from '@/types/supplement';

type AddSupplementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSupplement: (supplement: Supplement) => void;
  categories: { id: string; name: string }[];
  existingIds: (number | undefined)[];
};

export default function AddSupplementModal({ 
  isOpen, 
  onClose, 
  onAddSupplement,
  categories,
  existingIds
}: AddSupplementModalProps) {
  const [formData, setFormData] = useState<Partial<Supplement>>({
    name: '',
    dosage: '',
    frequency: 'Daily',
    priority: 'Medium',
    category: 'vitamins',
    description: '',
    benefits: [''],
    recommendation: 'Custom supplement added by user.',
    recommendedFor: [],
    link: '',
    price: '',
    rating: 0,
    brand: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...(formData.benefits || [''])];
    newBenefits[index] = value;
    setFormData((prev: Partial<Supplement>) => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setFormData((prev: Partial<Supplement>) => ({
      ...prev,
      benefits: [...(prev.benefits || []), '']
    }));
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...(formData.benefits || [''])];
    newBenefits.splice(index, 1);
    setFormData((prev: Partial<Supplement>) => ({ ...prev, benefits: newBenefits }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.dosage?.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Filter out empty benefits
    const benefits = (formData.benefits || []).filter((b: string) => b.trim() !== '');
    
    // Generate a new unique ID
    const newId = Math.max(0, ...existingIds.filter((id): id is number => id !== undefined)) + 1;
    
    // Add emoji based on category
    let emoji = '💊';
    switch (formData.category) {
      case 'vitamins': emoji = '☀️'; break;
      case 'minerals': emoji = '✨'; break;
      case 'omega': emoji = '🐟'; break;
      case 'probiotics': emoji = '🦠'; break;
      case 'amino-acids': emoji = '🧬'; break;
      case 'herbs': emoji = '🌿'; break;
    }
    
    const newSupplement: Supplement = {
      ...formData as Omit<Supplement, 'id'>,
      id: newId,
      name: `${emoji} ${formData.name}`,
      benefits: benefits.length ? benefits : ['General health support'],
      recommendedFor: benefits.map((b: string) => b.replace(/[^\w\s]/g, '').trim()),
    };
    
    onAddSupplement(newSupplement);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      dosage: '',
      frequency: 'Daily',
      priority: 'Medium',
      category: 'vitamins',
      description: '',
      benefits: [''],
      recommendation: 'Custom supplement added by user.',
      recommendedFor: [],
      link: '',
      price: '',
      rating: 0,
      brand: '',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Add Custom Supplement</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                    placeholder="Vitamin C"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.dosage ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                    placeholder="1000mg"
                  />
                  {errors.dosage && (
                    <p className="mt-1 text-sm text-red-500">{errors.dosage}</p>
                  )}
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Daily with breakfast">Daily with breakfast</option>
                    <option value="Daily with meal">Daily with meal</option>
                    <option value="Daily before bed">Daily before bed</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="High">Vital</option>
                    <option value="Medium">Helpful</option>
                    <option value="Low">Optional</option>
                  </select>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gray-500 focus:border-transparent`}
                    placeholder="Brief description of the supplement and its properties"
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                  </label>
                  {formData.benefits?.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder={`Benefit ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="mt-1 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Benefit
                  </button>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Brand name (optional)"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (estimated)
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="$19.99 (optional)"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Link
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="https://example.com/product (optional)"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Add Supplement
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 