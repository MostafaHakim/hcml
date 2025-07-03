import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidepanel from "../components/ui/Sidepanel";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar for large screens */}
      <div className="hidden sm:block w-64 h-full border-r shadow-md">
        <Sidepanel />
      </div>

      {/* Sidebar for small screens (drawer style) */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidepanel closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Toggle Button for mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-gray-200 rounded-md shadow"
        onClick={toggleSidebar}
      >
        <Menu />
      </button>

      {/* Main Content */}
      <div className="flex-1 p-2 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
