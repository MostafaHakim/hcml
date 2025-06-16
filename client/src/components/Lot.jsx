import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Lot() {
  const [demand, setDemand] = useState([]);
  const [than, setThan] = useState([]);
  const { lotnumber } = useParams();

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand`)
      .then((res) => res.json())
      .then((data) => {
        setDemand(data);
      });
    fetch(`https://hcml-ry8s.vercel.app/griegein/than`)
      .then((res) => res.json())
      .then((data) => {
        setThan(data);
      });
  }, []);

  if (!than.length) return <div>Loading...</div>;

  const headers = than[0];
  const rows = than.slice(1);

  // Filter only those rows where first column (Lot) matches
  const filteredRows = rows.filter((row) => row[0].toString() === lotnumber);

  return (
    <div className="w-full p-4">
      <div className="relative">
        <h2 className="bg-white bg-opacity-30 text-black text-2xl py-1 uppercase">
          Lot Details
        </h2>
        <span className="w-1/12 h-full absolute bg-rose-700 top-0 left-0 bg-opacity-30"></span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 p-4">
          {demand
            .filter((item) => item["Lot Number"].toString() === lotnumber)
            .map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start justify-start space-y-1 p-4 bg-white bg-opacity-50 ring-2 ring-gray-600 uppercase"
              >
                <div className="text-2xl">Lot Number: {item["Lot Number"]}</div>
                <div>Party's Name: {item["Party's Name"]}</div>
                <div>Type: {item["Type"]}</div>
                <div>Design: {item["Design"]}</div>
                <div>Total Than: {item["Than"]}</div>
                <div>Total Griege: {item["Received Grey"]}</div>
              </div>
            ))}
        </div>

        <div className="p-4 col-span-1">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                {headers.map((head, i) => (
                  <th key={i} className="border px-4 py-2 text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  {row.map((cell, i) => (
                    <td key={i} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4">
                    No data found for Lot #{lotnumber}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Lot;
