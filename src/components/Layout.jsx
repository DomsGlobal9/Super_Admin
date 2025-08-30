import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [open, setOpen] = useState(false); // central sidebar state

  return (
    <div className="flex h-full md:h-[850px] overflow-x-scroll scrollbar-none  overflow-y-scroll scrollbar-none  w-screen  overflow-hidden">
      {/* Sidebar (gets open + setOpen) */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full bg-gray-50">
        <Navbar toggleSidebar={() => setOpen(!open)} />
        <main className="flex-1 w-full h-full overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
