import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [party, setParty] = useState(null);
  const [demand, setDemand] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  const [loadingParty, setLoadingParty] = useState(true);
  const [loadingDemand, setLoadingDemand] = useState(true);
  const [loadingDelivery, setLoadingDelivery] = useState(true);

  const [lotFilter, setLotFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch party details
  useEffect(() => {
    setLoadingParty(true);
    fetch(`${BASE_URL}/party/partydetails`)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.slice(1);
        const found = rows.find((p) => String(p[2]) === id);
        setParty(found || null);
      })
      .catch(() => setParty(null))
      .finally(() => setLoadingParty(false));
  }, [id]);

  // Fetch demand
  useEffect(() => {
    setLoadingDemand(true);
    fetch(`${BASE_URL}/demand`)
      .then((res) => res.json())
      .then((data) => setDemand(data))
      .catch(() => setDemand([]))
      .finally(() => setLoadingDemand(false));
  }, []);

  // Fetch delivery
  useEffect(() => {
    setLoadingDelivery(true);
    fetch(`${BASE_URL}/griegein/delivaryinfo`)
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

  const partyName = party ? party[0] : "";

  const isWithinDateRange = (dateStr) => {
    if (!fromDate && !toDate) return true;
    const date = new Date(dateStr);
    if (fromDate && date < new Date(fromDate)) return false;
    if (toDate && date > new Date(toDate)) return false;
    return true;
  };

  const filteredDemand = useMemo(() => {
    if (!partyName) return [];
    return demand.filter(
      (item) =>
        item["Party's Name"] === partyName &&
        (!lotFilter || String(item["Lot Number"] || "").includes(lotFilter)) &&
        isWithinDateRange(item.Date)
    );
  }, [demand, partyName, lotFilter, fromDate, toDate]);

  const filteredDelivery = useMemo(() => {
    if (!partyName) return [];
    return groupedData.filter(
      (item) =>
        item["Party's Name"] === partyName &&
        (!lotFilter || String(item["Lot Number"] || "").includes(lotFilter)) &&
        isWithinDateRange(item.Date)
    );
  }, [groupedData, partyName, lotFilter, fromDate, toDate]);

  const totalReceived = filteredDemand.reduce(
    (sum, item) => sum + (parseFloat(item["Received Grey"]) || 0),
    0
  );
  const totalDelivered = filteredDelivery.reduce(
    (sum, item) => sum + (parseFloat(item.totalGriege) || 0),
    0
  );
  const totalPending = Math.max(totalReceived - totalDelivered, 0);

  const chartData = [
    { name: "Delivered", value: totalDelivered },
    { name: "Pending", value: totalPending },
  ];
  const COLORS = ["#00C49F", "#FF8042"];

  const renderLabel = ({ name, value }) => `${name}: ${value} YDS`;

  if (loadingParty) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Loading profile for ID: {id}...</p>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Party not found for ID: {id}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md space-y-8">
      <div className="flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
        {partyName}
      </h2>

      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded shadow-md space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">🔎 Filter Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by Lot Number"
            value={lotFilter}
            onChange={(e) => setLotFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="text-right">
          <button
            onClick={() => {
              setLotFilter("");
              setFromDate("");
              setToDate("");
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="text-gray-700 text-md flex flex-col space-y-2">
          <p>
            <span className="font-semibold">Address:</span> {party[1]}
          </p>
          <p>
            <span className="font-semibold">Mobile No:</span> {party[2]}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-center text-purple-700">
            Greige Summary (Yards)
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
              <Tooltip formatter={(value) => `${value} YDS`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 text-center text-blue-800 text-md font-medium">
            Total Received:{" "}
            <span className="font-bold">{totalReceived} YDS</span>
          </div>
        </div>
      </div>

      {/* Greige Received Table */}
      <div>
        <h3 className="text-lg font-semibold text-green-700 border-b mb-2">
          Greige Received
        </h3>
        {loadingDemand ? (
          <p className="text-center text-gray-500 py-4">
            Loading demand data...
          </p>
        ) : filteredDemand.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No greige received.</p>
        ) : (
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
                  <tr
                    key={`${item["Lot Number"]}-${i}`}
                    className="text-center hover:bg-blue-100 cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/griege/received/${item["Lot Number"]}`
                      )
                    }
                  >
                    <td className="border px-2 py-1">
                      {new Date(item.Date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="border px-2 py-1">{item["Lot Number"]}</td>
                    <td className="border px-2 py-1">{item.Type}</td>
                    <td className="border px-2 py-1">{item.Design}</td>
                    <td className="border px-2 py-1">{item.Than}</td>
                    <td className="border px-2 py-1">
                      {item["Received Grey"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Greige Delivered Table */}
      <div>
        <h3 className="text-lg font-semibold text-blue-700 border-b mb-2">
          Greige Delivered
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
                    className="text-center hover:bg-blue-100 cursor-pointer"
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

export default Profile;
