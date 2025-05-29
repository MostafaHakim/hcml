import Topbar from "../griege/Topbar";
import { Outlet } from "react-router-dom";

function Dyes() {
  const griegeOption = ["demand", "purchase"];
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Topbar setTabOption={griegeOption} />
      <Outlet />
    </div>
  );
}

export default Dyes;
