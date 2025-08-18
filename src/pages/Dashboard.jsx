import {revenueData, pieData, vendors, alerts} from '../Data/Dashboard';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Info, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  console.log(revenueData)
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Example */}
        <div className="bg-white shadow p-6 rounded-lg">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h3 className="text-2xl font-bold mt-2">₹40,689</h3>
        </div>

        <div className="bg-white shadow p-6 rounded-lg">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h3 className="text-2xl font-bold mt-2">10,293</h3>
        </div>

        <div className="bg-white shadow p-6 rounded-lg">
          <p className="text-gray-500 text-sm">Active Vendors</p>
          <h3 className="text-2xl font-bold mt-2">10,293</h3>
        </div>
      </div>

      <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className=" font-semibold text-gray-900 mb-2">Revenue Analysis</h1>
        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Bar Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Analysis</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Organizational</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                <span className="text-gray-600">B2C</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Bar dataKey="Organizational" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="B2C" fill="#60A5FA" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Categories</h2>
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performing Vendors */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Vendors</h2>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                1149 → 360 Hug
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">Commission from top vendors this month</span>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {vendors.map((vendor, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.revenue}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 font-medium text-sm mr-2">{vendor.growth}</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Important notifications requiring attention</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100">
                  <alert.icon className={`w-5 h-5 mt-0.5 ${alert.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    // </div>
  );
};

export default Dashboard;
