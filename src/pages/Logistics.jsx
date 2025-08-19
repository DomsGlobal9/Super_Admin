import React, { useState } from 'react';
import { CheckCircle, Truck, Clock, AlertCircle, Package, Filter, ChevronDown, X, MapPin } from 'lucide-react';

const ShipmentTrackingModal = ({ selectedShipment, onClose }) => {
  // Tracking events data (you can customize this based on your needs)
  const trackingEvents = [
    {
      type: "order_placed",
      title: "Order Placed",
      timestamp: "14th April 2025, 04:25 PM",
      isCompleted: true,
      icon: Package
    },
    {
      type: "order_confirmed",
      title: "Order Confirmed",
      timestamp: "15th April 2025, 08:30 AM",
      isCompleted: true,
      icon: CheckCircle
    },
    {
      type: "shipping",
      title: "Shipping",
      timestamp: "17th April 2025, 10:30 AM",
      isCompleted: true,
      icon: Truck
    },
    {
      type: "dispatched",
      title: "Dispatched",
      timestamp: "20th April 2025, 08:30 AM",
      isCompleted: true,
      icon: MapPin
    },
    {
      type: "delivered",
      title: "Delivered",
      timestamp: "20th April 2025, 08:30 AM",
      isCompleted: false,
      icon: CheckCircle
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Shipment Details - {selectedShipment.id}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Created: July 13, 2025, 04:25 PM
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Shipment Details */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="space-y-2">
              <DetailItem label="Courier:" value={selectedShipment.courier} />
              <DetailItem label="Tracking ID:" value={selectedShipment.trackingId} />
              <DetailItem label="Items:" value={selectedShipment.items} />
              <DetailItem label="Weight:" value={selectedShipment.weight} />
              <DetailItem label="Value:" value={selectedShipment.value} />
            </div>
            <div className="space-y-2">
              <DetailItem label="Origin:" value={selectedShipment.origin} />
              <DetailItem label="Destination:" value={selectedShipment.destination} />
              <DetailItem label="ETA:" value={selectedShipment.eta} />
              <div className="pl-12">
                <span className="text-sm text-gray-900 font-medium">
                  04:00pm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="px-6 pb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Tracking Timeline
          </h3>
          
          <div className="space-y-4">
            {trackingEvents.map((event, index) => {
              const IconComponent = event.icon;
              return (
                <div key={index} className="flex items-start">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center mr-4">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${event.isCompleted 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200'
                      }
                    `}>
                      <IconComponent className={`w-4 h-4 ${event.isCompleted ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    {index < trackingEvents.length - 1 && (
                      <div className={`
                        w-0.5 h-8 mt-2
                        ${event.isCompleted ? 'bg-blue-500' : 'bg-gray-200'}
                      `} />
                    )}
                  </div>
                  
                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <p className={`
                      text-sm font-medium
                      ${event.isCompleted ? 'text-gray-900' : 'text-gray-500'}
                    `}>
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex">
    <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
    <span className="text-sm text-gray-900 font-medium">{value}</span>
  </div>
);

const Logistics = () => {
  const [filterBy, setFilterBy] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [trackingModal, setTrackingModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const shipments = [
    {
      id: 'SHIP-001',
      value: '₹79,623.00',
      route: 'Hyderabad',
      estDelivery: '12/07/2025',
      rating: 4.8,
      status: 'Active',
      statusColor: 'green',
      courier: 'Blue Dart',
      trackingId: 'BD2345',
      origin: 'Mumbai MH',
      destination: 'Hyderabad',
      eta: '20-07-25',
      weight: '5 kg',
      items: '4'
    },
    {
      id: 'SHIP-002',
      value: '0',
      route: 'Chennai',
      estDelivery: '12/07/2025',
      rating: 4.8,
      status: 'Pending',
      statusColor: 'orange',
      courier: 'DHL',
      trackingId: 'DH1234',
      origin: 'Delhi DL',
      destination: 'Chennai',
      eta: '22-07-25',
      weight: '2 kg',
      items: '2'
    },
    {
      id: 'SHIP-003',
      value: '₹1,423.53',
      route: 'Visakhapatnam',
      estDelivery: '12/07/2025',
      rating: 3.2,
      status: 'Declined',
      statusColor: 'red',
      courier: 'DTDC',
      trackingId: 'DT5678',
      origin: 'Pune MH',
      destination: 'Visakhapatnam',
      eta: '25-07-25',
      weight: '1 kg',
      items: '1'
    },
    {
      id: 'SHIP-004',
      value: '₹56,623.00',
      route: 'Gujarat',
      estDelivery: '12/07/2025',
      rating: 4.8,
      status: 'Active',
      statusColor: 'green',
      courier: 'Fedex',
      trackingId: 'FX9876',
      origin: 'Bangalore KA',
      destination: 'Gujarat',
      eta: '18-07-25',
      weight: '8 kg',
      items: '6'
    },
    {
      id: 'SHIP-005',
      value: '₹150.00',
      route: 'Hyderabad',
      estDelivery: '12/07/2025',
      rating: 4.5,
      status: 'Pending',
      statusColor: 'orange',
      courier: 'Blue Dart',
      trackingId: 'BD3456',
      origin: 'Chennai TN',
      destination: 'Hyderabad',
      eta: '21-07-25',
      weight: '0.5 kg',
      items: '1'
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

  const handleTrackClick = (shipment) => {
    setSelectedShipment(shipment);
    setTrackingModal(true);
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
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
              <tbody className="bg-white divide-y divide-gray-200">
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
                      <button 
                        onClick={() => handleTrackClick(shipment)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
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
                <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
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

      {/* Tracking Modal */}
      {trackingModal && selectedShipment && (
        <ShipmentTrackingModal
          selectedShipment={selectedShipment}
          onClose={() => {
            setTrackingModal(false);
            setSelectedShipment(null);
          }}
        />
      )}
    </div>
  );
};

export default Logistics;