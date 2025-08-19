import React, { useState } from 'react';
import { Search, Eye, X } from 'lucide-react';

const ProductInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusType, setStatusType] = useState('');

  const products = [
    { id: 1, name: 'Summer Floral Dress', category: 'Dresses', price: '79.99', stock: 100, status: 'Active', rating: 4.8, sales: 450, image: '👗' },
    { id: 2, name: 'Shirts', category: 'Shirts', price: '39.99', stock: 250, status: 'Disabled', rating: 4.2, sales: 780, image: '👔' },
    { id: 3, name: 'Jeans', category: 'Jeans', price: '89.99', stock: 150, status: 'Active', rating: 4.6, sales: 320, image: '👖' },
    { id: 4, name: 'Jackets', category: 'Jackets', price: '149.99', stock: 75, status: 'Low Stock', rating: 4.7, sales: 180, image: '🧥' },
    { id: 5, name: 'Skirts', category: 'Skirts', price: '59.99', stock: 120, status: 'Active', rating: 4.3, sales: 290, image: '👗' },
    { id: 6, name: 'Pants', category: 'Pants', price: '69.99', stock: 80, status: 'Active', rating: 4.1, sales: 150, image: '👖' },
    { id: 7, name: 'Blouses', category: 'Blouses', price: '54.99', stock: 180, status: 'Active', rating: 4.4, sales: 210, image: '👚' },
    { id: 8, name: 'Sweaters', category: 'Sweaters', price: '74.99', stock: 90, status: 'Active', rating: 4.5, sales: 160, image: '🧥' },
    { id: 9, name: 'Shorts', category: 'Shorts', price: '39.99', stock: 200, status: 'Active', rating: 4.2, sales: 340, image: '🩳' },
    { id: 10, name: 'T-Shirts', category: 'T-Shirts', price: '19.99', stock: 300, status: 'Active', rating: 4.0, sales: 890, image: '👕' }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Disabled':
        return 'bg-red-100 text-red-800';
      case 'Low Stock':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSuspend = () => {
    setShowProductModal(false);
    setStatusType('suspended');
    setShowStatusModal(true);
  };

  const handleDelete = () => {
    setShowProductModal(false);
    setStatusType('deleted');
    setShowStatusModal(true);
  };

  const handleStatusContinue = () => {
    setShowStatusModal(false);
    setSelectedProduct(null);
    setStatusType('');
  };

  // Status popup component
  const StatusPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center shadow-lg">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          statusType === 'suspended' ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {statusType === 'suspended' ? (
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          ) : (
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {statusType === 'suspended' ? 'Suspended' : 'Deleted'}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6">
          {statusType === 'suspended' 
            ? 'The Product has been Suspended'
            : 'The product has been Deleted'
          }
          <br />
          Shortly you will find a confirmation in your email
        </p>
        
        <button
          onClick={handleStatusContinue}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Product Inventory</h1>
            
            {/* Search Bar */}
         <div className="relative mb-6">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-12 pr-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
               placeholder-gray-400"
  />
</div>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-black text-lg py-4 px-6">Product</th>
                    <th className="text-left text-black text-lg py-4 px-6">Category</th>
                    <th className="text-left text-black text-lg py-4 px-6">Price</th>
                    <th className="text-left py-4 text-black text-lg px-6">Stock</th>
                    <th className="text-left py-4 text-black text-lg px-6">Status</th>
                    <th className="text-left py-4 text-black text-lg px-6">Rating</th>
                    <th className="text-left py-4 text-black text-lg px-6">Sales</th>
                    <th className="text-left py-4 text-black text-lg px-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 text-lg">
                          {product.image}
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{product.category}</td>
                      <td className="py-4 px-6 text-gray-900 font-medium">{product.price}</td>
                      <td className="py-4 px-6 text-gray-600">{product.stock}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{product.rating}</td>
                      <td className="py-4 px-6 text-gray-600">{product.sales}</td>
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 text-xl">
                      {product.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Eye className="w-4 h-4 mr-1" /> View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-xl mx-auto my-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-medium text-gray-900">Product Details</h2>
              <button 
                onClick={() => {
                  setShowProductModal(false);
                  setSelectedProduct(null);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>

            {/* Content with scroll */}
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=80&h=100&fit=crop&crop=top"
                    alt="Summer Floral Dress"
                    className="w-16 h-20 object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Sponsored</p>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{selectedProduct?.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">Product Code: 47065321</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Pricing</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Price</span>
                    <span className="text-gray-900 font-medium">79.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Actual Cost</span>
                    <span className="text-gray-900 font-medium">49.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Margin</span>
                    <span className="text-gray-900 font-medium">37.5%</span>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Attributes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-900">Dresses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Brand</span>
                    <span className="text-gray-900">Chic Threads</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Color</span>
                    <span className="text-gray-900">Multicolor</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Material</span>
                    <span className="text-gray-900">Cotton Blend</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Description</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The Summer Floral Dress is perfect for any occasion. Made from a lightweight cotton blend, it features a
                  vibrant floral pattern and a flattering silhouette. Available in sizes S, M, and L.
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleSuspend}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-yellow-600 transition-colors"
                >
                  Suspend Product
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && <StatusPopup />}
    </div>
  );
};

export default ProductInventory;
