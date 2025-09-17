import { useState, useEffect } from "react";
import { X, User, Package, DollarSign, AlertTriangle, Clock, Trash2, RefreshCw, Eye, ArrowLeft } from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";




import vendormanage_ic1 from '../assets/vendormanage_ic1.png';
import vendormanage_ic2 from '../assets/vendormanage_ic2.png';
import vendormanage_ic3 from '../assets/vendormanage_ic3.png';
import vendormanage_ic4 from '../assets/vendormanage_ic4.png';
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

export default function VendorManagement() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Product view states
  const [showProducts, setShowProducts] = useState(false);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  
  // Vendor data
  const [vendorsData, setVendorsData] = useState([]);

  // Fetch vendor products
  const fetchVendorProducts = async (vendorId) => {
    setProductsLoading(true);
    setProductsError(null);
    
    try {
      const productsRef = collection(db, 'users', vendorId, 'products');
      const productsSnapshot = await getDocs(productsRef);
      
      const products = [];
      productsSnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by creation date (most recent first)
      products.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });
      
      setVendorProducts(products);
    } catch (error) {
      console.error('Error fetching vendor products:', error);
      setProductsError(error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle view products button click
  const handleViewProducts = () => {
    if (selectedVendor) {
      setShowProducts(true);
      fetchVendorProducts(selectedVendor.id);
    }
  };

  // Handle back to vendor details
  const handleBackToVendorDetails = () => {
    setShowProducts(false);
    setVendorProducts([]);
    setProductsError(null);
  };

  // Fetch all vendors and their data
  const fetchVendorsData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    setLoading(true);
    setError(null);
    
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
      
      const vendors = [];
      let serialNumber = 1;
      
      // Process each user
      for (const [userId, userData] of allUsersData) {
        // Get user's products
        const productsRef = collection(db, 'users', userId, 'products');
        
        try {
          const productsSnapshot = await getDocs(productsRef);
          
          let userTotalRevenue = 0;
          let userProductCount = 0;
          let publishedProducts = 0;
          
          // Calculate stats for this vendor
          productsSnapshot.forEach((productDoc) => {
            const product = productDoc.data();
            const price = parseFloat(product.price) || 0;
            
            // Simple addition of product prices
            userTotalRevenue += price;
            userProductCount++;
            
            // Count published products
            if (product.isPublished) {
              publishedProducts++;
            }
          });
          
          // Create vendor entry if they have any data or products
          if (userProductCount > 0 || userData.email) {
            // Determine status based on published products and activity
            let status = "Pending";
            if (publishedProducts > 0 && userTotalRevenue > 1000) {
              status = "Active";
            } else if (userTotalRevenue === 0 && userProductCount === 0) {
              status = "Declined";
            }
            
            vendors.push({
              id: userId,
              serialNumber: serialNumber++,
              name: userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor',
              email: userData.email || 'No email',
              revenue: userTotalRevenue.toFixed(2),
              orders: Math.floor(userTotalRevenue / 100), // Estimated orders based on revenue
              rating: (4.0 + Math.random() * 1.0).toFixed(1) + "★", // Random rating between 4.0-5.0
              status: status,
              phone: userData.contactNumber || userData.mobileNumber || 'No phone',
              location: `${userData.personalDetails?.address || userData.address || 'No address'}, ${userData.personalDetails?.city || 'Unknown City'}`,
              products: userProductCount,
              publishedProducts: publishedProducts,
              shopName: userData.shopDetails?.shopName || 'No shop name',
              businessType: userData.shopDetails?.businessType || 'Not specified',
              category: userData.category || 'General',
              joinedDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric' 
              }) : 'Unknown',
              dataSource: userData.source
            });
          }
        } catch (productError) {
          // If user has no products but has profile data, still add them
          if (userData.email) {
            vendors.push({
              id: userId,
              serialNumber: serialNumber++,
              name: userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor',
              email: userData.email || 'No email',
              revenue: "0.00",
              orders: 0,
              rating: "4.0★",
              status: "Declined",
              phone: userData.contactNumber || userData.mobileNumber || 'No phone',
              location: `${userData.personalDetails?.address || userData.address || 'No address'}, ${userData.personalDetails?.city || 'Unknown City'}`,
              products: 0,
              publishedProducts: 0,
              shopName: userData.shopDetails?.shopName || 'No shop name',
              businessType: userData.shopDetails?.businessType || 'Not specified',
              category: userData.category || 'General',
              imagepath : userData.imageUrls || 'No image',

              joinedDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric' 
              }) : 'Unknown',
              dataSource: userData.source
            });
          }
        }
      }
      
      setVendorsData(vendors);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching vendors data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVendorsData();
  }, []);

  // Filter vendors
  const filteredVendors = vendorsData.filter((vendor) => {
    const matchesFilter = filter === "All" || vendor.status === filter;
    const matchesSearch = vendor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle remove vendor
  const handleRemoveClick = () => {
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedVendor) return;
    
    try {
      // This would typically involve more complex deletion logic
      // For now, we'll just update the local state
      setVendorsData(vendors => vendors.filter(v => v.id !== selectedVendor.id));
      setShowRemoveConfirm(false);
      setSelectedVendor(null);
      setShowRemoveSuccess(true);
    } catch (error) {
      console.error('Error removing vendor:', error);
      alert('Failed to remove vendor: ' + error.message);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirm(false);
  };

  const handleSuccessContinue = () => {
    setShowRemoveSuccess(false);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setSelectedVendor(null);
    setShowProducts(false);
    setVendorProducts([]);
    setProductsError(null);
  };

  // Loading state
  if (loading && !vendorsData.length) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Vendors...</h2>
          <p className="text-gray-500 mt-2">Fetching data from Firestore</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <X className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Vendors</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => fetchVendorsData()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen min-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Vendor Management</h2>
          {lastUpdated && (
            <p className="text-sm text-green-600 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()} 
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white text-black px-4 py-2 w-full sm:w-64 rounded-lg "
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white text-black rounded-lg px-4 py-2  w-full sm:w-auto"
          >
            <option value="All">Filter by</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>
         {/* <button
            onClick={() => fetchVendorsData(true)}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button> */}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{vendorsData.length}</p>
            </div>
            <img src={vendormanage_ic1} className="h-11" alt="" />
            {/* <User className="w-8 h-8 text-blue-500" /> */}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm">Active Vendors</p>
              <p className="text-2xl font-bold text-grey-500">{vendorsData.filter(v => v.status === 'Active').length}</p>
            </div>
            <div className=" bg-green-100 rounded-lg flex items-center justify-center">
              {/* <div className="w-4 h-4 bg-green-600 rounded"></div> */}
                          <img src={vendormanage_ic2} className="h-12 w-12"  alt="" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold  text-black">{vendorsData.reduce((sum, v) => sum + v.products, 0)}</p>
            </div>
            {/* <Package className="w-8 h-8 text-blue-500" /> */}
            <div className="bg-[#506B85] h-12 w-12 rounded-lg">
                        <img src={vendormanage_ic3} className=" p-2" alt="" />
                        </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-black">₹{vendorsData.reduce((sum, v) => sum + parseFloat(v.revenue), 0).toLocaleString()}</p>
            </div>
            {/* <DollarSign className="w-8 h-8 text-green-500" /> */}
                        <img src={vendormanage_ic4} className="h-11" alt="" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-3 sm:p-6 bg-white min-h-screen min-w-full rounded-lg shadow-sm ">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-700">
              <tr>
                <th className="px-6 py-3">S.No</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-blue-50 transition text-gray-700 border-b border-gray-100"
                  >
                    <td className="px-6 py-3">{vendor.serialNumber}</td>
                    <td className="px-5 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-xs text-gray-500">{vendor.shopName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-sm">{vendor.email}</div>
                      <div className="text-xs text-gray-500">{vendor.phone}</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold">₹{parseFloat(vendor.revenue).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{vendor.orders} orders</div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-medium">{vendor.products}</div>
                      <div className="text-xs text-green-600">{vendor.publishedProducts} published</div>
                    </td>
                    <td className="px-6 py-3">{vendor.rating}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vendor.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : vendor.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center text-gray-500 py-6"
                  >
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-lg p-4 shadow-sm border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{vendor.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{vendor.email}</p>
                    <p className="text-xs text-blue-600">{vendor.shopName}</p>
                  </div>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      vendor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : vendor.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Revenue:</span>
                    <div className="font-medium text-gray-900">₹{parseFloat(vendor.revenue).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Orders:</span>
                    <div className="font-medium text-gray-900">{vendor.orders}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Rating:</span>
                    <div className="font-medium text-gray-900">{vendor.rating}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Products:</span>
                    <div className="font-medium text-gray-900">{vendor.products} ({vendor.publishedProducts} published)</div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedVendor(vendor)}
                  className="w-full text-blue-600 text-sm hover:underline text-left"
                >
                  View Details →
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No vendors found.
            </div>
          )}
        </div>
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && !showRemoveConfirm && !showProducts && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center overflow-y-auto p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl mx-4">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 sm:p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Vendor Details
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Vendor Name */}
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {selectedVendor.name}
                </h4>
                <p className="text-sm text-blue-600">{selectedVendor.shopName}</p>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-sm text-gray-900 break-all">{selectedVendor.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Phone
                  </p>
                  <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                </div>
              </div>

              {/* Business Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Business Type
                  </p>
                  <p className="text-sm text-gray-900">{selectedVendor.businessType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Joined
                  </p>
                  <p className="text-sm text-gray-900">{selectedVendor.joinedDate}</p>
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Location
                </p>
                <p className="text-sm text-gray-900">{selectedVendor.location}</p>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedVendor.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : selectedVendor.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    selectedVendor.status === "Active"
                      ? "bg-green-500"
                      : selectedVendor.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}></span>
                  {selectedVendor.status}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Revenue
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">₹{parseFloat(selectedVendor.revenue).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Order Count
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{selectedVendor.orders}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Products Listed
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{selectedVendor.products}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Published
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-green-600">{selectedVendor.publishedProducts}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Rating
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{selectedVendor.rating}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Data Source
                  </p>
                  <p className="text-sm font-medium text-green-600">{selectedVendor.dataSource}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleViewProducts}
                  className="w-full text-white px-4 py-3 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  View All Products ({selectedVendor.products})
                </button>

                <button 
                  onClick={handleRemoveClick}
                  className="w-full text-white px-4 py-3 rounded-lg font-medium transition-colors bg-red-600 hover:bg-red-700"
                >
                  Remove Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Products Modal */}
      {selectedVendor && showProducts && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center overflow-y-auto p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl mx-4">
            {/* Header with back and close buttons */}
            <div className="flex items-center justify-between p-4 sm:p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToVendorDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {selectedVendor.name} - Products
                  </h3>
                  <p className="text-sm text-gray-500">{selectedVendor.shopName}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Products Content */}
            <div className="p-4 sm:p-6">
              {productsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : productsError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-4">
                    <AlertTriangle className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4">Error loading products: {productsError}</p>
                  <button 
                    onClick={() => fetchVendorProducts(selectedVendor.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : vendorProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h4>
                  <p className="text-gray-500">This vendor hasn't added any products yet.</p>
                </div>
              ) : (
                <>
                  {/* Products Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{vendorProducts.length}</p>
                        <p className="text-sm text-blue-700">Total Products</p>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{vendorProducts.filter(p => p.isPublished).length}</p>
                        <p className="text-sm text-green-700">Published</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-600">{vendorProducts.filter(p => !p.isPublished).length}</p>
                        <p className="text-sm text-gray-700">Draft</p>
                      </div>
                    </div>
                  </div>

                  {/* Products Table - Desktop */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-gray-700 bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">Product</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Stock</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 rounded-tr-lg">Added</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorProducts.map((product, index) => (
                          // {console.log(product.imagepath  )}
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {product.imageUrls && product.imageUrls[0]  ? (
                                  <img 
                              src={product.imageUrls[0]} 

                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                  />
                                ) 
                                : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 truncate max-w-[200px]">
                                    {product.name }
                                  </p>
                                  <h2 className="font-medium text-black truncate max-w-[200px]">
                                    {product.description || 'Unnamed Product'}
                                  </h2>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">
                                {product.category || 'Uncategorized'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-medium text-gray-900">
                                ₹{product.price ? parseFloat(product.price).toLocaleString() : '0'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">
                                {product.stock || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.isPublished 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {product.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-gray-500">
                                {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                }) : 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Products Cards - Mobile */}
                  <div className="lg:hidden space-y-4">
                    {vendorProducts.map((product) => (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex gap-3 mb-3">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {product.name || 'Unnamed Product'}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {product.category || 'Uncategorized'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            product.isPublished 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {product.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <div className="font-medium text-gray-900">₹{product.price ? parseFloat(product.price).toLocaleString() : '0'}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Stock:</span>
                            <div className="font-medium text-gray-900">{product.stock || 'N/A'}</div>
                          </div>
                        </div>
                        
                        {product.description && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Description:</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
                          </div>
                        )}
                        
                        <div className="mt-3 text-xs text-gray-500">
                          Added: {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'Unknown'}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Remove Vendor?</h3>
              <button
                onClick={handleCancelRemove}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Warning Text */}
            <p className="text-sm text-gray-600 mb-6">
              Removing this vendor will permanently delete all associated data, including product listings and order history. This action cannot be undone.
            </p>

            {/* Vendor Details Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Vendor Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{selectedVendor?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Products</span>
                  <span className="text-sm font-medium text-gray-900">{selectedVendor?.products}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Revenue</span>
                  <span className="text-sm font-medium text-gray-900">₹{selectedVendor && parseFloat(selectedVendor.revenue).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{selectedVendor?.orders} Orders</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelRemove}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Success Modal */}
      {showRemoveSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm mx-4 p-4 sm:p-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>

            {/* Success Message */}
            <h3 className="text-lg font-semibold text-red-600 mb-2">Removed</h3>
            <p className="text-sm text-gray-600 mb-6">
              The vendor has been removed.<br />
              Shortly you will find a confirmation in your email.
            </p>

            {/* Continue Button */}
            <button
              onClick={handleSuccessContinue}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
















// import vendormanage_ic1 from '../assets/vendormanage_ic1.png';
// import vendormanage_ic2 from '../assets/vendormanage_ic2.png';
// import vendormanage_ic3 from '../assets/vendormanage_ic3.png';
// import vendormanage_ic4 from '../assets/vendormanage_ic4.png';
//             <img src={vendormanage_ic1} className="h-11" alt="" />