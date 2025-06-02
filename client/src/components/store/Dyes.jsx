import { useState, useEffect } from "react";
import Topbar from "../griege/Topbar";
import { NavLink, Outlet } from "react-router-dom";

function Dyes() {
  const griegeOption = ["demand", "purchase"];
  const [colorStock, setColorStock] = useState([]);

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/stock`)
      .then((res) => res.json())
      .then((data) => setColorStock(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <NavLink to="/">Home</NavLink>
      <Topbar setTabOption={griegeOption} />
      <main>
        <div className="grid grid-cols-6 gap-2 w-full text-sm">
          <label></label>
          {colorStock.map((color, i) => (
            <div
              key={i}
              className="p-2 bg-white border-[1px] border-gray-200 text-black flex flex-col items-center justify-center rounded-md ring-2 shadow-md ring-inset"
            >
              <label className="font-semibold">{color["PRODUCT NAME"]}</label>
              <h2 className="w-full text-start text-gray-600">
                Present Stock: <span>{color["PRESENT STOCK"]}</span>
              </h2>
            </div>
          ))}
        </div>
      </main>
      <Outlet />
    </div>
  );
}

export default Dyes;
