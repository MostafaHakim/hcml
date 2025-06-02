import { NavLink, Outlet } from "react-router-dom";
import Topbar from "../components/griege/Topbar";

function Griege() {
  const griegeOption = ["griegein", "griegeout"];
  return (
    <div className="w-screen h-screen flex flex-col items-start justify-start">
      <NavLink to="/">Home</NavLink>
      <Topbar setTabOption={griegeOption} />
      <Outlet />
    </div>
  );
}

export default Griege;
