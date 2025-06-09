import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const navigate = useNavigate(); // ✅ useNavigate must be called at top-level

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // ✅ use the navigate function
  };

  return (
    <div className="w-full flex flex-row items-center justify-between bg-gradient-to-br from-stone-900 to bg-gray-800 text-white uppercase px-20 text-sm bg-opacity-40 py-2">
      <div className="flex flex-row w-1/3 space-x-4 items-center justify-start">
        <h2>{username}</h2>
        <h5 className="text-xs">{role}</h5>
      </div>
      <ul className="w-full flex flex-row items-end justify-end space-x-4">
        <Link to="/" className="py-2 px-4 text-sm font-semibold">
          Home
        </Link>
        <Link to="/dashboard" className="py-2 px-4 text-sm font-semibold">
          Dashboard
        </Link>
        <Link to="/store" className="py-2 px-4 text-sm font-semibold">
          Store
        </Link>
        <button
          className="py-2 px-6 text-sm font-semibold ring-2 ring-gray-400 ring-inset rounded-full bg-opacity-0 uppercase"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </ul>
    </div>
  );
}

export default Navbar;
