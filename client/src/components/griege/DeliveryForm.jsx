import React, { useEffect, useState } from "react";

export default function DeliveryForm() {
  const [lot, setLot] = useState("");
  const [rows, setRows] = useState([]);
  const [finishingValues, setFinishingValues] = useState({});
  const [colorValues, setColorValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [demand, setDemand] = useState([]);
  const colorOptions = ["Red", "Blue", "Green", "Yellow", "Black"];
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/demand`)
      .then((res) => res.json())
      .then((data) => setDemand(data));
  }, []);

  const fetchData = () => {
    if (!lot) return alert("Please enter a Lot Number");

    setLoading(true);
    fetch(`${BASE_URL}/griegein/delivarythan?lot=${lot}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.map((r) => ({ ...r, type: "main" })));
        const initFinish = {},
          initColor = {};
        data.forEach((r) => {
          initFinish[r.row] = "";
          initColor[r.row] = r.color || "";
        });
        setFinishingValues(initFinish);
        setColorValues(initColor);
        setLoading(false);
      });
  };

  const addSplitRow = (parentRow) => {
    const childCount = rows.filter((r) => r.parent === parentRow.row).length;

    const newRow = {
      row: `${parentRow.row}_pt${childCount + 1}`,
      parent: parentRow.row,
      griege: "PT",
      type: "split",
    };

    const updatedRows = [];
    for (let row of rows) {
      updatedRows.push(row);
      if (row.row === parentRow.row) {
        updatedRows.push(newRow);
      }
    }

    setRows(updatedRows);
    setFinishingValues((prev) => ({ ...prev, [newRow.row]: "" }));
    setColorValues((prev) => ({ ...prev, [newRow.row]: "" }));
  };

  const isAnyValidRow = rows.some(
    (row) => finishingValues[row.row] && colorValues[row.row]
  );

  const handleSubmit = () => {
    const submitData = rows
      .filter((row) => finishingValues[row.row] && colorValues[row.row])
      .map((row) => ({
        row: row.row,
        griege: row.griege === "PT" ? "PT" : parseFloat(row.griege),
        finishing: parseFloat(finishingValues[row.row]),
        color: colorValues[row.row],
        lot: lot,
        status: row.griege === "PT" ? "PT" : "",
      }));

    if (submitData.length === 0) {
      alert("No valid data to submit");
      return;
    }

    fetch(`${BASE_URL}/griegein/thanpost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    })
      .then((res) => res.text())
      .then(() => {
        alert("Submitted!");
        setLot("");
        setRows([]);
        setFinishingValues({});
        setColorValues({});
      });
  };

  const matchedDemand = demand.find(
    (item) => item["Lot Number"]?.toString().toLowerCase() === lot.toLowerCase()
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow rounded">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Delivery Entry
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          placeholder="Enter Lot Number"
          className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {matchedDemand && (
        <div className="bg-white p-4 border rounded mb-4 space-y-2">
          <p>
            <strong>গ্রেঃ গ্রহনের তারিখ:</strong>{" "}
            {new Date(matchedDemand["Date"]).toLocaleDateString()}
          </p>
          <p>
            <strong>পার্টির নাম:</strong> {matchedDemand["Party's Name"]}
          </p>
          <p>
            <strong>কাপড়ের ধরন:</strong> {matchedDemand["Type"]}
          </p>
          <p>
            <strong>কাপড়ের ডিজাইন:</strong> {matchedDemand["Design"]}
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2">GRIEGE</th>
                <th className="border px-3 py-2">FINISHING</th>
                <th className="border px-3 py-2">COLOR</th>
                <th className="border px-3 py-2">SPLIT?</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.row}
                  className={`${
                    row.type === "split"
                      ? "bg-yellow-50 border-dashed border-t-2"
                      : "bg-white"
                  }`}
                >
                  <td className="border px-3 py-2 text-center">{row.griege}</td>
                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={finishingValues[row.row]}
                      onChange={(e) =>
                        setFinishingValues((prev) => ({
                          ...prev,
                          [row.row]: e.target.value,
                        }))
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <select
                      value={colorValues[row.row]}
                      onChange={(e) =>
                        setColorValues((prev) => ({
                          ...prev,
                          [row.row]: e.target.value,
                        }))
                      }
                      className="w-full border px-2 py-1 rounded"
                    >
                      <option value="">Select Color</option>
                      {colorOptions.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {row.type === "main" && (
                      <button
                        onClick={() => addSplitRow(row)}
                        className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                      >
                        Split
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={!isAnyValidRow}
          className={`px-6 py-2 rounded text-white ${
            isAnyValidRow
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      )}
    </div>
  );
}
