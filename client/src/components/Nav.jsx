import { Link, useNavigate } from "react-router-dom";
import { FcFactoryBreakdown } from "react-icons/fc";
import { GiRolledCloth } from "react-icons/gi";
import { GiPowderBag } from "react-icons/gi";
import { RiAdminFill, RiLogoutCircleLine } from "react-icons/ri";

function Nav() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full">
      <ul className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-white text-xs font-semibold">
        <Link
          to="dashboard"
          className="w-20 h-20  ring-2 ring-sky-700 hover:ring-rose-500 flex flex-col items-center justify-between shadow-md bg-[#0a3d62] bg-opacity-60 p-1 rounded-md hover:w-24 hover:h-24 transition-all duration-300 hover:"
        >
          <FcFactoryBreakdown className="w-36 h-36 group-hover:w-40 group-hover:h-40" />
          <h2>DASHBOAD</h2>
        </Link>
        <Link
          to="griege"
          className="w-20 h-20  ring-2 ring-sky-700 hover:ring-rose-500 flex flex-col items-center justify-between shadow-md bg-[#0a3d62] bg-opacity-60 p-1 rounded-md hover:w-24 hover:h-24 transition-all duration-300 hover:"
        >
          <GiRolledCloth className="w-36 h-36 group-hover:w-40 group-hover:h-40 text-violet-800" />
          <h2>GRIEGE</h2>
        </Link>
        <Link
          to="store"
          className="w-20 h-20  ring-2 ring-sky-700 hover:ring-rose-500 flex flex-col items-center justify-between shadow-md bg-[#0a3d62] bg-opacity-60 p-1 rounded-md hover:w-24 hover:h-24 transition-all duration-300 hover:"
        >
          <GiPowderBag className="w-36 h-36 group-hover:w-40 group-hover:h-40 text-lime-600" />
          <h2>STORE</h2>
        </Link>
        <Link
          to="admin"
          className="w-20 h-20  ring-2 ring-sky-700 hover:ring-rose-500 flex flex-col items-center justify-between shadow-md bg-[#0a3d62] bg-opacity-60 p-1 rounded-md hover:w-24 hover:h-24 transition-all duration-300 hover:"
        >
          <RiAdminFill className="w-36 h-36 group-hover:w-40 group-hover:h-40 text-sky-500" />
          <h2>ADMIN</h2>
        </Link>
        <button
          onClick={handleLogout}
          className="w-20 h-20  ring-2 ring-sky-700 hover:ring-rose-500 flex flex-col items-center justify-between shadow-md bg-[#0a3d62] bg-opacity-60 p-1 rounded-md hover:w-24 hover:h-24 transition-all duration-300 hover:"
        >
          <RiLogoutCircleLine className="w-36 h-36 group-hover:w-40 group-hover:h-40 text-sky-500" />
          <h2>LOG OUT</h2>
        </button>
      </ul>
    </div>
  );
}

export default Nav;
