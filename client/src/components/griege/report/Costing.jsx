import React, { useEffect, useState } from "react";

function Costing() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand/verifydyes`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  if (!data || data.length === 0) return <p>No data available</p>;

  const headers = data[0];
  const rows = data.slice(1);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // যদি ভুল তারিখ হয়
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  return (
    <div className="overflow-x-auto text-black ">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            {headers.map((header, index) => (
              <th key={index} className="px-2 py-1 border">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isEmptyRow = row.every((cell) => cell === "");
            return (
              <tr key={rowIndex} className={isEmptyRow ? "bg-gray-100" : ""}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border px-2 py-1 text-sm whitespace-nowrap"
                  >
                    {headers[cellIndex] === "Date" ? formatDate(cell) : cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Costing;
