import { useState, useEffect } from "react";
import CompanyPad from "./CompanyPad";

const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

function Delivery() {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [address, setAddress] = useState("");
  const [lots, setLots] = useState([]);
  const [tables, setTables] = useState([]);
  const [comments, setComments] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [challanNo, setChallanNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [partyRes, challanRes] = await Promise.all([
          fetch(`${BASE_URL}/griegein/party`),
          fetch(`${BASE_URL}/griegein/lastchallan`),
        ]);
        const partyData = await partyRes.json();
        setParties(partyData);
        const challanData = await challanRes.json();
        setChallanNo(challanData.lastChallan || "DC-250618001");
      } catch (error) {
        console.error("Initial fetch error:", error);
        setChallanNo("DC-250618001");
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedParty) {
      setAddress("");
      return;
    }
    fetch(
      `${BASE_URL}/griegein/getaddress?party=${encodeURIComponent(
        selectedParty
      )}`
    )
      .then((res) => res.json())
      .then((data) => setAddress(data?.address || ""))
      .catch(() => setAddress(""));
  }, [selectedParty]);

  const handlePartyChange = async (party) => {
    setSelectedParty(party);
    setTables([]);
    try {
      const lotRes = await fetch(
        `${BASE_URL}/griegein/getlots?party=${encodeURIComponent(party)}`
      );
      const lotData = await lotRes.json();
      setLots(lotData);
    } catch (error) {
      console.error("Error fetching lots:", error);
      alert("Failed to load lots.");
    }
  };

  const addTable = () => {
    setTables((prev) => [
      ...prev,
      { lot: "", type: "", design: "", color: "", colorOptions: [], rows: [] },
    ]);
  };

  const removeTable = (index) => {
    setTables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLotChange = async (lot, index) => {
    try {
      const [infoRes, colorRes] = await Promise.all([
        fetch(`${BASE_URL}/griegein/getlotinfo?lot=${encodeURIComponent(lot)}`),
        fetch(`${BASE_URL}/griegein/colorres?lot=${encodeURIComponent(lot)}`),
      ]);
      const lotInfo = await infoRes.json();
      const colorData = await colorRes.json();
      setTables((prev) => {
        const t = [...prev];
        t[index] = {
          ...t[index],
          lot,
          type: lotInfo?.info?.type || "",
          design: lotInfo?.info?.design || "",
          color: "",
          colorOptions: colorData?.colors || [],
          rows: [],
        };
        return t;
      });
    } catch (error) {
      console.error("handleLotChange error:", error);
      alert("Could not load lot info");
    }
  };

  const handleColorChange = async (color, index) => {
    try {
      const lot = tables[index].lot;
      const detailRes = await fetch(
        `${BASE_URL}/griegein/detailsres?lot=${lot}&color=${encodeURIComponent(
          color
        )}`
      );
      const detailData = await detailRes.json();
      const validRows = detailData.rows.filter(
        (row) => row.finishing !== "" && row.status !== "Delivered"
      );
      setTables((prev) => {
        const t = [...prev];
        t[index] = { ...t[index], color, rows: validRows };
        return t;
      });
    } catch (error) {
      console.error("handleColorChange error:", error);
      alert("Color loading failed: " + error.message);
    }
  };

  const calculateTableTotals = (rows) => {
    let totalGreige = 0,
      totalFinishing = 0;
    rows.forEach(({ griege, finishing }) => {
      const g = parseFloat(griege);
      const f = parseFloat(finishing);
      if (!isNaN(g)) totalGreige += g;
      if (!isNaN(f)) totalFinishing += f;
    });
    return {
      totalGreige: totalGreige.toFixed(2),
      totalFinishing: totalFinishing.toFixed(2),
    };
  };

  const getSummary = () => {
    const summary = {};
    tables.forEach(({ type, rows }) => {
      if (!type || rows.length === 0) return;
      const key = `${type}`;
      if (!summary[key]) summary[key] = { type, greige: 0, finishing: 0 };
      rows.forEach(({ griege, finishing }) => {
        const g = parseFloat(griege);
        const f = parseFloat(finishing);
        if (!isNaN(g)) summary[key].greige += g;
        if (!isNaN(f)) summary[key].finishing += f;
      });
    });
    return Object.values(summary);
  };

  const payload = {
    deliveryDate,
    challanNo,
    selectedParty,
    tables,
    deliveredBy: localStorage.getItem("username"),
    comments,
  };

  const DeliveryUpdate = async () => {
    try {
      await fetch(`${BASE_URL}/griegein/delivarydata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!tables.some((t) => t.rows.length > 0)) {
      alert("No valid data to submit.");
      return;
    }
    setIsSubmitting(true);
    try {
      for (const table of tables) {
        if (table.lot && table.color && table.rows.length > 0) {
          const res = await fetch(`${BASE_URL}/griegein/griegeupdate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lot: table.lot, color: table.color }),
          });
          if (!res.ok) throw new Error(await res.text());
        }
      }
      await DeliveryUpdate();
      alert("Status updated to Delivered.");
      setTables([]);
      setSelectedParty("");
      setLots([]);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Submit failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">
      <div className="w-full max-w-6xl flex flex-col items-center bg-white">
        {isSubmitting && (
          <div className="fixed inset-0 bg-gray-100 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-16 w-16"></div>
            <p className="ml-4 text-lg font-semibold">Submitting...</p>
          </div>
        )}

        <div className="w-full flex flex-col items-center justify-center p-2 bg-opacity-30 bg-white">
          <div className="w-full flex flex-col items-center justify-center p-6">
            <div className="w-full p-6 bg-opacity-30 bg-white">
              <CompanyPad needUseFor={"Create Delivary"} />
              <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2">
                <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
                  <label className="font-semibold text-gray-700 col-span-1">
                    Delivery Date:
                  </label>
                  <input
                    type="date"
                    className="col-span-2 border border-gray-300 rounded px-3 py-2"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
                  <label className="font-semibold text-gray-700 col-span-1">
                    Challan No:
                  </label>
                  <input
                    className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    value={challanNo}
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
                  <label className="font-semibold text-gray-700 col-span-1">
                    Party's Name:
                  </label>
                  <select
                    className="col-span-2 border border-gray-300 rounded px-3 py-2"
                    value={selectedParty}
                    onChange={(e) => handlePartyChange(e.target.value)}
                  >
                    <option value="">Select Party</option>
                    {parties.map((p, i) => (
                      <option key={i} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
                  <label className="font-semibold text-gray-700 col-span-1">
                    Address:
                  </label>
                  <input
                    className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    value={address}
                    readOnly
                  />
                </div>
                {selectedParty && (
                  <button
                    onClick={addTable}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + Add Table
                  </button>
                )}
              </div>

              <div className="grid grid-cols-5 gap-4">
                {tables.map((table, tIndex) => {
                  const { totalGreige, totalFinishing } = calculateTableTotals(
                    table.rows
                  );

                  return (
                    <div
                      key={tIndex}
                      className="bg-white p-4 rounded shadow border col-span-1 relative text-sm"
                    >
                      <button
                        className="absolute top-1 right-1 text-red-500 font-bold"
                        onClick={() => removeTable(tIndex)}
                      >
                        ✕
                      </button>

                      <div className="grid grid-cols-2 items-center justify-between text-left text-sm">
                        <label className="text-sm font-mono">Lot Number</label>
                        <select
                          className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
                          value={table.lot}
                          onChange={(e) =>
                            handleLotChange(e.target.value, tIndex)
                          }
                        >
                          <option value="">Select Lot</option>
                          {lots.map((lot, i) => (
                            <option className="text-sm" key={i} value={lot}>
                              {lot}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 items-center justify-between text-left">
                        <label className="text-sm font-mono">Type</label>
                        <input
                          value={table.type}
                          readOnly
                          className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 items-center justify-between text-left">
                        <label className="text-sm font-mono ">Design</label>
                        <input
                          value={table.design}
                          readOnly
                          className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 items-center justify-between text-left">
                        <label className="text-sm font-mono">Color</label>
                        <select
                          className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
                          value={table.color}
                          onChange={(e) =>
                            handleColorChange(e.target.value, tIndex)
                          }
                        >
                          <option value="">Select Color</option>
                          {table.colorOptions.map((color, i) => (
                            <option className="text-sm" key={i} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 font-semibold text-gray-600 mb-1 text-sm">
                        <div>Greige</div>
                        <div>Finishing</div>
                      </div>
                      {table.rows.map((row, rIndex) => (
                        <div
                          key={rIndex}
                          className="grid grid-cols-2 gap-2 mb-1"
                        >
                          <input
                            value={row.griege}
                            readOnly
                            className="border px-2 py-1 rounded bg-gray-100"
                          />
                          <input
                            value={row.finishing}
                            readOnly
                            className="border px-2 py-1 rounded bg-gray-100"
                          />
                        </div>
                      ))}

                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="font-semibold">Greige:</div>
                          <div className="text-right font-medium">
                            {totalGreige}
                          </div>
                          <div className="font-semibold">Finishing:</div>
                          <div className="text-right font-medium">
                            {totalFinishing}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {tables.length > 0 && (
                <>
                  <div className="mt-8 bg-white p-4 rounded shadow w-full">
                    <h2 className="text-lg font-bold mb-4">Summary</h2>
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-gray-200 text-center">
                          <th className="border px-2 py-1">Type</th>
                          <th className="border px-2 py-1">
                            Greige Total (Gaj)
                          </th>
                          <th className="border px-2 py-1">
                            Finishing Total (Gaj)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSummary().map((item, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">{item.type}</td>
                            <td className="border px-2 py-1">
                              {item.greige.toFixed(2)}
                            </td>
                            <td className="border px-2 py-1">
                              {item.finishing.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 w-full">
                    <label className="font-semibold text-gray-700 block mb-2">
                      Comments:
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter any additional comments..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4 p-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
