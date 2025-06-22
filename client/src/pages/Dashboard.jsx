import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react"; // or use any icon lib you like
import Sidepanel from "../components/ui/Sidepanel";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="w-screen h-screen grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 relative">
      {/* Mobile Toggle Button */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-gray-200 rounded-md shadow"
        onClick={toggleSidebar}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64  z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:static sm:translate-x-0 sm:col-span-1 md:col-span-2
        `}
      >
        <Sidepanel closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="col-span-4 sm:col-span-3 md:col-span-4 lg:col-span-10 p-2 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
