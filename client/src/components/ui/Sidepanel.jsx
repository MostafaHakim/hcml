import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { X } from "lucide-react";

function Sidepanel({ closeSidebar }) {
  const [panelItem, setPanelItem] = useState([
    {
      panelName: "Griege",
      menuItem: ["received", "delivery"],
      path: "griege",
    },
    {
      panelName: "Dyes",
      menuItem: ["stock", "demand", "purchase"],
      path: "dyes",
    },
    {
      panelName: "Delivery",
      menuItem: ["mark", "delivary", "pakinglist", "calan"],
      path: "delivery",
    },
    {
      panelName: "Party",
      menuItem: ["allparty"],
      path: "party",
    },
    {
      panelName: "Master",
      menuItem: ["allmaster"],
      path: "master",
    },
  ]);
  return (
    <div className="w-full shadow-lg shadow-black  p-4 space-y-4">
      <div className="sm:hidden flex justify-end">
        <button onClick={closeSidebar} className="p-2">
          <X />
        </button>
      </div>
      <Link
        to="/"
        className="px-6 py-2 ring-2 ring-white ring-inset rounded-tl-full rounded-br-full bg-blue-600 font-serif text-white "
      >
        HCML
      </Link>
      {panelItem.map((element, i) => {
        return (
          <div
            className="bg-white bg-opacity-30 border-[1px] border-white shadow-md rounded-md text-black px-1 py-2"
            key={i}
          >
            <h2 className="uppercase text-sm font-semibold">
              {element.panelName}
            </h2>
            <ul className="flex flex-col items-start text-xs uppercase space-y-1">
              {element.menuItem.map((item, i) => {
                return (
                  <NavLink
                    key={i}
                    to={`${element.path}/${item}`}
                    className="hover:bg-white bg-white bg-opacity-50 w-full text-start px-2 py-1 rounded-md "
                  >
                    {item}
                  </NavLink>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default Sidepanel;
