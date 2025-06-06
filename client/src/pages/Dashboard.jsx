import { Outlet } from "react-router-dom";
import Sidepanel from "../components/ui/Sidepanel";

function Dashboard() {
  return (
    <div className="w-screen h-screen grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
      <div className="col-span-2">
        <Sidepanel />
      </div>
      <div className="col-span-2 md:col-span-4 lg:col-span-10">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
