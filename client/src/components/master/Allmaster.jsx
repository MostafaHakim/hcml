import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Allmaster() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/user/master")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error("Failed to fetch user data", err);
      });
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const headers = data[0]; // ['Master Name', 'Designation', 'Mobile', 'Address']
  const rows = data.slice(1); // actual data rows

  return (
    <div className="p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">All Masters</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
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
            {rows.map((row, index) => (
              <tr
                onClick={() => navigate(`/admin/dashboard/master/${row[2]}`)}
                key={index}
                className={`hover:bg-gray-50 bg-opacity-50 text-xs cursor-pointer ${
                  index % 2 ? "bg-gray-300" : "bg-white"
                }`}
              >
                <td className="border px-4 py-2">{row[0]}</td>
                <td className="border px-4 py-2">{row[1]}</td>
                <td className="border px-4 py-2">{row[2]}</td>
                <td className="border px-4 py-2">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Allmaster;
