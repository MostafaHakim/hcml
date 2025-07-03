import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MasterProfileChart({ delivered, remaining }) {
  const data = [
    { name: `Delivered (${delivered} yds)`, value: delivered },
    { name: `Remaining (${remaining} yds)`, value: remaining },
  ];
  const COLORS = ["#0088FE", "#FF8042"];

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
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} yds`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function Pagination({ total, page, onChange, rowsPerPage }) {
  const totalPages = Math.ceil(total / rowsPerPage);
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-end p-2 gap-2 text-sm">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`px-2 py-1 rounded border ${
            page === i + 1 ? "bg-blue-500 text-white" : "bg-white"
          }`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

function MasterProfile() {
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [griege, setGriege] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);

  const [lotFilter, setLotFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [assignedPage, setAssignedPage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);
  const rowsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`${BASE_URL}/user/master`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch master data");
        return res.json();
      }),
      fetch(`${BASE_URL}/demand`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch demand data");
        return res.json();
      }),
      fetch(`${BASE_URL}/griegein/delivaryinfo`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch delivery info");
        return res.json();
      }),
    ])
      .then(([masterRes, griegeRes, deliveryRes]) => {
        setData(masterRes);
        setGriege(griegeRes);

        const headers = deliveryRes[0];
        const rows = deliveryRes.slice(1);
        const formatted = rows.map((r) =>
          headers.reduce((o, h, i) => ({ ...o, [h]: r[i] }), {})
        );
        const grouped = Object.values(
          formatted.reduce((acc, curr) => {
            const key = `${curr["Chalan No"]}-${curr["Lot Number"]}`;
            if (!acc[key]) {
              acc[key] = {
                ...curr,
                Griege: +curr.Griege || 0,
                Finishing: +curr.Finishing || 0,
                Than: 1,
              };
            } else {
              acc[key].Griege += +curr.Griege || 0;
              acc[key].Finishing += +curr.Finishing || 0;
              acc[key].Than += 1;
            }
            return acc;
          }, {})
        );
        setDeliveryData(grouped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [BASE_URL]);

  const masterRow = useMemo(() => {
    if (data.length < 2) return null;
    const rows = data.slice(1);
    return rows.find(
      (row) => row[4]?.toString().trim() === id?.toString().trim()
    );
  }, [data, id]);

  const masterName = masterRow?.[0] || "";
  const masterDeg = masterRow?.[1] || "";
  const masterMobile = masterRow?.[2] || "";
  const masterAdd = masterRow?.[3] || "";
  const masterId = masterRow?.[4] || "";

  const assignedLots = useMemo(
    () => griege.filter((i) => i["Master's Name"] === masterName),
    [griege, masterName]
  );
  const assignedLotNumbers = useMemo(
    () => assignedLots.map((l) => l["Lot Number"]),
    [assignedLots]
  );

  const filteredAssigned = useMemo(
    () =>
      assignedLots.filter((lot) => {
        const lotNum = String(lot["Lot Number"] || "");
        if (
          lotFilter &&
          !lotNum.toLowerCase().includes(lotFilter.toLowerCase())
        )
          return false;

        const date = new Date(lot.Date);
        if (fromDate && new Date(fromDate) > date) return false;
        if (toDate && new Date(toDate) < date) return false;
        return true;
      }),
    [assignedLots, lotFilter, fromDate, toDate]
  );

  const filteredDelivery = useMemo(
    () =>
      deliveryData.filter((item) => {
        const lotNum = String(item["Lot Number"] || "");
        if (!assignedLotNumbers.includes(item["Lot Number"])) return false;
        if (
          lotFilter &&
          !lotNum.toLowerCase().includes(lotFilter.toLowerCase())
        )
          return false;

        const date = new Date(item.Date);
        if (fromDate && new Date(fromDate) > date) return false;
        if (toDate && new Date(toDate) < date) return false;
        return true;
      }),
    [deliveryData, assignedLotNumbers, lotFilter, fromDate, toDate]
  );

  const totalDelivered = filteredDelivery.reduce((sum, d) => sum + d.Griege, 0);
  const totalAssigned = filteredAssigned.reduce(
    (sum, a) => sum + (+a["Received Grey"] || 0),
    0
  );

  const pagedAssigned = useMemo(
    () =>
      filteredAssigned.slice(
        (assignedPage - 1) * rowsPerPage,
        assignedPage * rowsPerPage
      ),
    [filteredAssigned, assignedPage]
  );
  const pagedDelivery = useMemo(
    () =>
      filteredDelivery.slice(
        (deliveryPage - 1) * rowsPerPage,
        deliveryPage * rowsPerPage
      ),
    [filteredDelivery, deliveryPage]
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-blue-600 text-xl font-semibold">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Error: {error}
      </div>
    );
  }

  if (!masterRow)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Master not found!
      </div>
    );

  return (
    <div className="p-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">👤 {masterName}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-100 rounded-xl shadow-md mb-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-semibold text-gray-800">{masterName}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Designation</p>
          <p className="text-lg font-semibold text-gray-800">{masterDeg}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Address</p>
          <p className="text-lg font-semibold text-gray-800">{masterAdd}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Mobile</p>
          <p className="text-lg font-semibold text-gray-800">{masterMobile}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Lot"
          value={lotFilter}
          onChange={(e) => setLotFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => {
            setLotFilter("");
            setFromDate("");
            setToDate("");
          }}
          className="bg-gray-300 p-2 rounded"
        >
          Clear
        </button>
      </div>

      <div className="mb-6">
        <MasterProfileChart
          delivered={totalDelivered}
          remaining={Math.max(totalAssigned - totalDelivered, 0)}
        />
      </div>

      <section className="mb-8">
        <h3 className="text-xl font-bold mb-2">📦 Assigned Lots</h3>
        <div className="border rounded overflow-hidden">
          <div className="grid grid-cols-8 bg-blue-100 font-bold text-sm p-2">
            <div>Date</div>
            <div>Lot</div>
            <div className="col-span-2">Party</div>
            <div>Type</div>
            <div>Design</div>
            <div>Received</div>
            <div>Than</div>
          </div>
          {pagedAssigned.map((item, i) => (
            <Link
              to={`/admin/dashboard/griege/received/${item["Lot Number"]}`}
              key={i}
              className={`grid grid-cols-8 text-sm p-2 ${
                i % 2 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-100`}
            >
              <div>{new Date(item.Date).toLocaleDateString()}</div>
              <div>{item["Lot Number"]}</div>
              <div className="col-span-2">{item["Party's Name"]}</div>
              <div>{item.Type}</div>
              <div>{item.Design}</div>
              <div>{item["Received Grey"]}</div>
              <div>{item.Than}</div>
            </Link>
          ))}
          <Pagination
            total={filteredAssigned.length}
            page={assignedPage}
            onChange={setAssignedPage}
            rowsPerPage={rowsPerPage}
          />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-2">🚚 Delivery Info</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-blue-100">
              <tr>
                {[
                  "Date",
                  "Challan",
                  "Lot",
                  "Type",
                  "Design",
                  "Than",
                  "Greige",
                  "Finishing",
                ].map((h) => (
                  <th key={h} className="border px-2 py-1">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedDelivery.map((item, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    navigate(
                      `/admin/dashboard/griege/received/${item["Lot Number"]}`
                    )
                  }
                  className={`cursor-pointer ${
                    i % 2 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-100`}
                >
                  <td className="border px-2 py-1">
                    {new Date(item.Date).toLocaleDateString()}
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
          <Pagination
            total={filteredDelivery.length}
            page={deliveryPage}
            onChange={setDeliveryPage}
            rowsPerPage={rowsPerPage}
          />
        </div>
      </section>
    </div>
  );
}

export default MasterProfile;
