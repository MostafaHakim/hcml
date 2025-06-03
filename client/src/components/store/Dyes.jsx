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
    <div className="w-full flex flex-col items-center justify-center px-8 pb-8">
      <NavLink to="/">Home</NavLink>
      <Topbar setTabOption={griegeOption} />
      <main>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 w-full text-sm">
          <label></label>
          {colorStock.map((color, i) => (
            <div
              key={i}
              className="p-2 bg-white border-[1px] border-gray-200 text-black flex flex-col items-center justify-center rounded-md ring-2 shadow-md ring-inset"
            >
              <label className="font-semibold">{color["PRODUCT NAME"]}</label>
              <h2 className="w-full text-start text-green-600">
                Current Stock: <span>{color["PRESENT STOCK"]}</span>
              </h2>
              <h2 className="w-full text-start text-yellow-600">
                Stock On Hold: <span>{color["ON HOLD"]}</span>
              </h2>
              <h2 className="w-full text-start text-gray-600">
                Total Stock: <span>{color["TOTAL STOCK"]}</span>
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
