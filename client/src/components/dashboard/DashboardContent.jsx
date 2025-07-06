import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Helper Components ---

const PackagePlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-package-plus"
  >
    <path d="M16 16h6" />
    <path d="M19 13v6" />
    <path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7.9c0 .6.4 1.1.9 1.2l6.7 1.6c.6.1 1.2 0 1.7-.2L16 18" />
    <path d="m3 6 8 2 8-2" />
    <path d="M11 2v4" />
    <path d="M7 2v4" />
  </svg>
);

const FlaskConicalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-flask-conical"
  >
    <path d="M10 16V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v8" />
    <path d="M14 16a4 4 0 0 1-8 0H6" />
    <path d="M14 16h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
    <path d="M10 16H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    <path d="M8 21h8" />
    <path d="M12 3V2" />
  </svg>
);

const TruckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-truck"
  >
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.2a2 2 0 0 0-.7-1.6L19 9h-4" />
    <path d="M14 9V3" />
    <path d="M6 18h.01" />
  </svg>
);

const StatCard = ({ title, value, icon, colorClass, unit }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:scale-105">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h2 className={`text-3xl font-bold ${colorClass}`}>
        {value}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </h2>
    </div>
    <div className={`text-4xl ${colorClass}`}>{icon}</div>
  </div>
);

const TimeFilter = ({ activeFilter, setFilter }) => {
  const filters = ["7d", "15d", "30d", "60d", "90d", "6m", "1y", "All"];
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeFilter === filter
              ? "bg-sky-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-sky-100"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

// --- Main Dashboard Component ---

const DashboardContent = () => {
  const [griegeReceived, setGriegeReceived] = useState([]);
  const [dyesPurchased, setDyesPurchased] = useState([]);
  const [griegeDelivered, setGriegeDelivered] = useState([]);
  const [dyesUsed, setDyesUsed] = useState([]);
  const [dyesAvailable, setDyesAvailable] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("--- STARTING DATA FETCH ---");
      try {
        const [griegeRes, griegeDeliveredRes, dyesPurchasedRes, colorRes, stockRes] = await Promise.all([
          fetch(`${BASE_URL}/demand`),
          fetch(`${BASE_URL}/griegein/delivaryinfo`),
          fetch(`${BASE_URL}/colorprice/purchase`),
          fetch(`${BASE_URL}/color`),
          fetch(`${BASE_URL}/stock`)
        ]);

        console.log("--- API RESPONSES ---");
        console.log("Griege/Dyes Used OK:", griegeRes.ok);
        console.log("Griege Delivered OK:", griegeDeliveredRes.ok);
        console.log("Dyes Purchased OK:", dyesPurchasedRes.ok);
        console.log("Color List OK:", colorRes.ok);
        console.log("Stock OK:", stockRes.ok);

        if (!griegeRes.ok) throw new Error(`Failed to fetch Griege/Dyes Used data`);
        if (!griegeDeliveredRes.ok) throw new Error(`Failed to fetch Griege Delivered data`);
        if (!dyesPurchasedRes.ok) throw new Error(`Failed to fetch Dyes Purchased data`);
        if (!colorRes.ok) throw new Error(`Failed to fetch Color list`);
        if (!stockRes.ok) throw new Error(`Failed to fetch Stock data`);

        const demandData = await griegeRes.json();
        const griegeDeliveredData = await griegeDeliveredRes.json();
        const dyesPurchasedData = await dyesPurchasedRes.json();
        const colorData = await colorRes.json();
        const stockData = await stockRes.json();

        console.log("--- RAW DATA LOGS ---");
        console.log("Raw Demand (Griege Received & Dyes Used):", demandData);
        console.log("Raw Griege Delivered:", griegeDeliveredData);
        console.log("Raw Dyes Purchased:", dyesPurchasedData);
        console.log("Raw Color List:", colorData);
        console.log("Raw Stock:", stockData);

        const processedGriegeDelivered = Array.isArray(griegeDeliveredData) ? griegeDeliveredData.slice(1).map(row => ({ Date: row[0], Griege: row[7] })) : [];
        const processedDyesPurchased = Array.isArray(dyesPurchasedData) ? dyesPurchasedData.slice(1).map(row => ({ date: row[0], colorName: row[3], qtyKg: row[4] })) : [];
        const processedColorList = ["All", ...(Array.isArray(colorData) ? colorData.slice(1).map(item => item[0]) : [])];

        setGriegeReceived(demandData);
        setDyesUsed(demandData); // Dyes Used data is in the demand endpoint
        setGriegeDelivered(processedGriegeDelivered);
        setDyesPurchased(processedDyesPurchased);
        setColorList(processedColorList);
        setDyesAvailable(stockData);

        console.log("--- PROCESSED DATA LOGS ---");
        console.log("Processed Griege Delivered:", processedGriegeDelivered);
        console.log("Processed Dyes Purchased:", processedDyesPurchased);
        console.log("Processed Color List:", processedColorList);

      } catch (error) {
        setError(error.message);
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
        console.log("--- DATA FETCH COMPLETE ---");
      }
    };

    fetchData();
  }, [BASE_URL]);

  const filteredData = useMemo(() => {
    console.log("--- FILTERING DATA ---");
    console.log("Time Filter:", timeFilter, "Color Filter:", selectedColor);

    const now = new Date();
    let startDate;

    switch (timeFilter) {
      case "7d": startDate = new Date(now.setDate(now.getDate() - 7)); break;
      case "15d": startDate = new Date(now.setDate(now.getDate() - 15)); break;
      case "30d": startDate = new Date(now.setDate(now.getDate() - 30)); break;
      case "60d": startDate = new Date(now.setDate(now.getDate() - 60)); break;
      case "90d": startDate = new Date(now.setDate(now.getDate() - 90)); break;
      case "6m": startDate = new Date(now.setMonth(now.getMonth() - 6)); break;
      case "1y": startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
      default: startDate = new Date(0);
    }

    const filterByDate = (item) => new Date(item.Date || item.date) >= startDate;
    
    const result = {
      griegeReceived: Array.isArray(griegeReceived) ? griegeReceived.filter(filterByDate) : [],
      dyesPurchased: Array.isArray(dyesPurchased) ? dyesPurchased.filter(filterByDate).filter(item => selectedColor === "All" || item.colorName === selectedColor) : [],
      griegeDelivered: Array.isArray(griegeDelivered) ? griegeDelivered.filter(filterByDate) : [],
      dyesUsed: Array.isArray(dyesUsed) ? dyesUsed.filter(filterByDate).filter(item => selectedColor === "All" || item.ColorName === selectedColor) : [],
      dyesAvailable: Array.isArray(dyesAvailable) ? dyesAvailable.filter(item => selectedColor === "All" || item["PRODUCT NAME"] === selectedColor) : [],
    };

    console.log("Filtered Data:", result);
    return result;
  }, [timeFilter, selectedColor, griegeReceived, dyesPurchased, griegeDelivered, dyesUsed, dyesAvailable]);

  const { griegeChartData, dyesChartData, totals, availableDyesChartData } = useMemo(() => {
    console.log("--- CALCULATING CHART DATA & TOTALS ---");

    const processData = (data, valueField, dateField = "date") => {
      const map = new Map();
      if (!Array.isArray(data)) return [];
      data.forEach((item) => {
        const date = new Date(item[dateField]).toLocaleDateString("en-CA");
        if (!map.has(date)) {
          map.set(date, { name: new Date(date).toLocaleDateString(), value: 0 });
        }
        map.get(date).value += parseFloat(item[valueField]) || 0;
      });
      return Array.from(map.values()).sort((a, b) => new Date(a.name) - new Date(b.name));
    };

    const griegeReceivedData = processData(filteredData.griegeReceived, "Received Grey", "Date");
    const griegeDeliveredData = processData(filteredData.griegeDelivered, "Griege", "Date");
    const dyesPurchasedData = processData(filteredData.dyesPurchased, "qtyKg", "date");
    const dyesUsedData = processData(filteredData.dyesUsed, "Dyes Used", "Date");

    const mergeChartData = (arr1, arr2, key1, key2) => {
      const map = new Map();
      arr1.forEach(item => map.set(item.name, { name: item.name, [key1]: item.value, [key2]: 0 }));
      arr2.forEach(item => {
        if (map.has(item.name)) {
          map.get(item.name)[key2] = item.value;
        } else {
          map.set(item.name, { name: item.name, [key1]: 0, [key2]: item.value });
        }
      });
      return Array.from(map.values()).sort((a, b) => new Date(a.name) - new Date(b.name));
    };

    const totals = {
      griegeReceived: filteredData.griegeReceived.reduce((sum, item) => sum + (parseFloat(item["Received Grey"]) || 0), 0),
      griegeDelivered: filteredData.griegeDelivered.reduce((sum, item) => sum + (parseFloat(item.Griege) || 0), 0),
      dyesPurchased: filteredData.dyesPurchased.reduce((sum, item) => sum + (parseFloat(item.qtyKg) || 0), 0),
      dyesUsed: filteredData.dyesUsed.reduce((sum, item) => sum + (parseFloat(item["Dyes Used"]) || 0), 0),
      dyesAvailable: filteredData.dyesAvailable.reduce((sum, item) => sum + (parseFloat(item["PRESENT STOCK"]) || 0), 0),
    };
    
    const availableDyesChartData = filteredData.dyesAvailable
      .map(item => ({ name: item["PRODUCT NAME"], stock: parseFloat(item["PRESENT STOCK"]) / 1000 }))
      .filter(item => item.stock > 0);

    const finalChartData = {
      griegeChartData: mergeChartData(griegeReceivedData, griegeDeliveredData, 'received', 'delivered'),
      dyesChartData: mergeChartData(dyesPurchasedData, dyesUsedData, 'purchased', 'used'),
      totals,
      availableDyesChartData
    };

    console.log("Final Chart Data & Totals:", finalChartData);
    return finalChartData;
  }, [filteredData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
          <p className="text-gray-500">Fetching latest data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">Something Went Wrong</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Business Overview</h1>
        <p className="text-gray-500 mt-1">Real-time insights into your operations.</p>
      </header>

      <TimeFilter activeFilter={timeFilter} setFilter={setTimeFilter} />

      {/* Griege Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Griege Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Griege Received"
            value={totals.griegeReceived.toFixed(2)}
            unit="yds"
            icon={<PackagePlusIcon />}
            colorClass="text-green-600"
          />
          <StatCard
            title="Griege Delivered"
            value={totals.griegeDelivered.toFixed(2)}
            unit="yds"
            icon={<TruckIcon />}
            colorClass="text-purple-600"
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Griege Daily Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={griegeChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "0.75rem", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", border: "1px solid #e5e7eb" }} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line type="monotone" dataKey="received" name="Received" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="delivered" name="Delivered" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Dyes Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Dyes Management</h2>
          <div className="w-64">
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {colorList.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Dyes Purchased"
            value={totals.dyesPurchased.toFixed(2)}
            unit="Kg"
            icon={<FlaskConicalIcon />}
            colorClass="text-blue-600"
          />
          <StatCard
            title="Dyes Used"
            value={totals.dyesUsed.toFixed(2)}
            unit="Kg"
            icon={<FlaskConicalIcon />}
            colorClass="text-orange-600"
          />
          <StatCard
            title="Dyes Available"
            value={(totals.dyesAvailable / 1000).toFixed(2)}
            unit="Kg"
            icon={<FlaskConicalIcon />}
            colorClass="text-teal-600"
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Dyes Daily Trends</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dyesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", border: "1px solid #e5e7eb" }} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line type="monotone" dataKey="purchased" name="Purchased" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="used" name="Used" stroke="#f97316" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Available Dyes Stock (Kg)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={availableDyesChartData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" name="Available Stock" fill="#0d9488" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardContent;
