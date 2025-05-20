export const healthScoreData = {
  score: 86,
  trend: [80, 82, 78, 85, 83, 88, 86],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  change: '+8%',
  timeframes: {
    week: {
      trend: [80, 82, 78, 85, 83, 88, 86],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    month: {
      trend: [75, 78, 80, 82, 84, 85, 86, 86],
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    year: {
      trend: [72, 74, 75, 77, 79, 81, 83, 84, 85, 85, 86, 86],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  }
};

export const metrics = [
  { 
    key: 'sleep', 
    title: 'Sleep Quality', 
    value: '7.5', 
    unit: 'hrs', 
    change: +0.5, 
    status: 'improved',
    data: [6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 7.5],
    color: 'blue'
  },
  { 
    key: 'energy', 
    title: 'Energy Level', 
    value: '85', 
    unit: '%', 
    change: +5, 
    status: 'improved',
    data: [70, 75, 80, 78, 82, 85, 85],
    color: 'green'
  },
  { 
    key: 'stress', 
    title: 'Stress Level', 
    value: '25', 
    unit: '%', 
    change: -10, 
    status: 'improved',
    data: [40, 38, 35, 30, 28, 25, 25],
    color: 'purple'
  },
  { 
    key: 'mood', 
    title: 'Mood', 
    value: '90', 
    unit: '%', 
    change: +2, 
    status: 'stable',
    data: [88, 85, 87, 89, 90, 90, 90],
    color: 'amber'
  }
];

export const supplements = [
  { 
    id: 1, 
    name: 'Vitamin D3', 
    dosage: '2000 IU', 
    taken: true,
    adherenceRate: 95,
    priority: 'High'
  },
  { 
    id: 2, 
    name: 'Magnesium Glycinate', 
    dosage: '400mg', 
    taken: true,
    adherenceRate: 90,
    priority: 'Medium'
  },
  { 
    id: 3, 
    name: 'Omega-3 Fish Oil', 
    dosage: '1000mg', 
    taken: false,
    adherenceRate: 85,
    priority: 'High'
  }
];

export const navigationItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'Home' },
  { key: 'assistant', label: 'AI Assistant', icon: 'MessageSquare' },
  { key: 'supplements', label: 'My Supplements', icon: 'Pill' },
  { key: 'interactions', label: 'Interactions', icon: 'AlertTriangle' },
  { key: 'refer', label: 'Refer a Friend', icon: 'UserPlus' },
  { key: 'health-data', label: 'Health Data', icon: 'BarChart2' },
  { key: 'tracking', label: 'Tracking', icon: 'CheckSquare' },
  { key: 'settings', label: 'Settings', icon: 'Settings' }
];

export const user = {
  name: 'Sarah',
  email: 'sarah@example.com',
  avatar: '/images/avatar.jpg',
  plan: 'Premium'
};

export const biomarkerData = [
  { name: 'Vitamin D', value: 28, optimal: 40, min: 30, max: 50 },
  { name: 'Magnesium', value: 1.9, optimal: 2.0, min: 1.7, max: 2.2 },
  { name: 'Zinc', value: 90, optimal: 95, min: 70, max: 120 },
  { name: 'Omega-3', value: 5.8, optimal: 8, min: 4, max: 8 },
  { name: 'Vitamin B12', value: 550, optimal: 600, min: 200, max: 900 }
]; 