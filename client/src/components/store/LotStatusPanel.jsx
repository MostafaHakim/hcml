import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColors = (count) => {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#8DD17E",
    "#FF6F91",
    "#845EC2",
    "#D65DB1",
    "#FF9671",
  ];
  return colors.slice(0, count);
};

const LotStatusPanel = ({ lotStatus, watchValues }) => {
  const { lot, qty, workType } = watchValues;

  if (!lot) return null;

  // Calculate remaining qty for current workType
  const remaining = lotStatus[workType]
    ? lotStatus.initialQty - lotStatus[workType]
    : lotStatus.initialQty;

  // Prepare data for Pie Chart, exclude 'initialQty'
  const workTypeEntries = Object.entries(lotStatus).filter(
    ([key]) => key !== "initialQty"
  );

  if (workTypeEntries.length === 0) {
    return (
      <div className="col-span-3 p-5 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-800">
        <h3 className="text-2xl font-bold text-pink-700 mb-3">🎯 Lot Status</h3>
        <p>No work done yet for this lot.</p>
      </div>
    );
  }

  const chartData = {
    labels: workTypeEntries.map(
      ([key, value]) => `${key} - ${value.toFixed(2)} YDS`
    ),
    datasets: [
      {
        label: "Work Type Qty",
        data: workTypeEntries.map(([_, value]) => parseFloat(value.toFixed(2))),
        backgroundColor: generateColors(workTypeEntries.length),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="col-span-3 p-5 bg-white rounded-xl shadow-lg border border-gray-200 text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-pink-700">🎯 Lot Status</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          Lot No: <strong>{lot}</strong>
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="font-semibold">Received Grey:</span>
          <span>{lotStatus.initialQty.toFixed(2)} Goj</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">{workType || "Work"} Done:</span>
          <span>{lotStatus[workType]?.toFixed(2) || 0} Goj</span>
        </div>

        <div
          className={`flex justify-between font-semibold px-3 py-2 rounded-md border ${
            remaining < (parseFloat(qty) || 0)
              ? "bg-red-50 text-red-700 border-red-300"
              : "bg-green-50 text-green-700 border-green-300"
          }`}
        >
          <span>Remaining:</span>
          <span>{remaining.toFixed(2)} Goj</span>
        </div>
      </div>

      <div className="mb-4 h-96 w-full flex flex-col items-center justify-center">
        <Pie
          data={chartData}
          options={{
            plugins: {
              legend: { position: "right" },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return chartData.labels[tooltipItem.dataIndex];
                  },
                },
              },
            },
          }}
        />
      </div>

      {qty && (
        <div className="mt-4 text-sm text-center text-gray-600">
          <span className="italic">
            Demanding: <strong>{qty}</strong> Goj (
            {remaining < qty ? "❌ Exceeds" : "✅ Available"})
          </span>
        </div>
      )}
    </div>
  );
};

export default LotStatusPanel;
