import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const SupplementCard = ({ supplement, itemVariants }) => (
  <motion.div variants={itemVariants}>
    <Card className="overflow-hidden bg-white border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Supplement header */}
        <div className={`p-6 flex items-center gap-4 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100`}>
          <div className={`w-12 h-12 rounded-full ${supplement.iconBg} flex items-center justify-center text-2xl`}>
            {supplement.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{supplement.name}</h3>
            <Badge className={
              supplement.priority === 'Vital'
                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
            }>
              {supplement.priority}
            </Badge>
          </div>
        </div>
        {/* Supplement details */}
        <div className="p-6 flex-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Dosage</p>
              <p className="font-medium text-gray-900">{supplement.dosage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Frequency</p>
              <p className="font-medium text-gray-900">{supplement.frequency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-900 capitalize">{supplement.category}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{supplement.description}</p>
          <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Key Benefits</h4>
          <div className="flex flex-wrap gap-2">
            {supplement.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-1 text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                <span>{benefit.icon}</span>
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);

export default SupplementCard; 