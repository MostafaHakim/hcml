// import React, { useState, useEffect } from "react";

// const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

// function Delivery() {
//   const [parties, setParties] = useState([]);
//   const [selectedParty, setSelectedParty] = useState("");
//   const [address, setAddress] = useState("");
//   const [lots, setLots] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [comments, setComments] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().substr(0, 10);
//   });
//   const [challanNo, setChallanNo] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetch(`${baseUrl}/party`)
//       .then((res) => res.json())
//       .then((data) => setParties(data))
//       .catch((error) => {
//         console.error("Error fetching parties:", error);
//         alert("Failed to load parties. Please try again.");
//       });

//     fetch(`${baseUrl}/lastchallan`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.lastChallan) {
//           setChallanNo(data.lastChallan);
//         } else {
//           setChallanNo("DC-250618001");
//         }
//       })
//       .catch((err) => {
//         console.error("Challan fetch error:", err);
//         setChallanNo("DC-250618001");
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedParty) {
//       setAddress("");
//       return;
//     }

//     fetch(`${baseUrl}/getaddress?party=${encodeURIComponent(selectedParty)}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setAddress(data.address || "");
//       })
//       .catch((err) => {
//         console.error("Address fetch error:", err);
//         setAddress("");
//       });
//   }, [selectedParty]);

//   const handlePartyChange = async (party) => {
//     setSelectedParty(party);
//     setTables([]);
//     try {
//       const lotRes = await fetch(
//         `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
//       );
//       if (!lotRes.ok) throw new Error("Failed to fetch lots");
//       const lotData = await lotRes.json();
//       setLots(lotData);
//     } catch (error) {
//       console.error("Error fetching lots or address:", error);
//       alert("Failed to load lots/address.");
//     }
//   };

//   const addTable = () => {
//     setTables([
//       ...tables,
//       { lot: "", type: "", design: "", color: "", colorOptions: [], rows: [] },
//     ]);
//   };

//   const removeTable = (index) => {
//     const newTables = [...tables];
//     newTables.splice(index, 1);
//     setTables(newTables);
//   };

//   const handleLotChange = async (lot, index) => {
//     try {
//       const infoRes = await fetch(
//         `${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`
//       );
//       const colorRes = await fetch(
//         `${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`
//       );

//       const [lotInfo, colorData] = await Promise.all([
//         infoRes.json(),
//         colorRes.json(),
//       ]);

//       const newTables = [...tables];
//       newTables[index] = {
//         ...newTables[index],
//         lot,
//         type: lotInfo.info?.type || "",
//         design: lotInfo.info?.design || "",
//         color: "",
//         colorOptions: colorData.colors || [],
//         rows: [],
//       };
//       setTables(newTables);
//     } catch (error) {
//       console.error("Error in handleLotChange:", error);
//       alert("Error loading lot info: " + error.message);
//     }
//   };

//   const handleColorChange = async (color, index) => {
//     try {
//       const lot = tables[index].lot;
//       const detailRes = await fetch(
//         `${baseUrl}/detailsres?lot=${lot}&color=${encodeURIComponent(color)}`
//       );
//       if (!detailRes.ok) throw new Error("Failed to fetch details");
//       const detailData = await detailRes.json();

//       const validRows = detailData.rows.filter(
//         (row) => row.finishing !== "" && row.status !== "Delivered"
//       );

//       const newTables = [...tables];
//       newTables[index] = {
//         ...newTables[index],
//         color,
//         rows: validRows,
//       };
//       setTables(newTables);
//     } catch (error) {
//       console.error("Error in handleColorChange:", error);
//       alert("Error: " + error.message);
//     }
//   };

//   // ✅ UPDATED: PT বা NaN হলে বাদ দিবে
//   const calculateTableTotals = (rows) => {
//     let totalGreige = 0;
//     let totalFinishing = 0;

//     rows.forEach((row) => {
//       const greige = parseFloat(row.griege);
//       const finishing = parseFloat(row.finishing);

//       if (!isNaN(greige)) totalGreige += greige;
//       if (!isNaN(finishing)) totalFinishing += finishing;
//     });

//     return {
//       totalGreige: totalGreige.toFixed(2),
//       totalFinishing: totalFinishing.toFixed(2),
//     };
//   };

//   const getSummary = () => {
//     const summaryMap = {};
//     tables.forEach((table) => {
//       if (!table.lot || !table.type || table.rows.length === 0) return;
//       const key = `${table.lot}__${table.type}`;
//       if (!summaryMap[key]) {
//         summaryMap[key] = {
//           lot: table.lot,
//           type: table.type,
//           greige: 0,
//           finishing: 0,
//         };
//       }
//       table.rows.forEach((row) => {
//         const greige = parseFloat(row.griege);
//         const finishing = parseFloat(row.finishing);
//         if (!isNaN(greige)) summaryMap[key].greige += greige;
//         if (!isNaN(finishing)) summaryMap[key].finishing += finishing;
//       });
//     });
//     return Object.values(summaryMap);
//   };

//   const handleSubmit = async () => {
//     if (tables.length === 0 || !tables.some((table) => table.rows.length > 0)) {
//       alert("No valid data to submit. Please select a lot and color.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       for (const table of tables) {
//         if (table.rows.length > 0 && table.lot && table.color) {
//           const response = await fetch(`${baseUrl}/griegeupdate`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ lot: table.lot, color: table.color }),
//           });
//           if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Failed to update: ${errorText}`);
//           }
//         }
//       }
//       alert("Status updated to Delivered and saved.");
//       setTables([]);
//       setSelectedParty("");
//       setLots([]);
//     } catch (error) {
//       console.error("Submit error:", error);
//       alert("Submit failed: " + error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-[1280px] p-6 bg-opacity-30 bg-white">
//         <div className="bg-white p-4 rounded shadow mb-6">
//           {/* Form Fields */}
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <label className="font-semibold text-gray-700 col-span-1">
//               Delivery Date:
//             </label>
//             <input
//               type="date"
//               className="col-span-2 border border-gray-300 rounded px-3 py-2"
//               value={deliveryDate}
//               onChange={(e) => setDeliveryDate(e.target.value)}
//             />
//           </div>
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <label className="font-semibold text-gray-700 col-span-1">
//               Challan No:
//             </label>
//             <input
//               className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//               value={challanNo}
//               readOnly
//             />
//           </div>
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <label className="font-semibold text-gray-700 col-span-1">
//               Party's Name:
//             </label>
//             <select
//               className="col-span-2 border border-gray-300 rounded px-3 py-2"
//               value={selectedParty}
//               onChange={(e) => handlePartyChange(e.target.value)}
//             >
//               <option value="">Select Party</option>
//               {parties.map((p, i) => (
//                 <option key={i} value={p}>
//                   {p}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <label className="font-semibold text-gray-700 col-span-1">
//               Address:
//             </label>
//             <input
//               className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//               value={address}
//               readOnly
//             />
//           </div>
//           {selectedParty && (
//             <button
//               onClick={addTable}
//               className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               + Add Table
//             </button>
//           )}
//         </div>

//         {/* Table Grid */}
//         <div className="grid grid-cols-5 gap-4">
//           {tables.map((table, tIndex) => {
//             const { totalGreige, totalFinishing } = calculateTableTotals(
//               table.rows
//             );

//             return (
//               <div
//                 key={tIndex}
//                 className="bg-white p-4 rounded shadow border col-span-1 relative"
//               >
//                 <button
//                   className="absolute top-1 right-1 text-red-500 font-bold"
//                   onClick={() => removeTable(tIndex)}
//                 >
//                   ✕
//                 </button>

//                 <select
//                   className="mb-2 w-full border px-2 py-1 rounded"
//                   value={table.lot}
//                   onChange={(e) => handleLotChange(e.target.value, tIndex)}
//                 >
//                   <option value="">Select Lot</option>
//                   {lots.map((lot, i) => (
//                     <option key={i} value={lot}>
//                       {lot}
//                     </option>
//                   ))}
//                 </select>

//                 <input
//                   value={table.type}
//                   readOnly
//                   className="mb-2 w-full border px-2 py-1 rounded bg-gray-100"
//                   placeholder="Type"
//                 />
//                 <input
//                   value={table.design}
//                   readOnly
//                   className="mb-2 w-full border px-2 py-1 rounded bg-gray-100"
//                   placeholder="Design"
//                 />

//                 <select
//                   className="mb-2 w-full border px-2 py-1 rounded"
//                   value={table.color}
//                   onChange={(e) => handleColorChange(e.target.value, tIndex)}
//                 >
//                   <option value="">Select Color</option>
//                   {table.colorOptions.map((color, i) => (
//                     <option key={i} value={color}>
//                       {color}
//                     </option>
//                   ))}
//                 </select>

//                 <div className="grid grid-cols-2 gap-2 font-semibold text-gray-600 mb-1">
//                   <div>Greige</div>
//                   <div>Finishing</div>
//                 </div>
//                 {table.rows.map((row, rIndex) => (
//                   <div key={rIndex} className="grid grid-cols-2 gap-2 mb-1">
//                     <input
//                       value={row.griege}
//                       readOnly
//                       className="border px-2 py-1 rounded bg-gray-100"
//                     />
//                     <input
//                       value={row.finishing}
//                       readOnly
//                       className="border px-2 py-1 rounded bg-gray-100"
//                     />
//                   </div>
//                 ))}

//                 <div className="mt-2 pt-2 border-t border-gray-300">
//                   <div className="grid grid-cols-2 gap-1">
//                     <div className="font-semibold">Greige:</div>
//                     <div className="text-right font-medium">{totalGreige}</div>
//                     <div className="font-semibold">Finishing:</div>
//                     <div className="text-right font-medium">
//                       {totalFinishing}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Summary and Submit */}
//         {tables.length > 0 && (
//           <>
//             <div className="mt-8 bg-white p-4 rounded shadow w-full">
//               <h2 className="text-lg font-bold mb-4">Summary</h2>
//               <table className="w-full table-auto border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200 text-left">
//                     <th className="border px-2 py-1">Lot</th>
//                     <th className="border px-2 py-1">Type</th>
//                     <th className="border px-2 py-1">Greige Total (Gaj)</th>
//                     <th className="border px-2 py-1">Finishing Total (Gaj)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {getSummary().map((item, idx) => (
//                     <tr key={idx}>
//                       <td className="border px-2 py-1">{item.lot}</td>
//                       <td className="border px-2 py-1">{item.type}</td>
//                       <td className="border px-2 py-1">
//                         {item.greige.toFixed(2)}
//                       </td>
//                       <td className="border px-2 py-1">
//                         {item.finishing.toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="mt-6 w-full">
//               <label className="font-semibold text-gray-700 block mb-2">
//                 Comments:
//               </label>
//               <textarea
//                 rows={3}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//                 value={comments}
//                 onChange={(e) => setComments(e.target.value)}
//                 placeholder="Enter any additional comments..."
//               />
//             </div>
//             <div className="mt-6 flex justify-center">
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 ${
//                   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Delivery;

// unchanged imports and baseUrl
import React, { useState, useEffect } from "react";

const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

function Delivery() {
  // State declarations: unchanged

  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [address, setAddress] = useState("");
  const [lots, setLots] = useState([]);
  const [tables, setTables] = useState([]);
  const [comments, setComments] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().substr(0, 10);
  });
  const [challanNo, setChallanNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch party and challan
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [partyRes, challanRes] = await Promise.all([
          fetch(`${baseUrl}/party`),
          fetch(`${baseUrl}/lastchallan`),
        ]);

        const partyData = await partyRes.json();
        setParties(partyData);

        const challanData = await challanRes.json();
        setChallanNo(challanData.lastChallan || "DC-250618001");
      } catch (error) {
        console.error("Initial fetch error:", error);
        alert("Initial data loading failed.");
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

    fetch(`${baseUrl}/getaddress?party=${encodeURIComponent(selectedParty)}`)
      .then((res) => res.json())
      .then((data) => setAddress(data?.address || ""))
      .catch((err) => {
        console.error("Address fetch error:", err);
        setAddress("");
      });
  }, [selectedParty]);

  const handlePartyChange = async (party) => {
    setSelectedParty(party);
    setTables([]);

    try {
      const lotRes = await fetch(
        `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
      );
      if (!lotRes.ok) throw new Error("Failed to fetch lots");
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
        fetch(`${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`),
        fetch(`${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`),
      ]);

      const [lotInfo, colorData] = await Promise.all([
        infoRes.json(),
        colorRes.json(),
      ]);

      const newTables = [...tables];
      newTables[index] = {
        ...newTables[index],
        lot,
        type: lotInfo?.info?.type || "",
        design: lotInfo?.info?.design || "",
        color: "",
        colorOptions: colorData?.colors || [],
        rows: [],
      };
      setTables(newTables);
    } catch (error) {
      console.error("handleLotChange error:", error);
      alert("Could not load lot info");
    }
  };

  const handleColorChange = async (color, index) => {
    try {
      const lot = tables[index].lot;
      const detailRes = await fetch(
        `${baseUrl}/detailsres?lot=${lot}&color=${encodeURIComponent(color)}`
      );
      if (!detailRes.ok) throw new Error("Failed to fetch details");
      const detailData = await detailRes.json();

      const validRows = detailData.rows.filter(
        (row) => row.finishing !== "" && row.status !== "Delivered"
      );

      const newTables = [...tables];
      newTables[index] = {
        ...newTables[index],
        color,
        rows: validRows,
      };
      setTables(newTables);
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
    tables.forEach(({ lot, type, rows }) => {
      if (!lot || !type || rows.length === 0) return;

      const key = `${lot}__${type}`;
      if (!summary[key]) summary[key] = { lot, type, greige: 0, finishing: 0 };

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
    partyName,
    tableData, // array of tables
    deliveredBy: localStorage.getItem("username"),
    comments,
  };
  const DeliveryUpdate = async () => {
    try {
      await fetch(`${baseUrl}/delivarydata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error, error;
    }
  };
  // ===============================Submit++++++++++++++++++++++++++++++++++++++++
  const handleSubmit = async () => {
    if (!tables.some((t) => t.rows.length > 0)) {
      alert("No valid data to submit.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const table of tables) {
        if (table.lot && table.color && table.rows.length > 0) {
          const res = await fetch(`${baseUrl}/griegeupdate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lot: table.lot, color: table.color }),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error updating: ${text}`);
          }
          await DeliveryUpdate();
        }
      }

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
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[1280px] p-6 bg-opacity-30 bg-white">
        <div className="bg-white p-4 rounded shadow mb-6">
          {/* Form Fields */}
          <div className="grid grid-cols-3 gap-4 mb-4">
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
          <div className="grid grid-cols-3 gap-4 mb-4">
            <label className="font-semibold text-gray-700 col-span-1">
              Challan No:
            </label>
            <input
              className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
              value={challanNo}
              readOnly
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
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
          <div className="grid grid-cols-3 gap-4 mb-4">
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

        {/* Table Grid */}
        <div className="grid grid-cols-5 gap-4">
          {tables.map((table, tIndex) => {
            const { totalGreige, totalFinishing } = calculateTableTotals(
              table.rows
            );

            return (
              <div
                key={tIndex}
                className="bg-white p-4 rounded shadow border col-span-1 relative"
              >
                <button
                  className="absolute top-1 right-1 text-red-500 font-bold"
                  onClick={() => removeTable(tIndex)}
                >
                  ✕
                </button>

                <select
                  className="mb-2 w-full border px-2 py-1 rounded"
                  value={table.lot}
                  onChange={(e) => handleLotChange(e.target.value, tIndex)}
                >
                  <option value="">Select Lot</option>
                  {lots.map((lot, i) => (
                    <option key={i} value={lot}>
                      {lot}
                    </option>
                  ))}
                </select>

                <input
                  value={table.type}
                  readOnly
                  className="mb-2 w-full border px-2 py-1 rounded bg-gray-100"
                  placeholder="Type"
                />
                <input
                  value={table.design}
                  readOnly
                  className="mb-2 w-full border px-2 py-1 rounded bg-gray-100"
                  placeholder="Design"
                />

                <select
                  className="mb-2 w-full border px-2 py-1 rounded"
                  value={table.color}
                  onChange={(e) => handleColorChange(e.target.value, tIndex)}
                >
                  <option value="">Select Color</option>
                  {table.colorOptions.map((color, i) => (
                    <option key={i} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2 font-semibold text-gray-600 mb-1">
                  <div>Greige</div>
                  <div>Finishing</div>
                </div>
                {table.rows.map((row, rIndex) => (
                  <div key={rIndex} className="grid grid-cols-2 gap-2 mb-1">
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
                    <div className="text-right font-medium">{totalGreige}</div>
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

        {/* Summary and Submit */}
        {tables.length > 0 && (
          <>
            <div className="mt-8 bg-white p-4 rounded shadow w-full">
              <h2 className="text-lg font-bold mb-4">Summary</h2>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border px-2 py-1">Lot</th>
                    <th className="border px-2 py-1">Type</th>
                    <th className="border px-2 py-1">Greige Total (Gaj)</th>
                    <th className="border px-2 py-1">Finishing Total (Gaj)</th>
                  </tr>
                </thead>
                <tbody>
                  {getSummary().map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.lot}</td>
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
            <div className="mt-6 flex justify-center">
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
          </>
        )}
      </div>
    </div>
  );
}
export default Delivery;
