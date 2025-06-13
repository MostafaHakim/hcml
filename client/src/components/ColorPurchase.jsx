import React, { useEffect, useState } from "react";

function ColorPurchase() {
  const [purchaseData, setPurchaseData] = useState([]);
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/colorprice/purchase")
      .then((res) => res.json())
      .then((data) => setPurchaseData(data));
  }, []);
  const headers = purchaseData[0];
  const rows = purchaseData.slice(1);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border px-4 py-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border px-4 py-2">
                  {colIndex === 0
                    ? new Date(cell).toLocaleDateString("en-GB") // Format date
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ColorPurchase;
