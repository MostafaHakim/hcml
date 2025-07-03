import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Allmaster() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now();

      try {
        const response = await fetch(`${BASE_URL}/user/master`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const endTime = performance.now();
        console.log(
          `⏱️ MasterFetch took ${(endTime - startTime).toFixed(2)} ms`
        );

        setData(result);
      } catch (err) {
        console.error("❌ Failed to fetch master list:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  if (loading) return <div className="p-4">🔄 Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data.length)
    return <div className="p-4 text-gray-600">No data available.</div>;

  // Determine if response is array-of-arrays or array-of-objects
  const isArrayOfObjects =
    typeof data[0] === "object" && !Array.isArray(data[0]);

  const headers = isArrayOfObjects ? Object.keys(data[0]) : data[0];
  const rows = isArrayOfObjects ? data : data.slice(1);

  // Filter empty rows
  const filteredRows = rows.filter((row) =>
    isArrayOfObjects
      ? Object.values(row).some(
          (cell) => cell != null && String(cell).trim() !== ""
        )
      : row.some((cell) => cell != null && String(cell).trim() !== "")
  );

  return (
    <div className="p-4 shadow-lg bg-[#F8F8FF]">
      <h2 className="text-2xl font-bold mb-4">All Masters</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="border px-4 py-2 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => {
              const cells = isArrayOfObjects ? Object.values(row) : row;
              const mobile = isArrayOfObjects
                ? row["Mobile"] || row["mobile"]
                : row[4];

              return (
                <tr
                  key={index}
                  onClick={() => navigate(`/admin/dashboard/master/${mobile}`)}
                  className={`cursor-pointer hover:bg-gray-100 ${
                    index % 2 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {cells.map((cell, i) => (
                    <td key={i} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Allmaster;
