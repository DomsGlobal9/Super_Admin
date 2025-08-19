import { useState } from "react";
import { X, User, Package, DollarSign, AlertTriangle, Clock, Trash2 } from "lucide-react";


const vendorsData = [
  {
    id: 1,
    name: "Fashion Forward Ltd",
    email: "contact@fashionforward.com",
    revenue: "19,623.00",
    orders: 4242,
    rating: "4.8★",
    status: "Active",
    phone: "+1 (555) 123-4567",
    location: "123 Main Street, Anytown, USA",
    products: 120,
  },
  {
    id: 2,
    name: "Style Trends Inc",
    email: "support@styletrends.com",
    revenue: "15,210.00",
    orders: 3121,
    rating: "4.5★",
    status: "Pending",
    phone: "+1 (555) 234-5678",
    location: "456 Market Street, Cityville, USA",
    products: 80,
  },
  {
    id: 3,
    name: "Urban Wear Co",
    email: "hello@urbanwear.com",
    revenue: "8,765.00",
    orders: 1980,
    rating: "4.2★",
    status: "Declined",
    phone: "+1 (555) 345-6789",
    location: "789 High Street, Metropolis, USA",
    products: 50,
  },
];

export default function VendorManagement() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);

  const filteredVendors = vendorsData.filter((vendor) => {
    const matchesFilter = filter === "All" || vendor.status === filter;
    const matchesSearch = vendor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRemoveClick = () => {
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = () => {
    setShowRemoveConfirm(false);
    setSelectedVendor(null);
    setShowRemoveSuccess(true);
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirm(false);
  };

  const handleSuccessContinue = () => {
    setShowRemoveSuccess(false);
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen min-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Vendor management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white text-black px-4 py-2 w-full sm:w-64 rounded-lg border"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white text-black rounded-lg px-4 py-2 border w-full sm:w-auto"
          >
            <option value="All">Filter by</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="p-3 sm:p-6 bg-white min-h-screen min-w-full">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-700">
              <tr>
                <th className="px-6 py-3">S.No</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Revenue</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor, index) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-blue-50 transition text-gray-700"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-5 py-3">{vendor.name}</td>
                    <td className="px-6 py-3">{vendor.email}</td>
                    <td className="px-6 py-3">{vendor.revenue}</td>
                    <td className="px-6 py-3">{vendor.orders}</td>
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
                        className="text-blue-600 text-xs hover:underline"
                      >
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
            filteredVendors.map((vendor, index) => (
              <div
                key={vendor.id}
                className="bg-white rounded-lg p-4 shadow-sm border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{vendor.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{vendor.email}</p>
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
                    <div className="font-medium text-gray-900">{vendor.revenue}</div>
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
                    <div className="font-medium text-gray-900">{vendor.products}</div>
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
      {selectedVendor && !showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center  overflow-y-auto hide-scrollbar p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto overflow-y-auto hide-scrollbar shadow-xl mx-4">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 sm:p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Vendor Details
              </h3>
              <button
                onClick={() => setSelectedVendor(null)}
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
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{selectedVendor.revenue}</p>
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
                    Rating
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">{selectedVendor.rating}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
              <button 
  className="w-full text-white px-4 py-3 rounded-lg font-medium transition-colors"
  onClick={() => navigate("")}
  style={{ backgroundColor: "#2563eb" }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
>
<a href="./product-inventory"> View Products ({selectedVendor.products})</a>  
</button>

                <button 
                  onClick={handleRemoveClick}
                  className="w-full text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  style={{backgroundColor: '#dc2626'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  Remove Vendor
                </button>
              </div>
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
                  <span className="text-sm font-medium text-gray-900">{selectedVendor?.revenue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">12 Pending Orders</span>
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
              The vendor has been Removed.<br />
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