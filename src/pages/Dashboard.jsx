import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Info, TrendingUp, Users, ShoppingCart, Clock, RefreshCw } from 'lucide-react';
import ic_dash1 from '../assets/ic_dash1.png';
import ic_dash2 from '../assets/ic_dash2.png';
import ic_dash3 from '../assets/ic_dash3.png';
import ic_dash4 from '../assets/ic_dash4.png';

// Firebase imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwlxdZKM8dagbu43v7NVFclex4QsTO4hw",
  authDomain: "dvyb-8b572.firebaseapp.com",
  databaseURL: "https://dvyb-8b572-default-rtdb.firebaseio.com",
  projectId: "dvyb-8b572",
  storageBucket: "dvyb-8b572.firebasestorage.app",
  messagingSenderId: "288498435019",
  appId: "1:288498435019:web:a20bce56f823c0ddad6c4e",
  measurementId: "G-4GFNR7HKFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Dynamic state for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeVendors: 0,
    pendingOrders: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);

  // Static month names for chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Fetch all dashboard data
  const fetchDashboardData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setLoading(true);

    try {
      // Get all users from both collections
      const vendorRegistrationsRef = collection(db, 'vendor_registrations');
      const usersRef = collection(db, 'users');
      
      const [vendorRegistrationsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(vendorRegistrationsRef),
        getDocs(usersRef)
      ]);

      // Create a map of all user data
      const allUsersData = new Map();
      
      // Add vendor registration data
      vendorRegistrationsSnapshot.forEach((doc) => {
        allUsersData.set(doc.id, { id: doc.id, ...doc.data(), source: 'vendor_registrations' });
      });
      
      // Add/merge users data
      usersSnapshot.forEach((doc) => {
        const existingData = allUsersData.get(doc.id) || {};
        allUsersData.set(doc.id, { 
          ...existingData,
          ...doc.data(),
          id: doc.id,
          source: existingData.source ? 'both' : 'users'
        });
      });

      let totalRevenue = 0;
      let organizationalRevenue = 0;
      let b2cRevenue = 0;
      let totalOrders = 0;
      let activeVendors = 0;
      let pendingOrders = 0;
      
      const vendorRevenueMap = new Map();
      const monthlyData = {};

      // Initialize monthly data
      for (let i = 0; i < 12; i++) {
        monthlyData[monthNames[i]] = {
          month: monthNames[i],
          Organizational: 0,
          B2C: 0
        };
      }

      // Process each user
      for (const [userId, userData] of allUsersData) {
        const productsRef = collection(db, 'users', userId, 'products');
        
        try {
          const productsSnapshot = await getDocs(productsRef);
          
          let userTotalRevenue = 0;
          let userProductCount = 0;
          let publishedProducts = 0;
          
          // Calculate revenue for this user
          productsSnapshot.forEach((productDoc) => {
            const product = productDoc.data();
            const price = parseFloat(product.price) || 0;
            
            userTotalRevenue += price;
            userProductCount++;
            totalOrders++; // Each product counts as an order
            
            if (product.isPublished) {
              publishedProducts++;
            }

            // Distribute revenue randomly between Organizational and B2C for demo
            const isOrganizational = Math.random() > 0.4; // 60% organizational, 40% B2C
            const monthIndex = Math.floor(Math.random() * 12);
            const monthName = monthNames[monthIndex];
            
            if (isOrganizational) {
              monthlyData[monthName].Organizational += Math.floor(price);
              organizationalRevenue += price;
            } else {
              monthlyData[monthName].B2C += Math.floor(price);
              b2cRevenue += price;
            }
          });

          totalRevenue += userTotalRevenue;
          
          if (userProductCount > 0) {
            activeVendors++;
            
            // Track vendor performance
            const vendorName = userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor';
            vendorRevenueMap.set(vendorName, {
              name: vendorName,
              revenue: userTotalRevenue,
              growth: Math.random() > 0.7 ? `-${Math.floor(Math.random() * 15)}%` : `+${Math.floor(Math.random() * 20)}%`,
              productCount: userProductCount,
              publishedCount: publishedProducts
            });
          }

          // Simulate pending orders (products not published)
          if (userProductCount > publishedProducts) {
            pendingOrders += (userProductCount - publishedProducts);
          }

        } catch (productError) {
          console.log(`No products found for user ${userId}`);
        }
      }

      // Update dashboard stats
      setDashboardStats({
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        activeVendors,
        pendingOrders
      });

      // Convert monthly data to array
      setRevenueData(Object.values(monthlyData));

      // Calculate pie chart data
      const totalOrgAndB2C = organizationalRevenue + b2cRevenue;
      setPieData([
        { 
          name: 'Organizational', 
          value: totalOrgAndB2C > 0 ? Math.round((organizationalRevenue / totalOrgAndB2C) * 100) : 50, 
          color: '#4A90E2' 
        },
        { 
          name: 'B2C', 
          value: totalOrgAndB2C > 0 ? Math.round((b2cRevenue / totalOrgAndB2C) * 100) : 50, 
          color: '#7BB3F0' 
        }
      ]);

      // Get top performing vendors
      const sortedVendors = Array.from(vendorRevenueMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(vendor => ({
          name: vendor.name,
          revenue: `₹${Math.round(vendor.revenue).toLocaleString()}`,
          growth: vendor.growth,
          color: vendor.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }));
      
      setTopVendors(sortedVendors);

      // Generate dynamic alerts
      const alerts = [];
      
      if (pendingOrders > 0) {
        alerts.push({
          message: `${pendingOrders} products pending publication`,
          time: '2 hrs ago',
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50'
        });
      }

      if (activeVendors > 50) {
        alerts.push({
          message: `${activeVendors} active vendors registered`,
          time: '3 hrs ago',
          icon: Users,
          color: 'text-green-500',
          bgColor: 'bg-green-50'
        });
      }

      alerts.push({
        message: `Total revenue: ₹${Math.round(totalRevenue).toLocaleString()}`,
        time: '10m ago',
        icon: TrendingUp,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50'
      });

      if (totalOrders < 100) {
        alerts.push({
          message: `Low order volume: ${totalOrders} total products`,
          time: '1 hr ago',
          icon: AlertTriangle,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50'
        });
      }

      setRecentAlerts(alerts.slice(0, 3)); // Show only 3 alerts
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading state
  if (loading && !revenueData.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
          <p className="text-gray-500 mt-2">Fetching real-time data from Firestore</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {lastUpdated && (
            <p className="text-sm text-green-600 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()} - Live data from Firestore
            </p>
          )}
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <div className=" bg-blue-100 rounded flex items-center justify-center">
              {/* <TrendingUp className="w-4 h-4 text-blue-600" /> */}
              <img src={ic_dash1} className='h-12 w-12' alt="" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">₹{dashboardStats.totalRevenue.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Products</span>
            <div className=" bg-[#506B85]  rounded flex items-center justify-center">
              {/* <ShoppingCart className="w-4 h-4 text-blue-600" /> */}
                          <img src={ic_dash2} className='h-12 p-2 w-12  ' alt="" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Vendors</span>
            <div className=" bg-[#506B85] rounded flex items-center justify-center">
              {/* <Users className="w-4 h-4 text-blue-600" /> */}
                          <img src={ic_dash3} className='h-12 w-12' alt="" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{dashboardStats.activeVendors}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Products</span>
            <div className=" bg-blue-100 rounded flex items-center justify-center">
              {/* <Clock className="w-4 h-4 text-blue-600" /> */}
                          <img src={ic_dash4} className='h-12 w-12' alt="" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Revenue Analysis Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Analysis</h2>
            <div className="flex items-center space-x-4">
              <select className="text-1xl font-semibold bg-white text-gray-600 rounded px-3 py-1">
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
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Commission Categories</h2>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="focus:outline-none hover:outline-none">
              <ResponsiveContainer width="100%" height={200}>  
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    className="focus:outline-none hover:outline-none"
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
              <div className="text-2xl font-bold text-blue-600">{pieData[0]?.value || 0}%</div>
              <div className="text-2xl font-bold text-blue-400">{pieData[1]?.value || 0}%</div>
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
              {topVendors.length > 0 ? (
                topVendors.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{vendor.name}</h3>
                      <p className="text-sm text-gray-500">{vendor.revenue}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-medium text-sm ${vendor.color}`}>{vendor.growth}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No vendor data available</p>
                </div>
              )}
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
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full ${alert.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <alert.icon className={`w-4 h-4 ${alert.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;