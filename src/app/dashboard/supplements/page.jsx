'use client';

import React from 'react';
import { Suspense } from 'react';
import SupplementsProtocol from '@/components/SupplementsProtocol';
import { Skeleton } from '@/components/ui/skeleton';

const SupplementsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Suspense fallback={<SupplementsLoading />}>
        <SupplementsProtocol />
      </Suspense>
    </div>
  );
};

const SupplementsLoading = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-96 bg-gray-200/70" />
          <Skeleton className="h-6 w-80 bg-gray-200/70" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36 bg-gray-200/70" />
          <Skeleton className="h-10 w-36 bg-gray-200/70" />
          <Skeleton className="h-10 w-36 bg-gray-200/70" />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="h-[600px] w-full md:w-64 bg-gray-200/70" />
        <div className="flex-1 space-y-6">
          <Skeleton className="h-14 w-full bg-gray-200/70" />
          <Skeleton className="h-20 w-full bg-gray-200/70" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full bg-gray-200/70" />
            <Skeleton className="h-64 w-full bg-gray-200/70" />
            <Skeleton className="h-64 w-full bg-gray-200/70" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementsPage; 