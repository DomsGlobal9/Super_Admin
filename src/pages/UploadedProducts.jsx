import React, { useState } from "react";
import Model from '../assets/model.png'
import { ArrowUp, Eye, X, Check, AlertTriangle, Filter, ChevronDown } from "lucide-react";

export default function UploadedProducts() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Mock data
  const uploadStats = [
    { label: "Total uploads", value: "40,689", icon: ArrowUp, color: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Processing", value: "689", icon: ArrowUp, color: "bg-orange-50", iconColor: "text-orange-600" },
    { label: "Completed", value: "10293", icon: Check, color: "bg-green-50", iconColor: "text-green-600" },
    { label: "Failed", value: "10293", icon: AlertTriangle, color: "bg-red-50", iconColor: "text-red-600" }
  ];

  const recentUploads = [
    { vendor: "Fashion Forward Ltd", date: "2024-06-18", file: "summer_collection_2024.xlsx", status: "Completed", progress: 100, items: 250 },
    { vendor: "Style Innovations", date: "2024-06-18", file: "winter_catalog.csv", status: "Pending", progress: 60, items: 76 },
    { vendor: "Glamour Goods", date: "2024-06-17", file: "accessories_bulk.xlsx", status: "Declined", progress: 100, items: 12 },
    { vendor: "Trend Setters Co", date: "2024-06-17", file: "spring_preview.CSV", status: "Processing", progress: 75, items: 23 },
    { vendor: "Urban Style", date: "2024-06-16", file: "new_arrivals.xlsx", status: "Completed", progress: 100, items: 189 },
    { vendor: "Classic Wear", date: "2024-06-16", file: "formal_collection.csv", status: "Pending", progress: 30, items: 45 },
    { vendor: "Modern Trends", date: "2024-06-15", file: "casual_wear.xlsx", status: "Declined", progress: 100, items: 78 }
  ];

  const commonIssues = [
    { issue: "Missing required product fields", severity: "High", count: "34 occurrences" },
    { issue: "Invalid Price Format", severity: "Medium", count: "12 occurrences" },
    { issue: "Invalid Price Format", severity: "Medium", count: "8 occurrences" }
  ];

  const vendorOverview = {
    uploadInfo: {
      status: "Active",
      vendor: "Fashion Forward Ltd",
      fileSize: "2.4 MB",
      uploadDate: "18-06-2024",
      processingTime: "2m 45s",
      responsibility: "john.doe@fashionforward.com"
    },
    processingStats: {
      allItems: 250,
      approved: 230,
      rejected: 8,
      pending: 6
    },
    categories: [
      { name: "Clothing Women", count: 34, products: "Products" },
      { name: "Clothing Men", count: 45, products: "Products" },
      { name: "Accessories", count: 23, products: "Products" }
    ]
  };

  const productsList = [
    { name: "Summer Floral Dress", sku: "FF-SFD-001", category: "Clothing Women", status: "Approved", price: "₹250", stock: 230 },
    { name: "Casual Summer Shorts", sku: "FF-CSS-002", category: "Clothing Women", status: "Approved", price: "₹178", stock: 76 },
    { name: "Summer Floral Dress", sku: "FF-SFD-003", category: "Clothing Women", status: "Rejected", price: "₹312", stock: 12 },
    { name: "Summer Floral Dress", sku: "FF-SFD-004", category: "Clothing Shorts", status: "Pending", price: "₹213", stock: 23 }
  ];

  const productDetails = {
    name: "Summer Floral Dress",
    sku: "FF-SFD-001",
    status: "Approved",
    pricing: {
      mrp: "₹319",
      salePrice: "₹287",
      costPrice: "₹178"
    },
    attributes: {
      brand: "Zara Woman",
      size: "Medium",
      weight: "Cotton Blend",
      color: "Red",
      manufacturer: "Zara",
      tags: "S, M, L",
      availability: "Summer, Daily Wear"
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Declined', label: 'Declined' }
  ];

  // Filter uploads based on selected filter
  const filteredUploads = selectedFilter === 'all' 
    ? recentUploads 
    : recentUploads.filter(upload => upload.status === selectedFilter);

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

  const handleProductDelete = () => {
    setShowProductModal(false);
    setShowSuccessModal(true);
  };

  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setShowFilterDropdown(false);
  };

  const renderDashboard = () => (
    <div>
      {/* Recent Uploads */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Uploads</h3>
            <p className="text-sm text-gray-500">Latest product upload activity and status</p>
          </div>
          
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
                {filteredUploads.map((upload, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{upload.vendor}</p>
                        <p className="text-xs text-gray-500">{upload.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">{upload.file}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={upload.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24">
                        <ProgressBar progress={upload.progress} status={upload.status} />
                        <p className="text-xs text-gray-500 mt-1">{upload.progress}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{upload.items}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewClick(upload)}
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
          
          {filteredUploads.length === 0 && (
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
          {commonIssues.map((issue, index) => (
            <div key={index} className={`p-6 rounded-xl border ${
              issue.severity === 'High' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  issue.severity === 'High' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    issue.severity === 'High' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  issue.severity === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {issue.count}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{issue.issue}</p>
            </div>
          ))}
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Information</h3>
            <div className="space-y-4">
              {Object.entries(vendorOverview.uploadInfo).map(([key, value]) => (
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
              {Object.entries(vendorOverview.processingStats).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Breakdown</h3>
          <p className="text-sm text-gray-500 mb-6">Products by different categories</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendorOverview.categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{category.name}</h4>
                <p className="text-3xl font-bold text-gray-900 mb-2">{category.count}</p>
                <p className="text-sm text-gray-500">{category.products}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
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
                {productsList.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{product.category.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{product.category.split(' ').slice(1).join(' ')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={product.status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{product.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{product.stock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setShowProductModal(true)}
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
      <div className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          <button 
            onClick={() => setShowProductModal(false)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Product info */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{productDetails.name}</h3>
              <p className="text-sm text-gray-500 mb-3">SKU: {productDetails.sku}</p>
              <StatusPill status={productDetails.status} />
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">Pricing</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {Object.entries(productDetails.pricing).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-sm font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attributes */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">Attributes</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {Object.entries(productDetails.attributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize font-medium">{key}:</span>
                    <span className="text-sm text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4">
                This Summer Floral Dress is perfect for any occasion. Made from a lightweight cotton blend, it features a
                vibrant floral pattern and flows beautifully. Available sizes: S, M, L, XL
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
          <div className="flex justify-center items-start">
            <div className="w-80 h-56 flex items-center justify-center ">
              <div className="text-center text-gray-400">
                {/* <div className="w-32 h-40 bg-gray-300 rounded-lg mx-auto mb-4 shadow-sm"></div> */}
                <img src={Model} alt="" />
                {/* <p className="text-sm font-medium">Product Image</p>
                <p className="text-xs text-gray-500 mt-1">No image available</p> */}
              </div>
            </div>
          </div>
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Product Uploads</h1>
            <p className="text-sm text-gray-600 mt-1">Monitor and manage bulk product uploads from vendors</p>
          </div>
          {currentView !== 'dashboard' && (
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {uploadStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
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