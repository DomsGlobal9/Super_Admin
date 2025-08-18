// import {revenueData, pieData, vendors, alerts} from '../Data/Dashboard';
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { AlertTriangle, Info, TrendingUp } from 'lucide-react';

// const Dashboard = () => {
//   console.log(revenueData)
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Card Example */}
//         <div className="bg-white shadow p-6 rounded-lg">
//           <p className="text-gray-500 text-sm">Total Revenue</p>
//           <h3 className="text-2xl font-bold mt-2">₹40,689</h3>
//         </div>

//         <div className="bg-white shadow p-6 rounded-lg">
//           <p className="text-gray-500 text-sm">Total Orders</p>
//           <h3 className="text-2xl font-bold mt-2">10,293</h3>
//         </div>

//         <div className="bg-white shadow p-6 rounded-lg">
//           <p className="text-gray-500 text-sm">Active Vendors</p>
//           <h3 className="text-2xl font-bold mt-2">10,293</h3>
//         </div>
//       </div>

//       <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className=" font-semibold text-gray-900 mb-2">Revenue Analysis</h1>
//         <div className="flex items-center space-x-4">
//           <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
//             <option>Weekly</option>
//             <option>Monthly</option>
//             <option>Yearly</option>
//           </select>
//         </div>
//       </div>

//       {/* Main Dashboard Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
//         {/* Bar Chart Section */}
//         <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Revenue Analysis</h2>
//             <div className="flex items-center space-x-4 text-sm">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
//                 <span className="text-gray-600">Organizational</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
//                 <span className="text-gray-600">B2C</span>
//               </div>
//             </div>
//           </div>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Bar dataKey="Organizational" fill="#3B82F6" radius={[2, 2, 0, 0]} />
//                 <Bar dataKey="B2C" fill="#60A5FA" radius={[2, 2, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Pie Chart Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Categories</h2>
//           <div className="flex items-center justify-center h-64">
//             <div className="relative">
//               <ResponsiveContainer width={200} height={200}>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={40}
//                     outerRadius={80}
//                     paddingAngle={2}
//                     dataKey="value"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//               {/* Legend */}
//               <div className="mt-4 space-y-2">
//                 {pieData.map((item, index) => (
//                   <div key={index} className="flex items-center justify-between text-sm">
//                     <div className="flex items-center">
//                       <div 
//                         className="w-3 h-3 rounded-full mr-2" 
//                         style={{ backgroundColor: item.color }}
//                       ></div>
//                       <span className="text-gray-600">{item.name}</span>
//                     </div>
//                     <span className="font-medium">{item.value}%</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
//         {/* Top Performing Vendors */}
//         <div className="bg-white rounded-lg shadow-sm">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-900">Top Performing Vendors</h2>
//               <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                 1149 → 360 Hug
//               </div>
//             </div>
//             <div className="flex items-center justify-between mt-2">
//               <span className="text-sm text-gray-500">Commission from top vendors this month</span>
//               <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
//             </div>
//           </div>
          
//           <div className="p-6">
//             <div className="space-y-4">
//               {vendors.map((vendor, index) => (
//                 <div key={index} className="flex items-center justify-between py-2">
//                   <div>
//                     <h3 className="font-medium text-gray-900">{vendor.name}</h3>
//                     <p className="text-sm text-gray-500">{vendor.revenue}</p>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="text-green-600 font-medium text-sm mr-2">{vendor.growth}</span>
//                     <TrendingUp className="w-4 h-4 text-green-600" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recent Alerts */}
//         <div className="bg-white rounded-lg shadow-sm">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
//               <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
//             </div>
//             <p className="text-sm text-gray-500 mt-1">Important notifications requiring attention</p>
//           </div>
          
//           <div className="p-6">
//             <div className="space-y-4">
//               {alerts.map((alert, index) => (
//                 <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
//                   <alert.icon className={`w-5 h-5 mt-0.5 ${alert.color}`} />
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-900">{alert.message}</p>
//                     <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//     // </div>
//   );
// };

// export default Dashboard;
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Info, TrendingUp, Users, ShoppingCart, Clock } from 'lucide-react';

// Sample data matching the reference design
const revenueData = [
  { month: 'Jan', Organizational: 45000, B2C: 35000 },
  { month: 'Feb', Organizational: 52000, B2C: 28000 },
  { month: 'Mar', Organizational: 48000, B2C: 42000 },
  { month: 'Apr', Organizational: 61000, B2C: 35000 },
  { month: 'May', Organizational: 55000, B2C: 48000 },
  { month: 'Jun', Organizational: 49000, B2C: 38000 },
  { month: 'Jul', Organizational: 63000, B2C: 45000 },
  { month: 'Aug', Organizational: 58000, B2C: 52000 },
  { month: 'Sep', Organizational: 54000, B2C: 41000 },
  { month: 'Oct', Organizational: 67000, B2C: 48000 },
  { month: 'Nov', Organizational: 61000, B2C: 55000 },
  { month: 'Dec', Organizational: 59000, B2C: 43000 }
];

const pieData = [
  { name: 'Organizational', value: 55, color: '#4A90E2' },
  { name: 'B2C', value: 45, color: '#7BB3F0' }
];

const vendors = [
  { name: 'Fashion Forward Ltd', revenue: '₹85,000', growth: '+8%', color: 'text-green-500' },
  { name: 'Green Energy Solutions', revenue: '₹60,000', growth: '+6%', color: 'text-green-500' },
  { name: 'Tech Innovations Inc', revenue: '₹75,000', growth: '-10%', color: 'text-red-500' }
];

const alerts = [
  { 
    message: 'Low stock alert: 15 products below threshold', 
    time: '2 hrs ago', 
    icon: AlertTriangle, 
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  { 
    message: 'New shipment received: 50 products in stock', 
    time: '3 hrs ago', 
    icon: Info, 
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  { 
    message: 'Low stock: 30 products unavailable', 
    time: '10m ago', 
    icon: Info, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹40,689</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Orders</span>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">10293</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Vendors</span>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">10293</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Vendors</span>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">10293</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Revenue Analysis Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Analysis</h2>
            <div className="flex items-center space-x-4">
              <select className="text-sm border border-gray-300 rounded px-3 py-1 bg-white">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  stroke="#ddd"
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666' }}
                  stroke="#ddd"
                  tickLine={false}
                  axisLine={false}
                />
                <Bar dataKey="Organizational" fill="#4A90E2" radius={[2, 2, 0, 0]} />
                <Bar dataKey="B2C" fill="#7BB3F0" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Organizational</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">B2C</span>
            </div>
          </div>
        </div>

        {/* Commission Categories Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Commission Categories</h2>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Organizational</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">B2C</span>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-blue-600">55%</div>
              <div className="text-2xl font-bold text-blue-400">45%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performing Vendors */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Vendors</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {vendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.revenue}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-medium text-sm ${vendor.color}`}>{vendor.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full ${alert.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <alert.icon className={`w-4 h-4 ${alert.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;