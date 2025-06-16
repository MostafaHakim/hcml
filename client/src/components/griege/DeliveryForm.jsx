import React, { useEffect, useState } from "react";

export default function DeliveryForm() {
  const [lot, setLot] = useState("");
  const [rows, setRows] = useState([]);
  const [finishingValues, setFinishingValues] = useState({});
  const [colorValues, setColorValues] = useState({});
  const [splitInputs, setSplitInputs] = useState({});
  const [colorOptions] = useState(["Red", "Blue", "Green", "Yellow", "Black"]);
  const [demand, setDemand] = useState([]);

  const fetchData = () => {
    if (!lot) return alert("Please enter a Lot Number");

    fetch(`https://hcml-ry8s.vercel.app/griegein/delivarythan?lot=${lot}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.map((r) => ({ ...r, type: "main" })));
        const initFinish = {},
          initColor = {},
          initSplit = {};
        data.forEach((r) => {
          initFinish[r.row] = "";
          initColor[r.row] = r.color || "";
        });
        setFinishingValues(initFinish);
        setColorValues(initColor);
        setSplitInputs({});
      });
  };

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand`)
      .then((res) => res.json())
      .then((data) => {
        setDemand(data);
      });
  }, []);

  const addSplitRow = (parentRow) => {
    const newRow = {
      row: `${parentRow.row}_pt`,
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
    setFinishingValues((prev) => ({
      ...prev,
      [newRow.row]: "",
    }));
    setColorValues((prev) => ({
      ...prev,
      [newRow.row]: "",
    }));
  };

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

    if (submitData.length === 0) return alert("No data to submit");

    fetch("https://hcml-ry8s.vercel.app/griegein/thanpost", {
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
        setSplitInputs({});
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Delivery Entry</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={lot}
          onChange={(e) => setLot(e.target.value)}
          placeholder="Enter Lot Number"
          className="border px-2 py-1 w-1/2"
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Fetch
        </button>
      </div>
      <div className="bg-white p-4">
        {demand.map((item, i) => {
          if (item["Lot Number"] == lot)
            return (
              <div key={i}>
                <div className="grid grid-cols-2 text-start">
                  <label className="col-span-1">গ্রেঃ গ্রহনের তারিখ</label>
                  <h2 className="col-span-1">
                    {new Date(item["Date"]).toLocaleDateString().split("T")}
                  </h2>
                </div>
                <div className="grid grid-cols-2 text-start">
                  <label className="col-span-1">পার্টির নাম</label>
                  <h2 className="col-span-1">{item["Party's Name"]}</h2>
                </div>
                <div className="grid grid-cols-2 text-start">
                  <label className="col-span-1">কাপড়ের ধরন</label>
                  <h2 className="col-span-1">{item["Type"]}</h2>
                </div>
                <div className="grid grid-cols-2 text-start">
                  <label className="col-span-1">কাপড়ের ডিজাইন</label>
                  <h2 className="col-span-1">{item["Design"]}</h2>
                </div>
              </div>
            );
        })}
      </div>
      {rows.length > 0 && (
        <table className="w-full border mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">GRIEGE</th>
              <th className="border px-2 py-1">FINISHING</th>
              <th className="border px-2 py-1">COLOR</th>
              <th className="border px-2 py-1">Split?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.row}
                className={row.type === "split" ? "bg-yellow-50" : ""}
              >
                <td className="border px-2 py-1 text-center">{row.griege}</td>
                <td className="border px-2 py-1">
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
                    className="border px-2 py-1 w-full"
                  />
                </td>
                <td className="border px-2 py-1">
                  <select
                    value={colorValues[row.row]}
                    onChange={(e) =>
                      setColorValues((prev) => ({
                        ...prev,
                        [row.row]: e.target.value,
                      }))
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
                <td className="border px-2 py-1 text-center">
                  {row.type === "main" && (
                    <button
                      className="bg-orange-500 text-white px-2 py-1 rounded text-sm"
                      onClick={() => addSplitRow(row)}
                    >
                      Split
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rows.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      )}
    </div>
  );
}
