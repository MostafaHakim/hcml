import { useState, useEffect } from "react";
import Topbar from "../griege/Topbar";
import { Outlet, useLocation } from "react-router-dom";

function Dyes() {
  const griegeOption = ["demand", "purchase"];
  const [colorStock, setColorStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const showLocation = location.pathname == "/admin/store/dyes";
  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/stock`)
      .then((res) => res.json())
      .then((data) => {
        setColorStock(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load color stock.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center px-8 pb-8">
      <Topbar setTabOption={griegeOption} />
      {showLocation ? (
        <main className={` w-full`}>
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 w-full text-sm">
            {colorStock.map((color) => (
              <div
                key={color["PRODUCT NAME"]}
                className="p-2 bg-white border border-gray-200 text-black flex flex-col items-start rounded-md shadow hover:bg-gray-50 transition"
              >
                <label className="font-semibold">{color["PRODUCT NAME"]}</label>
                <p className="text-green-600">
                  Current Stock: <span>{color["PRESENT STOCK"]}</span>
                </p>
                <p className="text-yellow-600">
                  Stock On Hold: <span>{color["ON HOLD"]}</span>
                </p>
                <p className="text-gray-600">
                  Total Stock: <span>{color["TOTAL STOCK"]}</span>
                </p>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

export default Dyes;
