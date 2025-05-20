import React from 'react';

const DashboardHeader = ({ greeting, userName }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-1">
      {greeting}, {userName}
    </h1>
    <p className="text-gray-600">
      Here's an overview of your health journey
    </p>
  </div>
);

export default DashboardHeader; 