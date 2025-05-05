import React from 'react';

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping"></div>
          <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping animation-delay-200"></div>
          <div className="w-4 h-4 rounded-full bg-purple-500 animate-ping animation-delay-400"></div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
} 