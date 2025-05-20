import React from 'react';
import SupplementCard from './SupplementCard';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

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

const SupplementList = ({ supplements }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="space-y-4"
  >
    {supplements.length === 0 ? (
      <Card className="p-8 text-center bg-white border border-gray-200 shadow-sm">
        <p className="text-gray-500">No supplements match your search criteria.</p>
      </Card>
    ) : (
      supplements.map(supplement => (
        <SupplementCard key={supplement.id} supplement={supplement} itemVariants={itemVariants} />
      ))
    )}
  </motion.div>
);

export default SupplementList; 