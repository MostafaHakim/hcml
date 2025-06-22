import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Pie Chart Component
function MasterProfileChart({ delivered, remaining }) {
  const data = [
    { name: `Delivered (${delivered} yds)`, value: delivered },
    { name: `Remaining (${remaining} yds)`, value: remaining },
  ];

  const COLORS = ["#0088FE", "#FF8042"]; // Blue = Delivered, Orange = Remaining

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} yds`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function MasterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [griege, setGriege] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loadingDelivery, setLoadingDelivery] = useState(false);

  // Fetch master data
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/user/master")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch master data", err));
  }, []);

  // Fetch greige demand
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/demand")
      .then((res) => res.json())
      .then((data) => setGriege(data))
      .catch((err) => console.error("Failed to fetch greige data", err));
  }, []);

  // Fetch and group delivery info by Chalan No and Lot Number
  useEffect(() => {
    setLoadingDelivery(true);
    fetch("https://hcml-ry8s.vercel.app/griegein/delivaryinfo")
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

          // ✅ Group by Chalan No and Lot Number and count Than by number of rows
          const grouped = Object.values(
            formatted.reduce((acc, curr) => {
              const key = `${curr["Chalan No"]}-${curr["Lot Number"]}`;
              if (!acc[key]) {
                acc[key] = {
                  Date: curr["Date"],
                  "Chalan No": curr["Chalan No"],
                  "Lot Number": curr["Lot Number"],
                  Type: curr["Type"],
                  Design: curr["Design"],
                  Griege: Number(curr["Griege"]) || 0,
                  Finishing: Number(curr["Finishing"]) || 0,
                  Than: 1,
                };
              } else {
                acc[key].Griege += Number(curr["Griege"]) || 0;
                acc[key].Finishing += Number(curr["Finishing"]) || 0;
                acc[key].Than += 1;
              }
              return acc;
            }, {})
          );

          setDeliveryData(grouped);
        } else {
          setDeliveryData([]);
        }
      })
      .catch(() => setDeliveryData([]))
      .finally(() => setLoadingDelivery(false));
  }, []);

  const headers = data[0] || [];
  const rows = data.length > 1 ? data.slice(1) : [];
  const master = rows.find((row) => row[2]?.toString() === id);
  const masterName = master ? master[0] : "";

  const assignedLots = useMemo(() => {
    return griege.filter((item) => item["Master's Name"] === masterName);
  }, [griege, masterName]);

  const assignedLotNumbers = useMemo(() => {
    return assignedLots.map((lot) => lot["Lot Number"]);
  }, [assignedLots]);

  const totalDelivered = useMemo(() => {
    return deliveryData
      .filter((item) => assignedLotNumbers.includes(item["Lot Number"]))
      .reduce((sum, item) => sum + item.Griege, 0);
  }, [deliveryData, assignedLotNumbers]);

  const totalAssigned = useMemo(() => {
    return assignedLots.reduce(
      (sum, item) => sum + (Number(item["Received Grey"]) || 0),
      0
    );
  }, [assignedLots]);

  const remaining = Math.max(totalAssigned - totalDelivered, 0);

  if (data.length === 0) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (!master) {
    return (
      <div className="p-6 text-red-600 text-center">Master not found!</div>
    );
  }

  return (
    <div className="p-6 mx-auto w-full">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-10 border">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
          👤 {masterName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {headers.map((title, i) => (
            <div key={i} className="bg-gray-50 p-4 border rounded-lg shadow-sm">
              <div className="text-gray-500 text-sm font-semibold">{title}</div>
              <div className="text-gray-800 text-base font-medium">
                {master[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-10 border w-full max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Grey Delivery Status
        </h3>
        <MasterProfileChart delivered={totalDelivered} remaining={remaining} />
        <div className="mt-4 text-center">
          <p className="font-semibold">Total Assigned: {totalAssigned} yds</p>
          <p className="text-blue-600">Delivered: {totalDelivered} yds</p>
          <p className="text-orange-500">Remaining: {remaining} yds</p>
        </div>
      </div>

      {/* Assigned Lots */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          📦 Assigned Greige Lots
        </h3>
        {assignedLots.length === 0 ? (
          <div className="p-4 text-gray-500 italic">
            No lots assigned to this master yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-9 bg-gray-100 font-bold text-sm p-2 rounded-t">
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Lot No</div>
              <div className="col-span-2">Party</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Design</div>
              <div className="col-span-1">Than</div>
              <div className="col-span-1">Received</div>
              <div className="col-span-1">Delivered</div>
            </div>
            {assignedLots.map((item, i) => {
              const lotDelivered = deliveryData
                .filter((d) => d["Lot Number"] === item["Lot Number"])
                .reduce((sum, d) => sum + d.Griege, 0);

              return (
                <Link
                  key={item["Lot Number"] + i}
                  to={`/admin/dashboard/griege/received/${item["Lot Number"]}`}
                  className={`grid grid-cols-9 text-sm p-2 transition-all duration-150 hover:bg-blue-600 hover:text-white ${
                    i % 2 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="col-span-1">
                    {new Date(item["Date"]).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">{item["Lot Number"]}</div>
                  <div className="col-span-2">{item["Party's Name"]}</div>
                  <div className="col-span-1">{item["Type"]}</div>
                  <div className="col-span-1">{item["Design"]}</div>
                  <div className="col-span-1">{item["Than"]}</div>
                  <div className="col-span-1">{item["Received Grey"]}</div>
                  <div className="col-span-1">{lotDelivered}</div>
                </Link>
              );
            })}
          </>
        )}
      </div>

      {/* Delivery Info */}
      <div>
        <h3 className="text-2xl font-semibold text-blue-700 pb-2">
          🚚 Greige Delivery Details
        </h3>
        {loadingDelivery ? (
          <p className="text-center text-gray-500 py-4">
            Loading delivery data...
          </p>
        ) : deliveryData.filter((item) =>
            assignedLotNumbers.includes(item["Lot Number"])
          ).length === 0 ? (
          <p className="text-center text-gray-500 py-4">No delivery data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Challan No</th>
                  <th className="border px-2 py-1">Lot No</th>
                  <th className="border px-2 py-1">Type</th>
                  <th className="border px-2 py-1">Design</th>
                  <th className="border px-2 py-1">Than</th>
                  <th className="border px-2 py-1">Greige (yds)</th>
                  <th className="border px-2 py-1">Finishing (yds)</th>
                </tr>
              </thead>
              <tbody>
                {deliveryData
                  .filter((item) =>
                    assignedLotNumbers.includes(item["Lot Number"])
                  )
                  .map((item, i) => (
                    <tr
                      key={`${item["Chalan No"]}-${item["Lot Number"]}-${i}`}
                      className={`text-sm p-2 transition-all duration-150 hover:bg-blue-600 hover:text-white ${
                        i % 2 ? "bg-white" : "bg-gray-50"
                      }`}
                      onClick={() =>
                        navigate(
                          `/admin/dashboard/griege/received/${item["Lot Number"]}`
                        )
                      }
                    >
                      <td className="border px-2 py-1">
                        {new Date(item.Date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="border px-2 py-1">{item["Chalan No"]}</td>
                      <td className="border px-2 py-1">{item["Lot Number"]}</td>
                      <td className="border px-2 py-1">{item.Type}</td>
                      <td className="border px-2 py-1">{item.Design}</td>
                      <td className="border px-2 py-1">{item.Than}</td>
                      <td className="border px-2 py-1">{item.Griege}</td>
                      <td className="border px-2 py-1">{item.Finishing}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MasterProfile;
