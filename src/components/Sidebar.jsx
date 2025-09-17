import { Link } from "react-router-dom";
import dvyb from "../assets/dvybeLogo.png";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ic_CustomerSupport from "../assets/ic_CustomerSupport.png";
import ic_dash from "../assets/ic_dash.png";
import ic_VendorProfile from "../assets/ic_VendorProfile.png";
import ic_UploadProduct from "../assets/ic_UploadProduct.png";
import ic_logistics from "../assets/ic_logistics.png";
import ic_compilance from "../assets/ic_compilance.png";
import ic_notification from "../assets/ic_notification.png";
import ic_finance from "../assets/ic_finance.png";
import ic_Inventory from "../assets/ic_Inventory.png";
import ic_settings from "../assets/ic_settings.png";

const Sidebar = ({ open, setOpen }) => {
  
  const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('dvyb_admin_session');
    // setIsAuthenticated(false);
    // setAdminInfo(null);
    // setEmail('');
    // setPassword('');
    // setAuthError('');
    // // Reset dashboard data
    // setDashboardStats({
    //   totalRevenue: 0,
    //   totalOrders: 0,
    //   activeVendors: 0,
    //   pendingOrders: 0
    // });
    // setRevenueData([]);
    // setPieData([]);
    // setTopVendors([]);
    // setRecentAlerts([]);
    navigate('/login');
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-md flex-col justify-between">
        <div>
          <div className="flex items-center justify-center h-16 bg-[rgba(56,141,205,1)] text-white font-bold text-xl">
            <img src={dvyb} className="object-contain" alt="" />
          </div>
          <nav className="mt-4 px-4 space-y-2">
            <Link
              to="/layout/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg text-gray-600 no-underline hover:bg-blue-50"
            >
              <img src={ic_dash} className="h-5" alt="" />
              Dashboard
            </Link>
            <Link
              to="/layout/vendor-management"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_VendorProfile} className="h-5" alt="" />
              Vendor Management
            </Link>
            <Link
              to="/layout/uploaded-products"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_UploadProduct} className="h-5" alt="" />
              Uploaded Products
            </Link>
            <Link
              to="/layout/logistics"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_logistics} className="h-5" alt="" />
              Logistics
            </Link>
            <Link
              to="/layout/compliance"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_compilance} className="h-5" alt="" />
              Compliance
            </Link>
            <Link
              to="/layout/notifications"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_notification} className="h-5" alt="" />
              Notifications
            </Link>
            <Link
              to="/layout/finance"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_finance} className="h-5" alt="" />
              Finance
            </Link>
            <Link
              to="/layout/customer-support"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_CustomerSupport} className="h-5" alt="" />
              Customer Support
            </Link>
            <Link
              to="/layout/inventory-health"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_Inventory} className="h-5" alt="" />
              Inventory Health
            </Link>
            <Link
              to="/layout/commission"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_dash} className="h-5" alt="" />
              Commission
            </Link>
            <Link
              to="/layout/settings"
              className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
            >
              <img src={ic_settings} className="h-5" alt="" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
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
            <div className="flex items-center justify-center h-16 bg-[#388DCD] text-white font-bold text-xl">
              <img src={dvyb} className="object-contain" alt="" />
            </div>
            <nav className="mt-4 px-4 space-y-2">
              <Link
                to="/layout/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_dash} className="h-5" alt="" />
                Dashboard
              </Link>
              <Link
                to="/layout/vendor-management"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_VendorProfile} className="h-5" alt="" />
                Vendor Management
              </Link>
              <Link
                to="/layout/uploaded-products"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_UploadProduct} className="h-5" alt="" />
                Uploaded Products
              </Link>
              <Link
                to="/layout/logistics"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_logistics} className="h-5" alt="" />
                Logistics
              </Link>
              <Link
                to="/layout/compliance"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_compilance} className="h-5" alt="" />
                Compliance
              </Link>
              <Link
                to="/layout/notifications"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_notification} className="h-5" alt="" />
                Notifications
              </Link>
              <Link
                to="/layout/finance"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_finance} className="h-5" alt="" />
                Finance
              </Link>
              <Link
                to="/layout/customer-support"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_CustomerSupport} className="h-5" alt="" />
                Customer Support
              </Link>
              <Link
                to="/layout/inventory-health"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_Inventory} className="h-5" alt="" />
                Inventory Health
              </Link>
              <Link
                to="/layout/commission"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_dash} className="h-5" alt="" />
                Commission
              </Link>
              <Link
                to="/layout/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-2 text-gray-600 rounded-lg hover:bg-blue-50"
              >
                <img src={ic_settings} className="h-5" alt="" />
                Settings
              </Link>
            </nav>
          </div>
          <div className="p-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-2 justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;