'use client';

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar className="hidden md:flex" />
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 