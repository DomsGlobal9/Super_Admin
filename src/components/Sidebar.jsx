import { Link } from "react-router-dom";
import dvyb from "../assets/dvybeLogo.png";

import {
  Home, Package, Truck, FileText, Bell, DollarSign,
  Headphones, Clipboard, Settings, LogOut
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-md flex-col justify-between">
        <div>
  <div className="flex items-center justify-center h-16 bg-[#D1DCEB] text-white font-bold text-xl">
              <img src={dvyb} className="object-contain  " alt="" />
            </div>
          <nav className="mt-4 px-4 space-y-2">
           <a
  href="/"
  onClick={() => setOpen(false)}
  className="flex items-center gap-3 p-2 rounded-lg text-gray-600 no-underline hover:bg-blue-50 "
>
  <Home size={20} />  Dashboard
</a>
            <Link to="/vendor-management" className="flex items-center gap-3 p-2  text-gray-600   rounded-lg hover:bg-blue-50">
              <Package size={20} /> Vendor Management
            </Link>
            <Link to="/uploaded-products" className="flex items-center gap-3 text-gray-600  p-2 rounded-lg hover:bg-blue-50">
              <Truck size={20} /> Uploaded Products
            </Link>
            <Link to="/logistics" className="flex items-center gap-3 p-2 text-gray-600  rounded-lg hover:bg-blue-50">
              <FileText size={20} /> Logistics
            </Link>
            <Link to="/compliance" className="flex items-center gap-3 p-2 text-gray-600  rounded-lg hover:bg-blue-50">
              <Bell size={20} /> Compliance
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 p-2 text-gray-600  rounded-lg hover:bg-blue-50">
              <DollarSign size={20} /> Notifications
            </Link>
            <Link to="/finance" className="flex items-center gap-3 text-gray-600  p-2 rounded-lg hover:bg-blue-50">
              <Headphones size={20} /> Finance
            </Link>
            <Link to="/customer-support" className="flex items-center text-gray-600  gap-3 p-2 rounded-lg hover:bg-blue-50">
              <Clipboard size={20} /> Customer Support
            </Link>
              <Link to="/inventory-health" onClick={() => setOpen(false)} className="flex items-center text-gray-600 gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Clipboard size={20} /> Inventory Health
  </Link>
    <Link to="/commision" onClick={() => setOpen(false)} className="flex items-center text-gray-600 gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Clipboard size={20} /> Commision
  </Link>
            <Link to="/settings" className="flex items-center gap-3 text-gray-600  p-2 rounded-lg hover:bg-blue-50">
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

      {/* Mobile Sidebar Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-md flex flex-col justify-between transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* <div className="flex items-center justify-center h-16 bg-blue-900 text-white font-bold text-xl"> */}
              {/* <img src={dvyb} className="object-cover h-full w-full" alt="" /> */}
            {/* </div> */}
           <nav className="mt-4 px-4 space-y-2">
  <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50">
    <Home size={20} /> Dashboard
  </Link>
  <Link to="/vendor-management" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-600 p-2 rounded-lg hover:bg-blue-50">
    <Package size={20} /> Vendor Management
  </Link>
  <Link to="/uploaded-products" onClick={() => setOpen(false)} className="flex text-gray-600 items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Truck size={20} /> Uploaded Products
  </Link>
  <Link to="/logistics" onClick={() => setOpen(false)} className="flex text-gray-600 items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
    <FileText size={20} /> Logistics
  </Link>
  <Link to="/compliance" onClick={() => setOpen(false)} className="flex text-gray-600 items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Bell size={20} /> Compliance
  </Link>
  <Link to="/notifications" onClick={() => setOpen(false)} className="flex items-center text-gray-600 gap-3 p-2 rounded-lg hover:bg-blue-50">
    <DollarSign size={20} /> Notifications
  </Link>
  <Link to="/finance" onClick={() => setOpen(false)} className="flex text-gray-600 items-center gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Headphones size={20} /> Finance
  </Link>
  <Link to="/customer-support" onClick={() => setOpen(false)} className="flex items-center text-gray-600 gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Clipboard size={20} /> Customer Support
  </Link>
  <Link to="/inventory-health" onClick={() => setOpen(false)} className="flex items-center text-gray-600 gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Clipboard size={20} /> Inventory Health
  </Link>
      <Link to="/commision" onClick={() => setOpen(false)} className="flex items-center text-gray-600 gap-3 p-2 rounded-lg hover:bg-blue-50">
    <Clipboard size={20} /> Commision
  </Link>
  <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 text-gray-600 p-2 rounded-lg hover:bg-blue-50">
    <Settings size={20} /> Settings
  </Link>
</nav>

          </div>
          <div className="p-4">
            <button className="w-full flex items-center gap-2 justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
