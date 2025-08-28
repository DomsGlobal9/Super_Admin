import React, { useState, useEffect } from 'react';
import { Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

const CommissionControl = () => {
  const [defaultRate, setDefaultRate] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [originalValues, setOriginalValues] = useState({});
  
  const [vendors, setVendors] = useState([
    { id: 'acme', name: 'Acme Corporation', rate: 15 },
    { id: 'globex', name: 'Globex Corporation', rate: 12 },
    { id: 'soylent', name: 'Soylent Corp', rate: 8 },
    { id: 'initech', name: 'Initech', rate: 10 }
  ]);

  // Initialize original values
  useEffect(() => {
    setOriginalValues({
      defaultRate: defaultRate,
      vendors: vendors.reduce((acc, vendor) => ({
        ...acc,
        [vendor.id]: vendor.rate
      }), {})
    });
  }, []);

  // Check if there are unsaved changes
  const hasChanges = () => {
    if (defaultRate !== originalValues.defaultRate) return true;
    
    return vendors.some(vendor => 
      vendor.rate !== originalValues.vendors?.[vendor.id]
    );
  };

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update vendor rate
  const updateVendorRate = (vendorId, newRate) => {
    setVendors(vendors.map(vendor =>
      vendor.id === vendorId ? { ...vendor, rate: parseInt(newRate) || 0 } : vendor
    ));
  };

  // Handle navigation with change detection
  const handleNavigation = (direction) => {
    if (hasChanges()) {
      setShowSaveModal(true);
    } else {
      // Navigate logic would go here
      console.log(`Navigating ${direction}`);
    }
  };

  // Save changes
  const saveChanges = () => {
    setOriginalValues({
      defaultRate: defaultRate,
      vendors: vendors.reduce((acc, vendor) => ({
        ...acc,
        [vendor.id]: vendor.rate
      }), {})
    });
    setShowSaveModal(false);
  };

  // Cancel changes
  const cancelChanges = () => {
    setShowSaveModal(false);
  };

  return (
    <div className=" mx-auto my-5 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
        <h1 className="text-lg font-medium text-gray-900">Commission Control</h1>
        <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Global Settings */}
        <div className="mb-6">
          <h2 className="text-base font-medium mb-4 text-gray-900">Global Settings</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Default Commission Rate</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={defaultRate}
                  onChange={(e) => setDefaultRate(parseInt(e.target.value) || 0)}
                  className="w-[60px] px-3 py-1.5 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor-Specific Overrides */}
        <div>
          <h2 className="text-base font-medium mb-4 text-gray-900">Vendor-Specific Overrides</h2>
          <div className="border border-gray-200 rounded-md bg-white">
            {/* Search Box */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search vendors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Vendor Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">Vendor</span>
              <span className="text-xs font-medium text-gray-600">Commission Rate</span>
            </div>

            {/* Vendor Rows */}
            {filteredVendors.map((vendor, index) => (
              <div
                key={vendor.id}
                className={`flex justify-between items-center px-4 py-3 text-sm ${
                  index !== filteredVendors.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-gray-900">{vendor.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={vendor.rate}
                    onChange={(e) => updateVendorRate(vendor.id, e.target.value)}
                    className="w-12 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => handleNavigation('previous')}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={() => handleNavigation('next')}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Save Changes Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-80 shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Save changes?</h3>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={cancelChanges}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionControl;