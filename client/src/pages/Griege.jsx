import { NavLink, Outlet } from "react-router-dom";
import Topbar from "../components/griege/Topbar";
import PageWrapper from "../components/ui/PageWrapper";

function Griege() {
  const griegeOption = ["Home", "griegein", "griegeout"];
  return (
    <PageWrapper>
      <div className="w-screen h-screen flex flex-col items-start justify-start">
        <Topbar setTabOption={griegeOption} />
        <Outlet />
      </div>
    </PageWrapper>
  );
}

export default Griege;
