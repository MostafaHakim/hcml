import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useEffect } from "react";

function Home() {
  const location = useLocation();
  const showLocation = location.pathname === "/admin";

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="w-screen h-screen  flex flex-col items-start justify-center ">
      {showLocation ? <Nav /> : <Outlet />}
    </div>
  );
}

export default Home;
