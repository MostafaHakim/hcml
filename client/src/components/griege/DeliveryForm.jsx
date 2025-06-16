import React, { useState } from "react";

export default function DeliveryForm() {
  const [lot, setLot] = useState("");
  const [rows, setRows] = useState([]);
  const [finishingValues, setFinishingValues] = useState({});
  const [colorValues, setColorValues] = useState({});
  const [colorOptions] = useState(["Red", "Blue", "Green", "Yellow", "Black"]);

  const fetchData = () => {
    if (!lot) {
      alert("Please enter a Lot Number");
      return;
    }

    fetch(`https://hcml-ry8s.vercel.app/griegein/delivarythan?lot=${lot}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        const initialFinishing = {};
        const initialColors = {};
        data.forEach((item) => {
          initialFinishing[item.row] = "";
          initialColors[item.row] = "";
        });
        setFinishingValues(initialFinishing);
        setColorValues(initialColors);
      })
      .catch((err) => {
        console.error("Error fetching delivery data:", err);
        alert("Failed to load data");
      });
  };

  const handleFinishingChange = (row, value) => {
    setFinishingValues((prev) => ({ ...prev, [row]: value }));
  };

  const handleColorChange = (row, value) => {
    setColorValues((prev) => ({ ...prev, [row]: value }));
  };

  const handleSubmit = () => {
    const dataToSubmit = rows
      .filter((row) => finishingValues[row.row] && colorValues[row.row])
      .map((row) => ({
        row: row.row,
        finishing: finishingValues[row.row],
        color: colorValues[row.row],
      }));

    if (dataToSubmit.length === 0) {
      alert("Please fill at least one Finishing and Color.");
      return;
    }

    fetch("https://hcml-ry8s.vercel.app/griegein/thanpost", {
      method: "POST",
      body: JSON.stringify(dataToSubmit),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((res) => {
        alert("Delivery submitted successfully!");
        setLot("");
        setRows([]);
        setFinishingValues({});
        setColorValues({});
      })
      .catch((err) => {
        console.error("Error submitting data:", err);
        alert("Submission failed");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Delivery Entry</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          placeholder="Enter Lot Number"
          className="border px-2 py-1 w-1/2"
        />
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Fetch
        </button>
      </div>

      {rows.length > 0 && (
        <>
          <table className="w-full border border-collapse mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">GRIEGE</th>
                <th className="border px-2 py-1">FINISHING</th>
                <th className="border px-2 py-1">COLOR</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.row}>
                  <td className="border px-2 py-1">{row.griege}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      step="0.01"
                      value={finishingValues[row.row]}
                      onChange={(e) =>
                        handleFinishingChange(row.row, e.target.value)
                      }
                      className="border px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      value={colorValues[row.row]}
                      onChange={(e) =>
                        handleColorChange(row.row, e.target.value)
                      }
                      className="border px-2 py-1 w-full"
                    >
                      <option value="">Select Color</option>
                      {colorOptions.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Submit Delivery
          </button>
        </>
      )}
    </div>
  );
}
