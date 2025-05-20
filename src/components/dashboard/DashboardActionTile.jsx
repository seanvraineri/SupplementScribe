import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardActionTile = ({ icon, iconBg, title, description, buttonText, buttonClass, onClick }) => (
  <Card className={`shadow-card ${iconBg}`}>
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>{icon}</div>
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Button variant="outline" className={`mt-auto w-full ${buttonClass}`} onClick={onClick}>
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

export default DashboardActionTile; 