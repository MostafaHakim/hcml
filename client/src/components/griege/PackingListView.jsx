import React from "react";

function PackingListView({ selectedThans }) {
  return (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-3">Packing List Summary</h2>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Lot No</th>
            <th className="border p-2">Color</th>
            <th className="border p-2">Grey</th>
            <th className="border p-2">Finishing</th>
          </tr>
        </thead>
        <tbody>
          {selectedThans.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{idx + 1}</td>
              <td className="border p-2">{item.lotNo}</td>
              <td className="border p-2">{item.color}</td>
              <td className="border p-2">{item.greige}</td>
              <td className="border p-2">{item.finishing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PackingListView;
