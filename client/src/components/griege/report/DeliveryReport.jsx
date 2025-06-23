import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DeliveryReport() {
  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/griegein/delivaryinfo`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          const headers = data[0];
          const rows = data.slice(1);
          const formatted = rows
            .filter((row) => row.length === headers.length)
            .map((row) =>
              headers.reduce((obj, key, idx) => {
                obj[key] = row[idx];
                return obj;
              }, {})
            );

          // Group by Chalan No + Lot Number
          const grouped = Object.values(
            formatted.reduce((acc, curr) => {
              const key = `${curr["Chalan No"]}-${curr["Lot Number"]}`;
              if (!acc[key]) {
                acc[key] = {
                  ...curr,
                  totalGriege: isNaN(Number(curr["Griege"]))
                    ? 0
                    : Number(curr["Griege"]),
                  totalFinishing: isNaN(Number(curr["Finishing"]))
                    ? 0
                    : Number(curr["Finishing"]),
                };
              } else {
                acc[key].totalGriege += isNaN(Number(curr["Griege"]))
                  ? 0
                  : Number(curr["Griege"]);
                acc[key].totalFinishing += isNaN(Number(curr["Finishing"]))
                  ? 0
                  : Number(curr["Finishing"]);
              }
              return acc;
            }, {})
          );

          setGroupedData(grouped);
        }
      });
  }, []);

  return (
    <div className="w-full p-4 overflow-x-auto">
      <h2 className="uppercase py-1 bg-green-800 bg-opacity-50 text-white rounded-t-lg">
        Delivery Report
      </h2>

      <div className="grid grid-cols-12 bg-blue-900 text-white text-xs font-semibold">
        <div className="col-span-1">Date</div>
        <div className="col-span-1">Chalan No</div>
        <div className="col-span-1">Lot Number</div>
        <div className="col-span-2">Party's Name</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Design</div>
        <div className="col-span-1">Total Than</div>
        <div className="col-span-1">Total Griege</div>

        <div className="col-span-1">Status</div>
        <div className="col-span-1">Delivered By</div>
        <div className="col-span-1">Comments</div>
      </div>

      {groupedData.map((item, i) => (
        <Link
          key={i}
          to={`${item["Lot Number"]}`}
          className={`grid grid-cols-12 text-sm hover:bg-gray-500 hover:text-white ${
            i % 2 ? "bg-gray-100" : "bg-white"
          }`}
        >
          <div className="col-span-1">
            {new Date(item["Date"]).toLocaleDateString("en-GB")}
          </div>
          <div className="col-span-1">{item["Chalan No"]}</div>
          <div className="col-span-1">{item["Lot Number"]}</div>
          <div className="col-span-2">{item["Party's Name"]}</div>
          <div className="col-span-1">{item["Type"]}</div>
          <div className="col-span-1">{item["Design"]}</div>
          <div className="col-span-1">{item.totalGriege}</div>
          <div className="col-span-1">{item.totalFinishing}</div>

          <div className="col-span-1">{item["Status"]}</div>
          <div className="col-span-1">{item["Delivered By"]}</div>
          <div className="col-span-1">{item["Comments"]}</div>
        </Link>
      ))}
    </div>
  );
}

export default DeliveryReport;
