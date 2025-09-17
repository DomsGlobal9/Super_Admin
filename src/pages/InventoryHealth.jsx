// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
// import {Eye, Download, Filter } from 'lucide-react';
// import { healthStats, statusData, products, fastMovingItems, deadStockItems, getStatusColor} from '../Data/InventoryDashboard';

// const InventoryDashboard = () => {
//   const [selectedTab, setSelectedTab] = useState('products');

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
      
      // {/* Inventory Health Cards */}
      // <div className="mb-8">
      //   <div className="mb-4">
      //     <h2 className="text-xl font-bold text-gray-900">Inventory Health</h2>
      //     <p className="text-sm text-gray-600">Monitor stock levels and identify optimization opportunities</p>
      //   </div>
        
      //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      //     {healthStats.map((stat, index) => {
      //       const IconComponent = stat.icon;
      //       return (
      //         <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      //           <div className="flex items-center justify-between mb-4">
      //             <div className={`p-3 rounded-lg ${stat.color}`}>
      //               <IconComponent className="w-6 h-6 text-white" />
      //             </div>
      //           </div>
      //           <div>
      //             <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
      //             <p className="text-sm text-gray-600">{stat.title}</p>
      //           </div>
      //         </div>
      //       );
      //     })}
      //   </div>
      // </div>

      // {/* Inventory Status Chart */}
      // <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      //   <h3 className="text-lg font-semibold text-gray-900 mb-6">Inventory status</h3>
      //   <div className="h-80">
      //     <ResponsiveContainer width="100%" height="100%">
      //       <LineChart data={statusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      //         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      //         <XAxis dataKey="month" tick={{ fontSize: 12 }} />
      //         <YAxis tick={{ fontSize: 12 }} />
      //         <Line 
      //           type="monotone" 
      //           dataKey="inStock" 
      //           stroke="#10B981" 
      //           strokeWidth={3}
      //           dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
      //         />
      //         <Line 
      //           type="monotone" 
      //           dataKey="lowStock" 
      //           stroke="#F59E0B" 
      //           strokeWidth={3}
      //           dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
      //         />
      //         <Line 
      //           type="monotone" 
      //           dataKey="outOfStock" 
      //           stroke="#EF4444" 
      //           strokeWidth={3}
      //           dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
      //         />
      //       </LineChart>
      //     </ResponsiveContainer>
      //   </div>
      //   <div className="flex items-center justify-center space-x-8 mt-4">
      //     <div className="flex items-center">
      //       <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
      //       <span className="text-sm text-gray-600">In stock</span>
      //     </div>
      //     <div className="flex items-center">
      //       <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
      //       <span className="text-sm text-gray-600">Low Stock</span>
      //     </div>
      //     <div className="flex items-center">
      //       <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
      //       <span className="text-sm text-gray-600">Out of stock</span>
      //     </div>
      //   </div>
      // </div>

      // {/* Tab Navigation */}
      // <div className="mb-6">
      //   <div className="border-b border-gray-200">
      //     <nav className="-mb-px flex space-x-8">
      //       {['products', 'fastMoving', 'deadStock'].map((tab) => (
      //         <button
      //           key={tab}
      //           onClick={() => setSelectedTab(tab)}
      //           className={`py-2 px-1 border-b-2 font-medium text-sm ${
      //             selectedTab === tab
      //               ? 'border-blue-500 text-blue-600'
      //               : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      //           }`}
      //         >
      //           {tab === 'products' && 'Products'}
      //           {tab === 'fastMoving' && 'Fast Moving Items'}
      //           {tab === 'deadStock' && 'Dead Stock Analysis'}
      //         </button>
      //       ))}
      //     </nav>
      //   </div>
      // </div>

//       {/* Products Table */}
//       {selectedTab === 'products' && (
//         <div className="bg-white rounded-lg shadow-sm">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between sm:flex-row sm:items-center sm:justify-between ">
//               <h3 className="text-lg font-semibold text-gray-900">Products</h3>
//               <div className="flex items-center space-x-3">
//                 <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
//                   <Filter className="w-4 h-4 mr-2" />
//                   Filter by
//                 </button>
//                 <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
//                   <Download className="w-4 h-4 mr-2" />
//                   Download all
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing Price</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current stock</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {products.map((product, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.vendor}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
//                         {product.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

     
//     </div>
//   );
// };

// export default InventoryDashboard;

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Eye, Download, Filter } from 'lucide-react';
import { 
  healthStats, 
  statusData, 
  products, 
  fastMovingItems, 
  deadStockItems, 
  getStatusColor 
} from '../Data/InventoryDashboard';

const InventoryDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('products');
  const [statusFilter, setStatusFilter] = useState('All'); // 👈 New state
  const [filterOpen, setFilterOpen] = useState(false); // 👈 Dropdown toggle

  // ✅ Filter products based on status
  const filteredProducts = products.filter((p) => {
    if (statusFilter === 'All') return true;
    return p.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ... your other sections ... */}
            {/* Inventory Health Cards */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Inventory Health</h2>
          <p className="text-sm text-gray-600">Monitor stock levels and identify optimization opportunities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventory Status Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Inventory status</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey="inStock" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="lowStock" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="outOfStock" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-8 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">In stock</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Low Stock</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Out of stock</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['products', 'fastMoving', 'deadStock'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'products' && 'Products'}
                {tab === 'fastMoving' && 'Fast Moving Items'}
                {tab === 'deadStock' && 'Dead Stock Analysis'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Products Table */}
      {selectedTab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <div className="flex items-center gap-3">
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {statusFilter === 'All' ? 'Filter by' : statusFilter}
                  </button>
                  {filterOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        {['All', 'In stock', 'Low Stock', 'Out of stock'].map((option) => (
                          <li
                            key={option}
                            onClick={() => {
                              setStatusFilter(option);
                              setFilterOpen(false);
                            }}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Download button */}
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Download all
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ... fastMoving & deadStock remain unchanged ... */}
       {/* Fast Moving Items */}
      {selectedTab === 'fastMoving' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Fast Moving Items</h3>
            <p className="text-sm text-gray-600 mt-1">Products with high sales velocity requiring frequent restocking</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fastMovingItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.soldUnits}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4 mr-1" />
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

      {/* Dead Stock Analysis */}
      {selectedTab === 'deadStock' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dead Stock Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Items with low or no sales activity</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days stagnant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deadStockItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.daysStagnant}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stockUnits}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4 mr-1" />
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
};

export default InventoryDashboard;



