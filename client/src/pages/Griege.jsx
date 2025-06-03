import { NavLink, Outlet } from "react-router-dom";
import Topbar from "../components/griege/Topbar";

function Griege() {
  const griegeOption = ["Home", "griegein", "griegeout"];
  return (
    <div className="w-screen h-screen flex flex-col items-start justify-start">
      <Topbar setTabOption={griegeOption} />
      <Outlet />
    </div>
  );
}

export default Griege;
