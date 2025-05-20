import React from 'react';
import Sidebar from '../ui/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoadingSkeleton = () => (
  <div className="flex h-screen w-full bg-gray-50">
    <Sidebar />
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/4 mb-10" />
        <Skeleton className="h-[200px] w-full mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[150px] w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardLoadingSkeleton; 