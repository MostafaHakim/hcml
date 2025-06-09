import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useEffect } from "react";

function Home() {
  const location = useLocation();
  const showLocation = location.pathname === "/admin";

  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="w-screen h-screen  flex flex-col items-center justify-between p-8">
      <div className="w-full flex flex-row items-center justify-end space-x-2">
        <h2 className="text-lg font-sans font-bold">{username}</h2>
        <h3 className="text-xs text-white bg-rose-500 px-2 py-[2px] rounded-full ring-1 ring-stone-400 ring-inset">
          {role}
        </h3>
      </div>
      {showLocation ? <Nav /> : <Outlet />}
      <div></div>
    </div>
  );
}

export default Home;
