export interface Supplement {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  description: string;
  benefits: string[];
  recommendation: string;
  recommendedFor: string[];
  link?: string;
  price?: string;
  rating?: number;
  brand?: string;
  adherence?: number;
  streak?: number;
  timeOfDay?: string[];
  taken?: boolean;
} 