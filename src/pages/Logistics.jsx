// import React from "react";

// function Logistics() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Logistics</h2>
//     </div>
//   );
// }

// export default Logistics;


import React, { useState } from 'react';
import { CheckCircle, Truck, Clock, AlertCircle, Package, Filter, ChevronDown } from 'lucide-react';

const Logistics = () => {
  const [filterBy, setFilterBy] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const shipments = [
    {
      id: 'SHIP-001',
      value: '₹79,623.00',
      route: 'Hyderabad',
      estDelivery: '12/07/2025',
      rating: 4.8,
      status: 'Active',
      statusColor: 'green'
    },
    {
      id: 'SHIP-001',
      value: '0',
      route: 'Chennai',
      estDelivery: '12/07/2025',
      rating: 4.8,
      status: 'Pending',
      statusColor: 'orange'
    },
    {
      id: 'SHIP-001',
      value: '₹1,423.53',
      route: 'Visakhapatnam',
      estDelivery: '12/07/2025',
      rating: 3.2,
      status: 'Declined',
      statusColor: 'red'
    },
    {
      id: 'SHIP-001',
      value: '₹56,623.00',
      route: 'Gujarat',
      estDelivery: '12/07/2025',
      rating: 4.8,
      status: 'Active',
      statusColor: 'green'
    },
    {
      id: 'SHIP-001',
      value: '₹150.00',
      route: 'Hyderabad',
      estDelivery: '12/07/2025',
      rating: 4.5,
      status: 'Pending',
      statusColor: 'orange'
    }
  ];

  const couriers = [
    {
      name: 'Fedex',
      rating: 4.8,
      phone: '97867-76656',
      activeShipments: 23,
      avgDelivery: '2 days'
    },
    {
      name: 'DHL',
      rating: 4.2,
      phone: '97867-76656',
      activeShipments: 21,
      avgDelivery: '3 days'
    },
    {
      name: 'DTDC',
      rating: 4.0,
      phone: '97867-76656',
      activeShipments: 26,
      avgDelivery: '2 days'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'Pending':
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      case 'Declined':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className=" p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Logistics Management</h2>
          <p className="text-gray-600">Track shipments and manage courier partnerships</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600 font-medium">Active Shipment</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">40,689</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600 font-medium">In-Transit</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">689</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600 font-medium">On-Time Rate</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">92.8%</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-600 font-medium">Delayed</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">10293</div>
          </div>
        </div>

        {/* Active Shipments Table */}
        <div className="">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Active Shipments</h2>
                <p className="text-gray-600">Real-time tracking of all shipments</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter By</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      {['All', 'Active', 'Pending', 'Declined'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterBy(option);
                            setFilterOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ratings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className=" ">
                {shipments
                  .filter(shipment => filterBy === 'All' || shipment.status === filterBy)
                  .map((shipment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.estDelivery}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">{getRatingStars(shipment.rating)}</span>
                        <span className="ml-1">{shipment.rating}★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(shipment.status)}
                        <span className={`text-sm font-medium ${
                          shipment.status === 'Active' ? 'text-green-600' :
                          shipment.status === 'Pending' ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {shipment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courier Partners */}
        <div className="bg-white rounded-lg ">
          <div className="p-6 ">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Courier Partners</h2>
            <p className="text-gray-600">Performance metrics and contact information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {couriers.map((courier, index) => (
                <div key={index} className=" rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-blue-600">{courier.name}</h3>
                    <div className="flex items-center space-x-1">
                      
                      <span className="text-yellow-400">{getRatingStars(courier.rating)}</span>
                      <span className="ml-1 text-sm text-gray-600">{courier.rating}★</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-medium">Ph: {courier.phone}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Active shipments</span>
                        <div className="font-bold text-gray-900">{courier.activeShipments}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Delivery</span>
                        <div className="font-bold text-gray-900">{courier.avgDelivery}</div>
                      </div>
                    </div>
                    
                    {/* Rating Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-600 h-2 rounded-full" 
                        style={{ width: `${(courier.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logistics;