import { useState } from "react";
import Topbar from "../griege/Topbar";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dyes() {
  const griegeOption = ["demand", "purchase"];
  const [colorStock, setColorStock] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/stock`)
      .then((res) => res.json())
      .then((data) => setColorStock(data))
      .catch((err) => console.error(err));
  }, []);
  console.log(colorStock);
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <NavLink to="/">Home</NavLink>
      <Topbar setTabOption={griegeOption} />
      <main></main>
      <Outlet />
    </div>
  );
}

export default Dyes;
