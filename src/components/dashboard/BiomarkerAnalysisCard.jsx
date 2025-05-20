import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart2, Activity } from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Tooltip, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis
} from 'recharts';

const BiomarkerAnalysisCard = ({ biomarkerData }) => (
  <Card className="shadow-card h-full">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-900">Biomarker Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="chart">
        <TabsList className="mb-4">
          <TabsTrigger value="chart">
            <BarChart2 className="h-4 w-4 mr-2" />
            Chart View
          </TabsTrigger>
          <TabsTrigger value="radar">
            <Activity className="h-4 w-4 mr-2" />
            Radar View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={biomarkerData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Your Value" fill="#3b96f5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="optimal" name="Optimal Value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="radar" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="80%" data={biomarkerData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar 
                name="Your Values" 
                dataKey="value" 
                stroke="#3b96f5" 
                fill="#3b96f5" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Optimal Values" 
                dataKey="optimal" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6} 
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

export default BiomarkerAnalysisCard; 