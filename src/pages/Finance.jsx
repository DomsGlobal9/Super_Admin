import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { X } from "lucide-react";
import ic1 from '../assets/compilance_icon1.png';

const FinancePage = () => {
  const payoutsData = [
    { id: "1", vendor: "Fashion forward", amount: "15000", channel: "B2B", dueDate: "Jun 24, 2024", status: "Completed", vendorEmail: "fashionforward@email.com" },
    { id: "2", vendor: "Fashion forward", amount: "15000", channel: "B2C", dueDate: "Jun 24, 2024", status: "Processing", vendorEmail: "fashionforward@email.com" },
    { id: "3", vendor: "Fashion forward", amount: "15000", channel: "B2C", dueDate: "Jun 24, 2024", status: "Failed", vendorEmail: "fashionforward@email.com" },
    { id: "4", vendor: "Fashion forward", amount: "15000", channel: "B2B", dueDate: "Jun 24, 2024", status: "Pending", vendorEmail: "fashionforward@email.com" },
  ];

  const [filter, setFilter] = useState("All");
  const [selectedPayout, setSelectedPayout] = useState(null);

  const filteredData =
    filter === "All" ? payoutsData : payoutsData.filter((p) => p.status === filter);

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

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-black bg-opacity-40" onClick={onClose}></div>
          <div className="inline-block align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      {/* Top Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your revenue and vendor payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">$40,689</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {/* <div className="w-6 h-6 bg-blue-600 rounded"></div> */}
              <img src={ic1} alt="" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">B2B Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">$68,998</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              {/* <div className="w-6 h-6 bg-green-600 rounded"></div> */}
                 <img src={ic1} alt="" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">B2C Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">$79,876</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              {/* <div className="w-6 h-6 bg-purple-600 rounded"></div> */}
                 <img src={ic1} alt="" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Payout</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">102</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              {/* <div className="w-6 h-6 bg-orange-600 rounded"></div> */}
                 <img src={ic1} alt="" />
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
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
            Weekly
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
            <p className="text-gray-500 text-sm mt-1">Manage and track vendor payments</p>
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
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">${p.amount}</td>
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
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vendor Payout Details</h3>
                <p className="text-gray-500 text-sm">Payout ID: #{selectedPayout.id}</p>
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
              <p className="text-3xl font-bold text-gray-900">${selectedPayout.amount}</p>
              <p className="text-sm text-red-600 mt-1">
                {selectedPayout.status === 'Pending' ? 'Overdue' : 'On Time'}
              </p>
            </div>

            {/* Summary Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <p className="font-medium text-gray-900">${selectedPayout.amount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Due Date</p>
                  <p className="font-medium text-gray-900">{selectedPayout.dueDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Channel</p>
                  <p className="font-medium text-gray-900">{selectedPayout.channel}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="font-medium text-gray-900">Direct Payout</p>
                </div>
              </div>
            </div>

            {/* Vendor Quick Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Vendor Quick Info</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Vendor Name</p>
                  <p className="font-medium text-gray-900">{selectedPayout.vendor}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium text-blue-600">{selectedPayout.vendorEmail}</p>
                </div>
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
                    <div className="text-gray-500 text-sm">Jun 24, 2024</div>
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
                    <div className="text-gray-500 text-sm">Jun 24, 2024</div>
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

export default FinancePage;