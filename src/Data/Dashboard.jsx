
import { AlertTriangle, Info, TrendingUp } from 'lucide-react';

// export const RevenueDashboard = () => {

  // Sample data for bar chart
  export  const revenueData = [
    { month: 'Jan', Organizational: 45000, B2C: 35000 },
    { month: 'Feb', Organizational: 52000, B2C: 41000 },
    { month: 'Mar', Organizational: 48000, B2C: 38000 },
    { month: 'Apr', Organizational: 61000, B2C: 47000 },
    { month: 'May', Organizational: 55000, B2C: 42000 },
    { month: 'Jun', Organizational: 58000, B2C: 45000 },
    { month: 'Jul', Organizational: 49000, B2C: 39000 },
    { month: 'Aug', Organizational: 63000, B2C: 48000 },
    { month: 'Sep', Organizational: 57000, B2C: 44000 },
    { month: 'Oct', Organizational: 52000, B2C: 41000 },
    { month: 'Nov', Organizational: 59000, B2C: 46000 },
    { month: 'Dec', Organizational: 55000, B2C: 43000 }
  ];

  // Pie chart data
  export  const pieData = [
    { name: 'Organizational', value: 65, color: '#3B82F6' },
    { name: 'B2C', value: 35, color: '#60A5FA' }
  ];

  // Top performing vendors
  export const vendors = [
    { name: 'Fashion Forward Ltd', revenue: '$2,400', growth: '+8%', trend: 'up' },
    { name: 'Tech Innovations Inc', revenue: '$1,800', growth: '+15%', trend: 'up' },
    { name: 'Green Energy Solutions', revenue: '$1,600', growth: '+6%', trend: 'up' },
    { name: 'Creative Solutions', revenue: '$1,400', growth: '+9%', trend: 'up' },
    { name: 'Tech Innovations Inc', revenue: '$1,200', growth: '+10%', trend: 'up' },
    { name: 'Health Plus Corp', revenue: '$1,000', growth: '+3%', trend: 'up' }
  ];

  // Recent alerts
  export  const alerts = [
    {
      type: 'warning',
      message: 'Low stock alert: 5 products below threshold',
      time: '2 hrs ago',
      icon: AlertTriangle,
      color: 'text-orange-500'
    },
    {
      type: 'success', 
      message: 'New shipment received: 50 products in stock',
      time: '3 hrs ago',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      type: 'info',
      message: 'Out of stock: 30 products unavailable',
      time: '5 hrs ago',
      icon: Info,
      color: 'text-blue-500'
    }
  ]
// }