import React, { useEffect, useState } from "react";

export default function DeliveryForm() {
  const [lot, setLot] = useState("");
  const [rows, setRows] = useState([]);
  const [finishingValues, setFinishingValues] = useState({});

  const fetchData = () => {
    fetch(`https://hcml-ry8s.vercel.app/griegein/delivarythan?lot=${lot}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        const initialValues = {};
        data.forEach((item) => (initialValues[item.row] = ""));
        setFinishingValues(initialValues);
      });
  };

  const handleInputChange = (row, value) => {
    setFinishingValues((prev) => ({ ...prev, [row]: value }));
  };

  const handleSubmit = () => {
    const dataToSubmit = rows
      .filter((row) => finishingValues[row.row])
      .map((row) => ({
        row: row.row,
        finishing: finishingValues[row.row],
      }));

    fetch("https://hcml-ry8s.vercel.app/griegein/thanpost", {
      method: "POST",
      body: JSON.stringify(dataToSubmit),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.text())
      .then((res) => {
        alert("Delivery updated successfully!");
        setLot("");
        setRows([]);
        setFinishingValues({});
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Delivery Entry Form</h2>
      <input
        type="text"
        placeholder="Enter Lot Number"
        value={lot}
        onChange={(e) => setLot(e.target.value)}
        className="border px-2 py-1 mb-3"
      />
      <button
        onClick={fetchData}
        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Fetch
      </button>

      {rows.length > 0 && (
        <table className="mt-4 border w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">GRIEGE</th>
              <th className="border px-2 py-1">FINISHING</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.row}>
                <td className="border px-2 py-1">{row.griege}</td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={finishingValues[row.row]}
                    onChange={(e) => handleInputChange(row.row, e.target.value)}
                    className="border px-2 py-1 w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rows.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Delivery
        </button>
      )}
    </div>
  );
}
