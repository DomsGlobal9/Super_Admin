import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { X, RefreshCw } from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

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

const FinanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    b2bRevenue: 0,
    b2cRevenue: 0,
    pendingPayout: 0
  });
  
  const [vendorPayouts, setVendorPayouts] = useState([]);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [filter, setFilter] = useState("All");

  // Static chart data (keeping your original design)
  const chartData = [
    { month: "Jan", "Digi warehouse": 40000, "B2C": 30000 },
    { month: "Feb", "Digi warehouse": 50000, "B2C": 40000 },
    { month: "Mar", "Digi warehouse": 30000, "B2C": 25000 },
    { month: "Apr", "Digi warehouse": 45000, "B2C": 35000 },
    { month: "May", "Digi warehouse": 60000, "B2C": 45000 },
    { month: "Jun", "Digi warehouse": 50000, "B2C": 40000 },
    { month: "Jul", "Digi warehouse": 30000, "B2C": 25000 },
    { month: "Aug", "Digi warehouse": 40000, "B2C": 30000 },
    { month: "Sep", "Digi warehouse": 45000, "B2C": 35000 },
    { month: "Oct", "Digi warehouse": 30000, "B2C": 25000 },
  ];

  // Fetch all users and their products
  const fetchAllData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setLoading(true);
    
    try {
      // Get all users from both collections to ensure we get all data
      const vendorRegistrationsRef = collection(db, 'vendor_registrations');
      const usersRef = collection(db, 'users');
      
      const [vendorRegistrationsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(vendorRegistrationsRef),
        getDocs(usersRef)
      ]);
      
      let totalRevenue = 0;
      let b2bRevenue = 0;
      const payoutsData = [];
      
      // Create a map of all user data
      const allUsersData = new Map();
      
      // Add vendor registration data
      vendorRegistrationsSnapshot.forEach((doc) => {
        allUsersData.set(doc.id, { id: doc.id, ...doc.data(), source: 'vendor_registrations' });
      });
      
      // Add/merge users data (profile data takes precedence)
      usersSnapshot.forEach((doc) => {
        const existingData = allUsersData.get(doc.id) || {};
        allUsersData.set(doc.id, { 
          ...existingData,
          ...doc.data(),
          id: doc.id,
          source: existingData.source ? 'both' : 'users'
        });
      });
      
      // Process each user
      for (const [userId, userData] of allUsersData) {
        // Get user's products from users collection (not vendor_registrations)
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
            
            // Simple addition of product prices - no units multiplication
            userTotalRevenue += price;
            userProductCount++;
            
            // Count published products
            if (product.isPublished) {
              publishedProducts++;
            }
          });
          
          totalRevenue += userTotalRevenue;
          b2bRevenue += userTotalRevenue; // All revenue considered B2B for now
          
          // Create vendor payout entry if user has products
          if (userProductCount > 0) {
            // Determine status based on published products and revenue
            let status = "Pending";
            if (publishedProducts > 0 && userTotalRevenue > 5000) {
              status = "Completed";
            } else if (publishedProducts > 0) {
              status = "Processing";
            } else if (userTotalRevenue === 0) {
              status = "Failed";
            }
            
            payoutsData.push({
              id: userId,
              vendor: userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor',
              amount: Math.round(userTotalRevenue).toString(),
              channel: "B2B",
              dueDate: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              status: status,
              vendorEmail: userData.email || 'No email',
              productCount: userProductCount,
              publishedCount: publishedProducts,
              userId: userId,
              contactNumber: userData.contactNumber || userData.mobileNumber || 'No phone',
              shopName: userData.shopDetails?.shopName || 'No shop name',
              businessType: userData.shopDetails?.businessType || 'Not specified',
              address: userData.personalDetails?.address || userData.address || 'No address',
              city: userData.personalDetails?.city || 'No city',
              joinedDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              }) : 'Unknown',
              dataSource: userData.source,
              category: userData.category || 'Not specified'
            });
          }
        } catch (productError) {
          console.log(`No products found for user ${userId}:`, productError.message);
          // Continue with next user
        }
      }
      
      // Update dashboard stats
      setDashboardStats({
        totalRevenue: Math.round(totalRevenue),
        b2bRevenue: Math.round(b2bRevenue),
        b2cRevenue: 0, // As requested
        pendingPayout: 0 // As requested
      });
      
      setVendorPayouts(payoutsData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter payouts
  const filteredData = filter === "All" ? vendorPayouts : vendorPayouts.filter((p) => p.status === filter);

  // Modal Component
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={onClose}
        ></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && !vendorPayouts.length) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Finance Dashboard...</h2>
          <p className="text-gray-500 mt-2">Fetching data from Firestore</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      {/* Top Title */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your revenue and vendor payouts</p>
          {lastUpdated && (
            <p className="text-sm text-green-600 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()} - Live data from Firestore
            </p>
          )}
        </div>
        <button
          onClick={() => fetchAllData(true)}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">B2B Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{dashboardStats.b2bRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">B2C Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{dashboardStats.b2cRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Payout</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{dashboardStats.pendingPayout}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Revenue Analysis</h2>
            <p className="text-gray-500 text-sm mt-1">Monthly revenue comparison</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100  rounded-lg hover:bg-gray-200 transition-colors">
          <select
            className="px-4 text-sm font-medium text-gray-700  
                       rounded-lg transition-colors
                       focus:outline-none"
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="Digi warehouse" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="B2C" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor Payouts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Vendor Payouts</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and track vendor payments - Live from Firestore</p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-medium text-gray-700">Vendor</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Channel</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Due Date</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((p, index) => (
                <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{p.vendor}</div>
                    <div className="text-sm text-gray-500">{p.vendorEmail}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {p.publishedCount}/{p.productCount} products published
                    </div>
                    {p.shopName !== 'No shop name' && (
                      <div className="text-xs text-green-600 mt-1">
                        Shop: {p.shopName}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">₹{parseInt(p.amount).toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.channel === 'B2B' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {p.channel}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{p.dueDate}</td>
                  <td className="py-4 px-4">
                    {p.status === "Completed" && <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>}
                    {p.status === "Processing" && <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processing</span>}
                    {p.status === "Failed" && <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>}
                    {p.status === "Pending" && <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => setSelectedPayout(p)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)}>
        {selectedPayout && (
          <div className="p-6 overflow-y-auto hide-scrollbar">
            <div className="flex justify-between  overflow-y-auto hide-scrollbar items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vendor Payout Details</h3>
                <p className="text-gray-500 text-sm">Vendor ID: #{selectedPayout.id.substring(0, 8)}</p>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full ${
                selectedPayout.status === 'Completed' ? 'bg-green-400' :
                selectedPayout.status === 'Processing' ? 'bg-blue-400' :
                selectedPayout.status === 'Failed' ? 'bg-red-400' : 'bg-orange-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-600">{selectedPayout.status}</span>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">₹{parseInt(selectedPayout.amount).toLocaleString()}</p>
              <p className="text-sm text-red-600 mt-1">
                {selectedPayout.status === 'Pending' ? 'Overdue' : 'On Time'}
              </p>
            </div>

            {/* Summary Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Vendor Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="font-medium text-gray-900">₹{parseInt(selectedPayout.amount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <p className="font-medium text-gray-900">{selectedPayout.productCount} items</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Published</p>
                  <p className="font-medium text-gray-900">{selectedPayout.publishedCount} items</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Channel</p>
                  <p className="font-medium text-gray-900">{selectedPayout.channel}</p>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Vendor Information</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Vendor Name</p>
                    <p className="font-medium text-gray-900">{selectedPayout.vendor}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Shop Name</p>
                    <p className="font-medium text-gray-900">{selectedPayout.shopName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-medium text-blue-600 text-sm break-all">{selectedPayout.vendorEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Contact</p>
                    <p className="font-medium text-gray-900">{selectedPayout.contactNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Business Type</p>
                    <p className="font-medium text-gray-900">{selectedPayout.businessType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Joined</p>
                    <p className="font-medium text-gray-900">{selectedPayout.joinedDate}</p>
                  </div>
                </div>
                {selectedPayout.address && selectedPayout.address !== 'No address' && (
                  <div>
                    <p className="text-gray-500 text-sm">Address</p>
                    <p className="font-medium text-gray-900 text-sm">{selectedPayout.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500 text-sm">User ID</p>
                  <p className="font-mono text-xs text-gray-600 break-all">{selectedPayout.userId}</p>
                </div>
                {selectedPayout.dataSource && (
                  <div>
                    <p className="text-gray-500 text-sm">Data Source</p>
                    <p className="font-medium text-green-600 text-xs">{selectedPayout.dataSource}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Status Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Payment Status</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    id="withheld" 
                    name="payment-status" 
                    className="w-4 h-4 text-blue-600 mt-1"
                    defaultChecked={selectedPayout.status === "Pending"}
                    readOnly
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">Payout Withheld</div>
                    <div className="text-gray-500 text-sm">{selectedPayout.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    id="processing" 
                    name="payment-status" 
                    className="w-4 h-4 text-blue-600 mt-1"
                    defaultChecked={selectedPayout.status === "Processing"}
                    readOnly
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">Payment Processing</div>
                    <div className="text-gray-500 text-sm">{selectedPayout.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    id="completed" 
                    name="payment-status" 
                    className="w-4 h-4 text-blue-600 mt-1"
                    defaultChecked={selectedPayout.status === "Completed"}
                    readOnly
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">Payment Completed</div>
                    <div className="text-gray-500 text-sm">{selectedPayout.dueDate}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedPayout(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinanceDashboard;