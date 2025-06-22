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

const COLORS = ["#0088FE", "#FF8042"]; // Received = Blue, Remaining = Orange

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      stroke="white"
      strokeWidth={0.5}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function MasterProfileChart({ received, remaining }) {
  const data = [
    { name: "Received Grey", value: received },
    { name: "Remaining Grey", value: remaining },
  ];

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
            labelLine={true}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelPosition="outside"
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
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
  const [groupedData, setGroupedData] = useState([]);
  const [filteredDelivery, setFilteredDelivery] = useState([]);
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

  // Fetch delivery info
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
        } else {
          setGroupedData([]);
        }
      })
      .catch(() => setGroupedData([]))
      .finally(() => setLoadingDelivery(false));
  }, []);

  // Prepare master and assignedLots
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

  // Filter delivery info by lot numbers
  useEffect(() => {
    const filtered = groupedData.filter((item) =>
      assignedLotNumbers.includes(item["Lot Number"])
    );
    setFilteredDelivery(filtered);
  }, [groupedData, assignedLotNumbers]);

  // Calculate totals for pie chart
  const totalReceived = filteredDelivery.reduce(
    (sum, item) => sum + (item.totalGriege || 0),
    0
  );

  const totalAssigned = assignedLots.reduce(
    (sum, item) => sum + (Number(item["Than"]) || 0),
    0
  );

  const remaining = Math.max(totalAssigned - totalReceived, 0);

  if (data.length === 0)
    return <div className="p-6 text-center">Loading profile...</div>;

  if (!master)
    return (
      <div className="p-6 text-red-600 text-center">Master not found!</div>
    );

  return (
    <div className="p-6 mx-auto w-full">
      {/* Master Profile */}
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
      <div className="bg-white rounded-lg shadow-lg p-6 mb-10 border w-full mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Grey Received vs Remaining
        </h3>
        <MasterProfileChart received={totalReceived} remaining={remaining} />
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
            <div className="grid grid-cols-8 bg-gray-100 font-bold text-sm p-2 rounded-t">
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Lot No</div>
              <div className="col-span-2">Party</div>
              <div className="col-span-1">Than</div>
              <div className="col-span-1">Received</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Design</div>
            </div>
            {assignedLots.map((item, i) => (
              <Link
                key={item["Lot Number"] + i}
                to={`/admin/dashboard/griege/received/${item["Lot Number"]}`}
                className={`grid grid-cols-8 text-sm p-2 transition-all duration-150 hover:bg-blue-600 hover:text-white ${
                  i % 2 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="col-span-1">
                  {new Date(item["Date"]).toLocaleDateString()}
                </div>
                <div className="col-span-1">{item["Lot Number"]}</div>
                <div className="col-span-2">{item["Party's Name"]}</div>
                <div className="col-span-1">{item["Than"]}</div>
                <div className="col-span-1">{item["Received Grey"]}</div>
                <div className="col-span-1">{item["Type"]}</div>
                <div className="col-span-1">{item["Design"]}</div>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Delivery Info */}
      <div>
        <h3 className="text-2xl font-semibold text-blue-700 pb-2">
          🚚 Greige Delivered
        </h3>
        {loadingDelivery ? (
          <p className="text-center text-gray-500 py-4">
            Loading delivery data...
          </p>
        ) : filteredDelivery.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No delivery data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Challan</th>
                  <th className="border px-2 py-1">Lot</th>
                  <th className="border px-2 py-1">Type</th>
                  <th className="border px-2 py-1">Design</th>
                  <th className="border px-2 py-1">Greige</th>
                  <th className="border px-2 py-1">Finishing</th>
                </tr>
              </thead>
              <tbody>
                {filteredDelivery.map((item, i) => (
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
                    <td className="border px-2 py-1">{item.totalGriege}</td>
                    <td className="border px-2 py-1">{item.totalFinishing}</td>
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
