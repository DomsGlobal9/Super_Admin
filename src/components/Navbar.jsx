import { Bell, Menu } from "lucide-react";
import dvyb from "../assets/dvybeLogo.png";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {

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
    <header className="bg-white   shadow-sm  flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          className="lg:hidden text-gray-700"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

      
      </div>
 <img src={dvyb} className="block lg:hidden" alt="" />
      {/* Right side (notifications + profile) */}
      <div className="flex items-center gap-6">

          {/* Search bar */}
        <div className="hidden sm:flex items-center border border-black   w-72 rounded-lg px-3 py-2  ">
          {/* <span className="text-gray-400 mr-2">🔍</span> */}
          <input
            type="text"
            placeholder="Search "
            className="flex-1 outline-none placeholder-black px-6 text-sm text-black"
          />
        </div>
        <div className="relative cursor-pointer">
            
          {/* <button  className="bg-red-600 rounded-lg"               >logout</button> */}
          <Bell className="text-gray-600" size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            6
          </span>
        </div>
        {/* <div> <button onClick={handleLogout} className="w-full flex items-center gap-2 justify-center bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
              <LogOut size={20} /> Logout
            </button></div> */}
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/40" alt="profile" className="w-10 h-10 rounded-full" />
          <div className="hidden sm:block">
            {/* <p className="font-medium text-sm">Moni Roy</p> */}
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
