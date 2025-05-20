import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const FilterSidebar = ({ categories, selectedCategory, setSelectedCategory }) => (
  <Card className="w-full md:w-64 shrink-0 bg-white border border-gray-200 shadow-sm">
    <CardHeader className="bg-white">
      <CardTitle className="text-lg font-semibold text-gray-900">Filter Options</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">CATEGORIES</h3>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">PRIORITY LEGEND</h3>
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-700">Vital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-700">Helpful</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Optional</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default FilterSidebar; 