'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, ChevronRight, Pill } from 'lucide-react';
import { supplements as initialSupplements } from '@/data/mockDashboardData';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const RecentSupplements = () => {
  const [supplements, setSupplements] = useState(initialSupplements);
  
  const handleToggleTaken = (id) => {
    setSupplements(prevSupplements =>
      prevSupplements.map(supp => 
        supp.id === id ? { ...supp, taken: !supp.taken } : supp
      )
    );
  };
  
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">Today's Supplements</CardTitle>
          <p className="text-gray-500 text-sm">Track your daily supplement intake</p>
        </div>
        <Link href="/dashboard/supplements" className="text-primary-600 text-sm font-medium hover:underline flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {supplements.map((supplement) => (
            <div 
              key={supplement.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <Pill className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{supplement.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{supplement.dosage}</span>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      supplement.priority === 'High' 
                        ? "border-red-200 text-red-700 bg-red-50" 
                        : "border-amber-200 text-amber-700 bg-amber-50"
                    )}>
                      {supplement.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleToggleTaken(supplement.id)}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center transition-all",
                  supplement.taken 
                    ? "bg-green-500 text-white" 
                    : "bg-white border-2 border-gray-300 text-transparent hover:border-blue-500"
                )}
              >
                {supplement.taken && <Check className="h-5 w-5" />}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex space-x-3">
          <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplement
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSupplements; 