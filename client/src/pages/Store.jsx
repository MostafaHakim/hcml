import { Outlet } from "react-router-dom";
import Topbar from "../components/griege/Topbar";

function Store() {
  const griegeOption = ["Home", "dyes", "mechanical", "electronical"];
  return (
    <div className="w-screen h-screen flex flex-col items-start justify-start">
      <Topbar setTabOption={griegeOption} />
      <Outlet />
    </div>
  );
}

export default Store;
