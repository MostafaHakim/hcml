import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-full">
      <ul className="w-full flex flex-row items-end justify-end">
        <NavLink to="/">Back</NavLink>
      </ul>
    </div>
  );
}

export default Navbar;
