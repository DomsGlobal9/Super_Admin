import { Bell } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-white border-b shadow-sm flex items-center justify-between px-6 py-3">
      {/* Search */}
      <div className="flex items-center border rounded-lg px-3 py-2 w-80">
        <span className="text-gray-400 mr-2">🔍</span>
        <input
          type="text"
          placeholder="Search vendors.com"
          className="flex-1 outline-none text-sm text-gray-600"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="text-gray-600" size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            6
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-sm">Moni Roy</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
