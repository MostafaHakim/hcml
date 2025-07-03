import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Lot() {
  const [demand, setDemand] = useState([]);
  const [than, setThan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { lotnumber } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demandRes = await fetch(`${BASE_URL}/demand`);
        const thanRes = await fetch(`${BASE_URL}/griegein/than`);
        if (!demandRes.ok || !thanRes.ok) throw new Error("Fetch error");

        const demandData = await demandRes.json();
        const thanData = await thanRes.json();

        setDemand(demandData);
        setThan(thanData);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded-lg">
        {error}
      </div>
    );
  if (!than.length || !Array.isArray(than[0])) {
    return (
      <div className="p-4 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg">
        Invalid data format.
      </div>
    );
  }

  const headers = than[0];
  const rows = than.slice(1);
  const filteredRows = rows.filter(
    (row) => Array.isArray(row) && row[0].toString() === lotnumber
  );

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 relative">
        <h2 className="text-3xl font-bold text-rose-700 border-l-8 pl-3 border-rose-400 uppercase">
          Lot Details - #{lotnumber}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demand Info */}
        <div className="p-6 bg-white rounded-2xl shadow-md ring-1 ring-gray-200 space-y-3">
          {demand
            .filter((item) => item["Lot Number"].toString() === lotnumber)
            .map((item, idx) => (
              <div
                key={idx}
                className="space-y-2 text-sm md:text-base uppercase"
              >
                <div className="font-semibold text-lg text-gray-800">
                  Lot Number:{" "}
                  <span className="text-rose-700">{item["Lot Number"]}</span>
                </div>
                <div>🎯 Party: {item["Party's Name"]}</div>
                <div>🧵 Type: {item["Type"]}</div>
                <div>🎨 Design: {item["Design"]}</div>
                <div>📦 Total Than: {item["Than"]}</div>
                <div>📏 Total Griege: {item["Received Grey"]}</div>
              </div>
            ))}
        </div>

        {/* Than Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-auto ring-1 ring-gray-200">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-800 font-semibold">
              <tr>
                {headers.map((head, i) => (
                  <th key={i} className="px-3 py-2 border-b border-gray-300">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row, idx) =>
                  Array.isArray(row) ? (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-sky-50"
                      } hover:bg-sky-100 transition`}
                    >
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className="px-3 py-2 border-b border-gray-200"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ) : null
                )
              ) : (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-4 text-gray-600"
                  >
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
