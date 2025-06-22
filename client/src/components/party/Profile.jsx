import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Profile() {
  const [party, setParty] = useState(null);
  const [demand, setDemand] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const { id } = useParams();

  // Fetch party details
  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/party/partydetails`)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.slice(1); // skip header
        const found = rows.find((p) => String(p[2]) === id);
        setParty(found);
      });
  }, [id]);

  // Fetch demand (Griege Received)
  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand`)
      .then((res) => res.json())
      .then((data) => {
        setDemand(data);
      });
  }, []);

  // Fetch delivery data
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

  if (!party) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Loading profile for ID: {id}...</p>
      </div>
    );
  }

  const partyName = party[0];

  // Filtered data for this party
  const filteredDemand = demand.filter(
    (item) => item["Party's Name"] === partyName
  );

  const filteredDelivery = groupedData.filter(
    (item) => item["Party's Name"] === partyName
  );

  const totalReceived = filteredDemand.reduce(
    (sum, item) => sum + (parseFloat(item["Received Grey"]) || 0),
    0
  );

  const totalDelivered = filteredDelivery.reduce(
    (sum, item) => sum + (parseFloat(item.totalGriege) || 0),
    0
  );

  const totalPending =
    totalReceived - totalDelivered > 0 ? totalReceived - totalDelivered : 0;

  // Pie chart data only includes Delivered and Pending to show 100% of Received
  const chartData = [
    { name: "Delivered", value: totalDelivered },
    { name: "Pending", value: totalPending },
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  // Pie label renderer showing percentage of totalReceived
  const renderLabel = ({ name, value }) => {
    if (totalReceived === 0) return `${name}: 0%`;
    const percent = (value / totalReceived) * 100;
    return `${name}: ${percent.toFixed(1)}%`;
  };

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-md space-y-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
        {partyName}
      </h2>
      <div className="grid grid-cols-2 items-center justify-center gap-6">
        {/* Party Info */}
        <div className="text-gray-700 text-md text-start col-span-1 flex flex-col items-start justify-start space-y-2">
          <p>
            <span className="font-semibold">Address:</span> {party[1]}
          </p>
          <p>
            <span className="font-semibold">Mobile No:</span> {party[2]}
          </p>
        </div>
        {/* Pie Chart */}
        <div className="bg-gray-50 p-4 rounded shadow-md mb-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-center text-purple-700">
            Griege Summary (Pie Chart)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} units`}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const val = payload[0].value;
                    const name = payload[0].name;
                    const percent = ((val / totalReceived) * 100).toFixed(1);
                    return (
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          padding: 10,
                        }}
                      >
                        <p>{name}</p>
                        <p>
                          {val} units ({percent}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grieeg Received */}
      <div>
        <h3 className="text-lg font-semibold text-green-700 border-b mb-2">
          Griege Received
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Lot</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Design</th>
                <th className="border px-2 py-1">Than</th>
                <th className="border px-2 py-1">Received Grey</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemand.map((item, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-2 py-1">
                    {new Date(item.Date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border px-2 py-1">{item["Lot Number"]}</td>
                  <td className="border px-2 py-1">{item.Type}</td>
                  <td className="border px-2 py-1">{item.Design}</td>
                  <td className="border px-2 py-1">{item.Than}</td>
                  <td className="border px-2 py-1">{item["Received Grey"]}</td>
                </tr>
              ))}
              {filteredDemand.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No griege received.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Griege Delivered */}
      <div>
        <h3 className="text-lg font-semibold text-blue-700 border-b mb-2">
          Griege Delivered
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Challan</th>
                <th className="border px-2 py-1">Lot</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Design</th>
                <th className="border px-2 py-1">Griege</th>
                <th className="border px-2 py-1">Finishing</th>
              </tr>
            </thead>
            <tbody>
              {filteredDelivery.map((item, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-2 py-1">
                    {new Date(item.Date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border px-2 py-1">{item["Chalan No"]}</td>
                  <td className="border px-2 py-1">{item["Lot Number"]}</td>
                  <td className="border px-2 py-1">{item.Type}</td>
                  <td className="border px-2 py-1">{item.Design}</td>
                  <td className="border px-2 py-1">{item.totalGriege}</td>
                  <td className="border px-2 py-1">{item.totalFinishing}</td>
                </tr>
              ))}
              {filteredDelivery.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No delivery data.
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

export default Profile;
