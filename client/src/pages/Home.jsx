import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/Nav";

function Home() {
  const location = useLocation();
  const showLocation = location.pathname === "/home";

  return (
    <div className="w-screen h-screen  flex flex-col items-start justify-center ">
      {showLocation ? <Nav /> : <Outlet />}
    </div>
  );
}

export default Home;
