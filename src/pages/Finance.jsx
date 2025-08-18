import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const chartData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"],
    datasets: [
      { label: "Digi warehouse", data: [40000, 50000, 30000, 45000, 60000, 50000, 30000, 40000, 45000, 30000], backgroundColor: "#38bdf8" },
      { label: "B2C", data: [30000, 40000, 25000, 35000, 45000, 40000, 25000, 30000, 35000, 25000], backgroundColor: "#3b82f6" },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4">
      {/* Top Title */}
      <h2 className="text-lg text-3xl font-bold mb-4">Finance Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Total revenue</p>
          <p className="text-lg font-bold pt-5">40,689</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">B2B revenue</p>
          <p className="text-lg font-bold pt-5">68,998</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">B2C revenue</p>
          <p className="text-lg font-bold pt-5">79,876</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Pending Payout</p>
          <p className="text-lg font-bold pt-5">102</p>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">Revenue Analysis</h2>
          <button className="text-xs px-2 py-1 border rounded-lg">Weekly</button>
        </div>
        <Bar data={chartData} />
      </div>

      {/* Vendor Payouts */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">Vendor Payouts</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 py-1 bg-white rounded-lg text-sm"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
            <option>Pending</option>
          </select>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-600">
              <th className="p-2.5">Vendor</th>
              <th className="p-2.5">Amount</th>
              <th className="p-2.5">Channel</th>
              <th className="p-2.5">Due Date</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((p) => (
              <tr key={p.id}>
                <td className="p-2.5">{p.vendor}</td>
                <td className="p-2.5">${p.amount}</td>
                <td className="p-2.5">{p.channel}</td>
                <td className="p-2.5">{p.dueDate}</td>
                <td className="p-2.5">
                  {p.status === "Completed" && <span className="text-green-600 font-medium">Completed</span>}
                  {p.status === "Processing" && <span className="text-blue-600 font-medium">Processing</span>}
                  {p.status === "Failed" && <span className="text-red-600 font-medium">Failed</span>}
                  {p.status === "Pending" && <span className="text-yellow-600 font-medium">Pending</span>}
                </td>
                <td className="p-2.5">
                  <button
                    onClick={() => setSelectedPayout(p)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Updated Modal */}
      <Dialog open={!!selectedPayout} onClose={() => setSelectedPayout(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl w-[56vw] max-h-[85vh]  overflow-y-auto p-5 relative" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <button
              onClick={() => setSelectedPayout(null)}
              className="absolute top-3 right-3 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 text-xs"
            >
              ✕
            </button>
            
            {selectedPayout && (
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <Dialog.Title className="text-base font-semibold text-gray-900">Vendor Payout Details</Dialog.Title>
                  <p className="text-gray-500 text-xs">Payout ID: #{selectedPayout.id}</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Pending</span>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xl font-bold text-gray-900">${selectedPayout.amount}</p>
                  <p className="text-xs text-gray-500">Overdue</p>
                </div>

                {/* Summary Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium">${selectedPayout.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{selectedPayout.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Channel</p>
                      <p className="font-medium">{selectedPayout.channel}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">Direct Payout</p>
                    </div>
                  </div>
                </div>

                {/* Vendor Quick Info */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Vendor Quick Info</h3>
                  <div className="text-xs space-y-1">
                    <div>
                      <p className="text-gray-500">Vendor Name</p>
                      <p className="font-medium">{selectedPayout.vendor}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-blue-600">{selectedPayout.vendorEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Payment Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="withheld" 
                        name="payment-status" 
                        className="w-3 h-3 text-blue-600"
                        defaultChecked={selectedPayout.status === "Pending"}
                      />
                      <label htmlFor="withheld" className="text-xs">
                        <div className="font-medium">Payout Withheld</div>
                        <div className="text-gray-500">{selectedPayout.dueDate}</div>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="processing" 
                        name="payment-status" 
                        className="w-3 h-3 text-blue-600"
                        defaultChecked={selectedPayout.status === "Processing"}
                      />
                      <label htmlFor="processing" className="text-xs">
                        <div className="font-medium">Payment Processing</div>
                        <div className="text-gray-500">Jun 24, 2024</div>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id="completed" 
                        name="payment-status" 
                        className="w-3 h-3 text-blue-600"
                        defaultChecked={selectedPayout.status === "Completed"}
                      />
                      <label htmlFor="completed" className="text-xs">
                        <div className="font-medium">Payment Completed</div>
                        <div className="text-gray-500">Jun 24, 2024</div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default FinancePage;