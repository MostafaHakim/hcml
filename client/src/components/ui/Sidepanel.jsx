import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Sidepanel() {
  const [panelItem, setPanelItem] = useState([
    {
      panelName: "Griege",
      menuItem: ["received", "delivery"],
      path: "griege",
    },
    { panelName: "Dyes", menuItem: ["demand", "purchase"], path: "dyes" },
  ]);
  return (
    <div className="w-full border-r-[1px] border-violet-300 h-screen p-4 space-y-2">
      <h2>Side Plane</h2>
      {panelItem.map((element) => {
        return (
          <div className="bg-white bg-opacity-30 border-[1px] border-white shadow-md rounded-md text-black px-1 py-2">
            <h2 className="uppercase text-sm font-semibold">
              {element.panelName}
            </h2>
            <ul className="flex flex-col items-start text-xs uppercase space-y-1">
              {element.menuItem.map((item) => {
                return (
                  <NavLink
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
