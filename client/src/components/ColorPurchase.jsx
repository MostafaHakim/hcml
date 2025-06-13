import React, { useEffect, useState } from "react";

import { motion, transform } from "framer-motion";
function ColorPurchase() {
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/colorprice/purchase")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setPurchaseData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!purchaseData.length)
    return <div className="p-4">No data available.</div>;

  const headers = purchaseData[0];
  const rows = purchaseData.slice(1);

  return (
    <div className="overflow-x-auto p-4 flex flex-col space-y-2 items-center justify-center ">
      <motion.h2
        animate={{
          //   rotateY: [0, 360], // rotate on X-axis
          borderRadius: [
            "1rem 0 1rem 0", // top-left & bottom-right rounded
            "0rem", // all square
            "0 1rem 0 1rem", // top-right & bottom-left rounded
            "1rem 1rem 1rem 1rem", // back to start
          ],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: 1,
        }}
        className="px-6 py-2 ring-2 ring-gray-300 ring-inset  text-xl font-sans font-semibold text-white  bg-sky-500 bg-opacity-70 rounded-full"
        style={{ perspective: 1000 }}
      >
        Color Purchase
      </motion.h2>
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
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 bg-opacity-50 text-xs ${
                rowIndex % 2 ? "bg-gray-300" : "bg-white"
              }`}
            >
              {row.map((cell, colIndex) => (
                <td key={colIndex} className={`border px-4 py-2 `}>
                  {colIndex === 0 && typeof cell === "string"
                    ? new Date(cell).toLocaleDateString("en-GB")
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
