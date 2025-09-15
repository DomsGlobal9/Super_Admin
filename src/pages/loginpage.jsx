import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Users, ShoppingCart, Clock, RefreshCw, LogOut } from 'lucide-react';

// Firebase imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
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


// Authentication function
const authenticateAdmin = async (email, password) => {
  try {
    console.log('Attempting authentication for:', email);
    
    const adminRef = doc(db, 'admins', 'super-admin');
    const adminSnap = await getDoc(adminRef);
    
    if (!adminSnap.exists()) {
      console.log('Admin document not found');
      throw new Error('Admin credentials not found in database');
    }
    
    const adminData = adminSnap.data();
    console.log('Admin data retrieved:', { ...adminData, password: '[HIDDEN]' });
    
    if (adminData.email !== email) {
      throw new Error('Invalid email address');
    }
    
    if (adminData.password !== password) {
      throw new Error('Invalid password');
    }
    
    console.log('Authentication successful');
    
    const { password: _, ...adminInfo } = adminData;
    return {
      success: true,
      admin: {
        id: adminSnap.id,
        ...adminInfo,
        loginTime: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default function DVYBApp() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const [initializing, setInitializing] = useState(true);
const navigate = useNavigate();
  // Dashboard state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
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

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Check existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const savedSession = localStorage.getItem('dvyb_admin_session');
        if (savedSession) {
          const adminData = JSON.parse(savedSession);
          setAdminInfo(adminData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('dvyb_admin_session');
      } finally {
        setInitializing(false);
      }
    };

    checkExistingSession();
  }, []);

  // Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Authentication handlers
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthError('Please fill in all fields');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      const result = await authenticateAdmin(email.trim(), password);
      
      if (result.success) {
        localStorage.setItem('dvyb_admin_session', JSON.stringify(result.admin));
        setAdminInfo(result.admin);
        // setIsAuthenticated(true);
      localStorage.setItem("email", email)
        navigate('/layout');
      } else {
        setAuthError(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dvyb_admin_session');
    setIsAuthenticated(false);
    setAdminInfo(null);
    setEmail('');
    setPassword('');
    setAuthError('');
    // Reset dashboard data
    setDashboardStats({
      totalRevenue: 0,
      totalOrders: 0,
      activeVendors: 0,
      pendingOrders: 0
    });
    setRevenueData([]);
    setPieData([]);
    setTopVendors([]);
    setRecentAlerts([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !authLoading) {
      handleLogin();
    }
  };

  // Dashboard data fetching
  const fetchDashboardData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setLoading(true);

    try {
      const vendorRegistrationsRef = collection(db, 'vendor_registrations');
      const usersRef = collection(db, 'users');
      
      const [vendorRegistrationsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(vendorRegistrationsRef),
        getDocs(usersRef)
      ]);

      const allUsersData = new Map();

      vendorRegistrationsSnapshot.forEach((doc) => {
        allUsersData.set(doc.id, { id: doc.id, ...doc.data(), source: 'vendor_registrations' });
      });
      
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

      for (let i = 0; i < 12; i++) {
        monthlyData[monthNames[i]] = {
          month: monthNames[i],
          Organizational: 0,
          B2C: 0
        };
      }

      for (const [userId, userData] of allUsersData) {
        const productsRef = collection(db, 'users', userId, 'products');
        
        try {
          const productsSnapshot = await getDocs(productsRef);
          
          let userTotalRevenue = 0;
          let userProductCount = 0;
          let publishedProducts = 0;
          
          productsSnapshot.forEach((productDoc) => {
            const product = productDoc.data();
            const price = parseFloat(product.price) || 0;
            
            userTotalRevenue += price;
            userProductCount++;
            totalOrders++;
            
            if (product.isPublished) {
              publishedProducts++;
            }

            const isOrganizational = Math.random() > 0.4;
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
            
            const vendorName = userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor';
            vendorRevenueMap.set(vendorName, {
              name: vendorName,
              revenue: userTotalRevenue,
              growth: Math.random() > 0.7 ? `-${Math.floor(Math.random() * 15)}%` : `+${Math.floor(Math.random() * 20)}%`,
              productCount: userProductCount,
              publishedCount: publishedProducts
            });
          }

          if (userProductCount > publishedProducts) {
            pendingOrders += (userProductCount - publishedProducts);
          }

        } catch (productError) {
          console.log(`No products found for user ${userId}`);
        }
      }

      setDashboardStats({
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        activeVendors,
        pendingOrders
      });

      setRevenueData(Object.values(monthlyData));

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

      setRecentAlerts(alerts.slice(0, 3));
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Show initial loading
  if (initializing) {
    return (
      <div className=" bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300 flex  items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full   border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">Initializing DVYB...</h2>
        </div>
      </div>
    );
  }

  // Login Screen
// if (!isAuthenticated) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md"> {/* Added max-w-md to limit form width */}
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-slate-700 tracking-wider">
            D<span className="text-slate-500">V</span><span className="text-slate-400">Y</span>B
          </h1>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-700 text-center mb-2">
            Super Admin Login
          </h2>
          <p className="text-sm text-slate-500 text-center mb-8">
            Welcome back! Log in to access dashboard
          </p>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {authError}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authError) setAuthError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter your admin email"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-md bg-white/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={authLoading}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-md bg-white/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={authLoading}
                autoComplete="current-password"
              />
              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-sm text-orange-400 hover:text-orange-500 transition-colors disabled:opacity-50"
                  disabled={authLoading}
                  onClick={() => {
                    alert('Please contact system administrator for password reset');
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={authLoading || !email.trim() || !password.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {authLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-600 text-center">
              🔒 Secure authentication via Firebase Firestore
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-xs text-slate-400">
            © 2018-2025 DVYB Technology
          </p>
        </div>
      </div>
    </div>
  );
}
// }