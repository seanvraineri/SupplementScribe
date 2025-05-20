import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SupplementSearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <Input
      type="text"
      placeholder="Search supplements..."
      className="pl-10 py-6 w-full bg-white shadow-sm border border-gray-200"
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
    />
  </div>
);

export default SupplementSearchBar; 