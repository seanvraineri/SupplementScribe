import React from 'react';
import { Plus, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionButtons = () => (
  <div className="flex flex-wrap gap-2">
    <Button className="bg-white text-primary-700 border border-gray-200 hover:bg-gray-50 shadow-sm flex items-center gap-2">
      <Plus size={18} />
      <span>Add Supplement</span>
    </Button>
    <Button className="bg-white text-primary-700 border border-gray-200 hover:bg-gray-50 shadow-sm flex items-center gap-2">
      <Download size={18} />
      <span>Export List</span>
    </Button>
    <Button className="bg-primary-600 text-white hover:bg-primary-700 shadow-sm flex items-center gap-2">
      <Printer size={18} />
      <span>Print Protocol</span>
    </Button>
  </div>
);

export default ActionButtons; 