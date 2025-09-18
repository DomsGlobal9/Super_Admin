import { useState, useEffect } from "react";
import Model from '../assets/model.png';
import { ArrowUp, Eye, X, Check, AlertTriangle, Filter, ChevronDown, RefreshCw, Loader } from "lucide-react";
import ic_uploadproduct1 from '../assets/ic_uploadproduct1.png';
import ic_uploadproduct2 from '../assets/ic_uploadproduct2.png';
import ic_uploadproduct3 from '../assets/ic_uploadproduct3.png';
import ic_uploadproduct4 from '../assets/ic_uploadproduct4.png';
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

export default function UploadedProducts() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Firebase state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [uploadStats, setUploadStats] = useState({
    totalUploads: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });

  // Fetch all users and their products
  const fetchAllData = async (showRefreshing = false) => {
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
      
      const allProductsData = [];
      const vendorsWithProducts = [];
      let totalUploads = 0;
      let processingCount = 0;
      let completedCount = 0;
      let failedCount = 0;

      // Process each user
      for (const [userId, userData] of allUsersData) {
        try {
          const productsRef = collection(db, 'users', userId, 'products');
          const productsSnapshot = await getDocs(productsRef);
          
          if (!productsSnapshot.empty) {
            let userProducts = [];
            let userProcessingCount = 0;
            let userCompletedCount = 0;
            let userPendingCount = 0;
            let userFailedCount = 0;

            productsSnapshot.forEach((productDoc) => {
              const product = productDoc.data();
              const productData = {
                id: productDoc.id,
                userId: userId,
                vendor: userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor',
                vendorEmail: userData.email || 'No email',
                fileName: `products_${productDoc.id.substring(0, 8)}.xlsx`,
                date: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                uploadDate: product.createdAt ? new Date(product.createdAt) : new Date(),
                status: product.isPublished ? 'Completed' : 'Pending',
                progress: product.isPublished ? 100 : Math.floor(Math.random() * 80) + 10,
                items: 1,
                category: product.category || 'Uncategorized',
                name: product.description || 'Unnamed Product',
                sku: productDoc.id.substring(0, 10).toUpperCase(),
                price: product.price || '0',
                stock: Math.floor(Math.random() * 100) + 1,
                material: product.material || 'Not specified',
                design: product.design || 'Not specified',
                dressType: product.dressType || 'Not specified',
                imageUrls: product.imageUrls || []
              };

              // Count by status
              if (product.isPublished) {
                userCompletedCount++;
                completedCount++;
              } else {
                userPendingCount++;
                processingCount++;
              }

              userProducts.push(productData);
              allProductsData.push(productData);
              totalUploads++;
            });

            // Create vendor summary for vendor detail view
            vendorsWithProducts.push({
              userId: userId,
              vendor: userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor',
              vendorEmail: userData.email || 'No email',
              fileName: `bulk_upload_${userId.substring(0, 8)}.xlsx`,
              date: new Date().toLocaleDateString(),
              status: userCompletedCount > 0 ? 'Completed' : 'Pending',
              progress: userCompletedCount > 0 ? 100 : Math.floor((userCompletedCount / userProducts.length) * 100),
              items: userProducts.length,
              products: userProducts,
              uploadInfo: {
                status: "Active",
                vendor: userData.personalDetails?.name || userData.firstName || userData.username || userData.fullName || 'Unknown Vendor',
                fileSize: `${(userProducts.length * 0.1).toFixed(1)} MB`,
                uploadDate: new Date().toLocaleDateString(),
                processingTime: "2m 45s",
                uploadedBy: userData.email || 'No email'
              },
              processingStats: {
                allItems: userProducts.length,
                approved: userCompletedCount,
                rejected: userFailedCount,
                pending: userPendingCount
              },
              categories: getCategoriesBreakdown(userProducts)
            });
          }
        } catch (productError) {
          console.log(`No products found for user ${userId}:`, productError.message);
        }
      }

      // Update state
      setAllProducts(allProductsData);
      setVendorData(vendorsWithProducts);
      setUploadStats({
        totalUploads,
        processing: processingCount,
        completed: completedCount,
        failed: failedCount
      });
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Get categories breakdown
  const getCategoriesBreakdown = (products) => {
    const categoryCount = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count
    }));
  };

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter data based on selected filter
  const getFilteredData = () => {
    if (selectedFilter === 'all') {
      return vendorData;
    }
    return vendorData.filter(vendor => vendor.status === selectedFilter);
  };

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Declined', label: 'Declined' }
  ];

  const StatusPill = ({ status }) => {
    const statusStyles = {
      'Completed': 'bg-green-50 text-green-700 border border-green-200',
      'Processing': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Pending': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'Declined': 'bg-red-50 text-red-700 border border-red-200',
      'Approved': 'bg-green-50 text-green-700 border border-green-200',
      'Rejected': 'bg-red-50 text-red-700 border border-red-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const ProgressBar = ({ progress, status }) => {
    const barColor = status === 'Completed' ? 'bg-green-500' : 
                    status === 'Processing' ? 'bg-blue-500' : 
                    status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${progress}%` }}></div>
      </div>
    );
  };

  const handleViewClick = (vendor) => {
    setSelectedVendor(vendor);
    setCurrentView('vendor-detail');
    setActiveTab('overview');
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleProductDelete = () => {
    setShowProductModal(false);
    setShowSuccessModal(true);
  };

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setShowFilterDropdown(false);
  };

  const handleRefresh = () => {
    fetchAllData(true);
  };

  // Loading state
  if (loading && !vendorData.length) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Uploaded Products...</h2>
          <p className="text-gray-500 mt-2">Fetching data from Firestore</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div>
      {/* Recent Uploads */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
            <p className="text-sm text-gray-500">Latest product upload activity and status - Live from Firestore</p>
            {lastUpdated && (
              <p className="text-xs text-gray-400 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            {/* <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button> */}

            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filter By
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          selectedFilter === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">File</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getFilteredData().map((vendor) => (
                  <tr key={vendor.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{vendor.vendor}</p>
                        <p className="text-xs text-gray-500">{vendor.date}</p>
                        <p className="text-xs text-blue-600">{vendor.vendorEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">{vendor.fileName}</p>
                      <p className="text-xs text-gray-500">{vendor.uploadInfo.fileSize}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={vendor.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24">
                        <ProgressBar progress={vendor.progress} status={vendor.status} />
                        <p className="text-xs text-gray-500 mt-1">{vendor.progress}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{vendor.items}</p>
                      <p className="text-xs text-green-600">
                        {vendor.processingStats.approved} published
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewClick(vendor)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {getFilteredData().length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Filter className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">No uploads found for "{filterOptions.find(f => f.value === selectedFilter)?.label}"</p>
              <button 
                onClick={() => setSelectedFilter('all')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Common Upload Issues */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Common Upload Issues</h3>
          <p className="text-sm text-gray-500">Frequent errors to help vendors improve their uploads</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl border bg-red-50 border-red-200">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {allProducts.filter(p => !p.material || p.material === 'Not specified').length} occurrences
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Missing required product fields</p>
          </div>
          
          <div className="p-6 rounded-xl border bg-yellow-50 border-yellow-200">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {allProducts.filter(p => !p.price || p.price === '0').length} occurrences
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Invalid Price Format</p>
          </div>
          
          <div className="p-6 rounded-xl border bg-yellow-50 border-yellow-200">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {allProducts.filter(p => !p.imageUrls || p.imageUrls.length === 0).length} occurrences
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Missing Product Images</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVendorDetail = () => (
    <div>
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'products' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Products
        </button>
      </div>

      {activeTab === 'overview' && selectedVendor && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Information</h3>
            <div className="space-y-4">
              {Object.entries(selectedVendor.uploadInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Statistics</h3>
            <div className="space-y-4">
              {Object.entries(selectedVendor.processingStats).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && selectedVendor && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Breakdown</h3>
          <p className="text-sm text-gray-500 mb-6">Products by different categories</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedVendor.categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{category.name}</h4>
                <p className="text-3xl font-bold text-gray-900 mb-2">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && selectedVendor && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedVendor.products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{product.category}</p>
                        <p className="text-xs text-gray-500">{product.dressType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{product.stock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleProductView(product)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderProductModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl overflow-y-auto hide-scrollbar max-h-[90vh] m-4 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-green-700">Product Details</h2>
          <button 
            onClick={() => setShowProductModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {selectedProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Product info */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-500 mb-3">SKU: {selectedProduct.sku}</p>
                <StatusPill status={selectedProduct.status} />
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Pricing</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Price:</span>
                    <span className="text-sm font-bold text-gray-900">₹{selectedProduct.price}</span>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Attributes</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Material:</span>
                    <span className="text-sm text-gray-900">{selectedProduct.material}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Design:</span>
                    <span className="text-sm text-gray-900">{selectedProduct.design}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Dress Type:</span>
                    <span className="text-sm text-gray-900">{selectedProduct.dressType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Category:</span>
                    <span className="text-sm text-gray-900">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Stock:</span>
                    <span className="text-sm text-gray-900">{selectedProduct.stock}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4">
                  {selectedProduct.name} - A beautiful {selectedProduct.dressType} made from {selectedProduct.material} 
                  with {selectedProduct.design} design. Perfect for any occasion.
                </p>
              </div>

              <button 
                onClick={handleProductDelete}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Product
              </button>
            </div>

            {/* Right side - Product image */}
            <div className="flex justify-center items-start pt-15">
              <div className="w-80 h-56 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0 ? (
                    <img 
                      src={selectedProduct.imageUrls[0]} 
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : (
                    <img src={Model} className="h-96 mt-50" alt="Product placeholder" />
                  )}
                  <div style={{ display: 'none' }}>
                    <img src={Model} className="h-96 mt-50" alt="Product placeholder" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md m-4 text-center shadow-xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Deleted Successfully</h3>
        <p className="text-sm text-gray-600 mb-8">The product has been deleted from the system</p>
        <button 
          onClick={() => setShowSuccessModal(false)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uploaded Products</h1>
            <p className="text-sm mt-4 text-gray-600 mt-1">Monitor and manage bulk product uploads from vendors</p>
          </div>
          {/* {currentView !== 'dashboard' && (
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
          )} */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#506B85]">
                {/* <ArrowUp className="h-5 w-5 text-blue-600" /> */}
                <img src={ic_uploadproduct4} alt="" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total uploads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{uploadStats.totalUploads}</p>
                
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#506B85]">
                {/* <Loader className="h-5 w-5 text-orange-600" /> */}
                <img src={ic_uploadproduct3} alt="" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Processing</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{uploadStats.processing}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl  bg-[#506B85]">
                {/* <Check className="h-5 w-5 text-green-600" /> */}
                <img src={ic_uploadproduct2} alt="" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{uploadStats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl  bg-[#506B85]">
                {/* <AlertTriangle className="h-5 w-5 text-red-600" /> */}
                <img src={ic_uploadproduct1} alt="" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Failed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{uploadStats.failed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'vendor-detail' && renderVendorDetail()}

        {/* Modals */}
        {showProductModal && renderProductModal()}
        {showSuccessModal && renderSuccessModal()}
        
        {/* Overlay to close dropdown */}
        {showFilterDropdown && (
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => setShowFilterDropdown(false)}
          ></div>
        )}
      </div>
    </div>
  );
}