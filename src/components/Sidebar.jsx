import { Link } from "react-router-dom";
import { Home, Package, Truck, FileText, Bell, DollarSign, Headphones, Clipboard, Settings, LogOut, Users } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center h-16 bg-blue-900 text-white font-bold text-xl">
          DVYB
        </div>

        <nav className="mt-4 px-4 space-y-2">
        <Link 
  to="/" 
  className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-900"
>
  <Home size={20} /> Dashboard
</Link>
 
          <Link to="/vendor-management" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <Users size={20} /> Vendor Management
          </Link>
          <Link to="/uploaded-products" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <Package size={20} /> Uploaded Products
          </Link>
          <Link to="/logistics" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <Truck size={20} /> Logistics
          </Link>
          <Link to="/compliance" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <FileText size={20} /> Compliance
          </Link>
          <Link to="/notifications" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <Bell size={20} /> Notifications
          </Link>
          <Link to="/finance" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <DollarSign size={20} /> Finance
          </Link>
          <Link to="/customer-support" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <Headphones size={20} /> Customer Support
          </Link>
          <Link to="/inventory-health" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <Clipboard size={20} /> Inventory Health
          </Link>
          <Link to="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </div>

      <div className="p-4">
        <button className="w-full flex items-center gap-2 justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
