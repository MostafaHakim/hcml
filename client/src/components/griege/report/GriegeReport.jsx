import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function GriegeReport() {
  const [demand, setDemand] = useState([]);

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand`)
      .then((res) => res.json())
      .then((data) => {
        setDemand(data);
      });
  }, []);
  return (
    <div className="w-full p-4">
      <h2 className="uppercase py-1 bg-green-800 bg-opacity-50 text-white rounded-t-lg">
        Report Griege
      </h2>
      <div className="grid grid-cols-8 bg-blue-900 text-white text-sm">
        <div className="col-span-1">Date</div>
        <div className="col-span-1">Lot Number</div>
        <div className="col-span-2">Party's Name</div>
        <div className="col-span-1">No of than</div>
        <div className="col-span-1">Total griege</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Design</div>
      </div>
      {demand.map((item, i) => {
        return (
          <Link
            to={`${item["Lot Number"]}`}
            className={`grid grid-cols-8 text-black text-sm hover:bg-gray-500 hover:text-white ${
              i % 2 ? "bg-gray-300" : "bg-white"
            }`}
          >
            <div className="col-span-1">
              {new Date(item["Date"]).toLocaleDateString().split("T")}
            </div>
            <div className="col-span-1">{item["Lot Number"]}</div>
            <div className="col-span-2">{item["Party's Name"]}</div>
            <div className="col-span-1">{item["Than"]}</div>
            <div className="col-span-1">{item["Received Grey"]}</div>
            <div className="col-span-1">{item["Type"]}</div>
            <div className="col-span-1">{item["Design"]}</div>
          </Link>
        );
      })}
    </div>
  );
}

export default GriegeReport;
