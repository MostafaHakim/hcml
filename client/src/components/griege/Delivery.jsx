// import React, { useState, useEffect } from "react";

// const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

// function Delivery() {
//   const [parties, setParties] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [selectedParty, setSelectedParty] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load Party Names initially
//   useEffect(() => {
//     fetch(`${baseUrl}/party`)
//       .then((res) => res.json())
//       .then((data) => setParties(data))
//       .catch((error) => {
//         console.error("Error fetching parties:", error);
//         alert("Failed to load parties. Please try again.");
//       });
//   }, []);

//   const handlePartyChange = async (party) => {
//     setSelectedParty(party);
//     try {
//       const lotRes = await fetch(
//         `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
//       );
//       if (!lotRes.ok) throw new Error("Failed to fetch lots");
//       const lotData = await lotRes.json();

//       const tableList = await Promise.all(
//         lotData.map(async (lot) => {
//           const lotInfoRes = await fetch(
//             `${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`
//           );
//           if (!lotInfoRes.ok) throw new Error("Failed to fetch lot info");
//           const lotInfo = await lotInfoRes.json();

//           const colorRes = await fetch(
//             `${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`
//           );
//           if (!colorRes.ok) throw new Error("Failed to fetch colors");
//           const colors = await colorRes.json();

//           return {
//             lot,
//             type: lotInfo.info.type || "",
//             design: lotInfo.info.design || "",
//             color: "",
//             colorOptions: colors.colors || [],
//             rows: [],
//           };
//         })
//       );

//       setTables(tableList);
//     } catch (error) {
//       console.error("Error in handlePartyChange:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleColorChange = async (color, tableIndex) => {
//     try {
//       const lot = tables[tableIndex].lot;
//       const detailRes = await fetch(
//         `${baseUrl}/detailsres?lot=${lot}&color=${encodeURIComponent(color)}`
//       );
//       if (!detailRes.ok) throw new Error("Failed to fetch details");
//       const detailData = await detailRes.json();

//       const validRows = detailData.rows.filter(
//         (row) => row.finishing !== "" && row.status !== "Delivered"
//       );

//       const newTables = [...tables];
//       newTables[tableIndex].color = color;
//       newTables[tableIndex].rows = validRows;
//       setTables(newTables);
//     } catch (error) {
//       console.error("Error in handleColorChange:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleSubmit = async () => {
//     if (tables.length === 0 || !tables.some((table) => table.rows.length > 0)) {
//       alert("No valid data to submit. Please select a party and color.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       for (const table of tables) {
//         if (table.rows.length > 0 && table.lot && table.color) {
//           const response = await fetch(`${baseUrl}/griegeupdate`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               lot: table.lot,
//               color: table.color,
//             }),
//           });
//           console.log(response);
//           if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Failed to update: ${errorText}`);
//           }
//         }
//       }
//       alert("Status updated to Delivered and saved in DELIVERED sheet.");
//       setTables([]);
//       setSelectedParty("");
//     } catch (error) {
//       console.error("Submit error:", error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-[1280px] p-6 flex flex-col items-center bg-opacity-30 bg-white">
//         {/* Header Info */}
//         <div className="w-full max-w-[1280px] bg-white p-4 rounded shadow mb-6">
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
//         </div>

//         {/* Tables */}
//         <div className="w-full max-w-[1280px] grid grid-cols-5 gap-4">
//           {tables.map((table, tIndex) => (
//             <div
//               key={tIndex}
//               className="bg-white p-4 rounded shadow border border-gray-200 col-span-1"
//             >
//               <div className="flex flex-col space-y-2 mb-4">
//                 <input
//                   value={table.lot}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                   placeholder="Lot"
//                 />
//                 <input
//                   value={table.type}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                   placeholder="Type"
//                 />
//                 <input
//                   value={table.design}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                   placeholder="Design"
//                 />
//                 <select
//                   className="border px-2 py-1 rounded"
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
//               </div>

//               <div className="grid grid-cols-2 gap-4 font-semibold text-gray-600 mb-2">
//                 <div>Greige</div>
//                 <div>Finishing</div>
//               </div>
//               {table.rows.map((row, rIndex) => (
//                 <div key={rIndex} className="grid grid-cols-2 gap-4 mb-1">
//                   <input
//                     value={row.griege}
//                     readOnly
//                     className="border px-2 py-1 rounded bg-gray-100"
//                   />
//                   <input
//                     value={row.finishing}
//                     readOnly
//                     className="border px-2 py-1 rounded bg-gray-100"
//                   />
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         {tables.length > 0 && (
//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className={`mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
// export default Delivery;

// import React, { useState, useEffect } from "react";

// const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

// function Delivery() {
//   const [parties, setParties] = useState([]);
//   const [lots, setLots] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [selectedParty, setSelectedParty] = useState("");
//   const [selectedLot, setSelectedLot] = useState("");
//   const [colorOptions, setColorOptions] = useState([]);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetch(`${baseUrl}/party`)
//       .then((res) => res.json())
//       .then((data) => setParties(data))
//       .catch((error) => {
//         console.error("Error fetching parties:", error);
//         alert("Failed to load parties. Please try again.");
//       });
//   }, []);

//   const handlePartyChange = async (party) => {
//     setSelectedParty(party);
//     setTables([]);
//     setSelectedLot("");
//     setSelectedColor("");
//     try {
//       const lotRes = await fetch(
//         `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
//       );
//       const lotData = await lotRes.json();

//       const lotInfos = await Promise.all(
//         lotData.map(async (lot) => {
//           const res = await fetch(
//             `${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`
//           );
//           const info = await res.json();
//           return { lot, ...info.info };
//         })
//       );
//       setLots(lotInfos);
//     } catch (error) {
//       console.error("Error fetching lots:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleLotChange = async (lot) => {
//     setSelectedLot(lot);
//     setSelectedColor("");
//     setColorOptions([]);
//     if (!lot) return;
//     try {
//       const res = await fetch(
//         `${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`
//       );
//       const data = await res.json();
//       setColorOptions(data.colors || []);
//     } catch (error) {
//       console.error("Error fetching colors:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleAddTable = async () => {
//     if (!selectedLot || !selectedColor) {
//       alert("Please select both Lot and Color");
//       return;
//     }

//     const exists = tables.some(
//       (t) => t.lot === selectedLot && t.color === selectedColor
//     );
//     if (exists) {
//       alert("This Lot and Color is already added.");
//       return;
//     }

//     try {
//       const detailRes = await fetch(
//         `${baseUrl}/detailsres?lot=${selectedLot}&color=${encodeURIComponent(
//           selectedColor
//         )}`
//       );
//       const detailData = await detailRes.json();
//       const validRows = detailData.rows.filter(
//         (row) => row.finishing !== "" && row.status !== "Delivered"
//       );

//       const lotInfo = lots.find((l) => l.lot === selectedLot);

//       setTables((prev) => [
//         ...prev,
//         {
//           lot: selectedLot,
//           type: lotInfo?.type || "",
//           design: lotInfo?.design || "",
//           color: selectedColor,
//           colorOptions,
//           rows: validRows,
//         },
//       ]);
//     } catch (error) {
//       console.error("Error adding table:", error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleSubmit = async () => {
//     if (tables.length === 0 || !tables.some((t) => t.rows.length > 0)) {
//       alert("No valid data to submit.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       for (const table of tables) {
//         if (table.rows.length > 0 && table.lot && table.color) {
//           const response = await fetch(`${baseUrl}/griegeupdate`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ lot: table.lot, color: table.color }),
//           });
//           if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Failed to update: ${errorText}`);
//           }
//         }
//       }
//       alert("Status updated to Delivered and saved in DELIVERED sheet.");
//       setTables([]);
//       setSelectedParty("");
//       setSelectedLot("");
//       setSelectedColor("");
//       setLots([]);
//     } catch (error) {
//       console.error("Submit error:", error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-[1280px] p-6 bg-white bg-opacity-90 rounded shadow">
//         {/* Header - Party & Lot Selection */}
//         <div className="mb-6 space-y-4">
//           <div className="grid grid-cols-3 gap-4 items-center">
//             <label className="font-semibold text-gray-700">Party's Name:</label>
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

//           {lots.length > 0 && (
//             <div className="grid grid-cols-4 gap-4 items-end">
//               <div>
//                 <label>Lot:</label>
//                 <select
//                   className="w-full border rounded px-2 py-1"
//                   value={selectedLot}
//                   onChange={(e) => handleLotChange(e.target.value)}
//                 >
//                   <option value="">Select Lot</option>
//                   {lots.map((lot, i) => (
//                     <option key={i} value={lot.lot}>
//                       {lot.lot}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label>Color:</label>
//                 <select
//                   className="w-full border rounded px-2 py-1"
//                   value={selectedColor}
//                   onChange={(e) => setSelectedColor(e.target.value)}
//                 >
//                   <option value="">Select Color</option>
//                   {colorOptions.map((color, i) => (
//                     <option key={i} value={color}>
//                       {color}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <button
//                   onClick={handleAddTable}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tables */}
//         <div className="grid grid-cols-5 gap-4">
//           {tables.map((table, tIndex) => (
//             <div
//               key={tIndex}
//               className="bg-white p-4 rounded shadow border col-span-1"
//             >
//               <div className="flex flex-col space-y-2 mb-4">
//                 <input
//                   value={table.lot}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                 />
//                 <input
//                   value={table.type}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                 />
//                 <input
//                   value={table.design}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                 />
//                 <input
//                   value={table.color}
//                   readOnly
//                   className="border px-2 py-1 rounded bg-gray-100"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4 font-semibold text-gray-600 mb-2">
//                 <div>Greige</div>
//                 <div>Finishing</div>
//               </div>
//               {table.rows.map((row, rIndex) => (
//                 <div key={rIndex} className="grid grid-cols-2 gap-4 mb-1">
//                   <input
//                     value={row.griege}
//                     readOnly
//                     className="border px-2 py-1 rounded bg-gray-100"
//                   />
//                   <input
//                     value={row.finishing}
//                     readOnly
//                     className="border px-2 py-1 rounded bg-gray-100"
//                   />
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Submit Button */}
//         {tables.length > 0 && (
//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className={`mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Delivery;
// import React, { useState, useEffect } from "react";

// const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

// function Delivery() {
//   const [parties, setParties] = useState([]);
//   const [lots, setLots] = useState([]);
//   const [selectedParty, setSelectedParty] = useState("");
//   const [selectedLot, setSelectedLot] = useState("");
//   const [selectedLotInfo, setSelectedLotInfo] = useState({
//     type: "",
//     design: "",
//   });
//   const [selectedColor, setSelectedColor] = useState("");
//   const [colorOptions, setColorOptions] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load Party Names
//   useEffect(() => {
//     fetch(`${baseUrl}/party`)
//       .then((res) => res.json())
//       .then((data) => setParties(data))
//       .catch((err) => alert("Failed to load parties"));
//   }, []);

//   // Load lots when party selected
//   const handlePartyChange = async (party) => {
//     setSelectedParty(party);
//     setSelectedLot("");
//     setSelectedColor("");
//     setColorOptions([]);
//     setSelectedLotInfo({ type: "", design: "" });
//     setTables([]);
//     try {
//       const lotRes = await fetch(
//         `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
//       );
//       const lotData = await lotRes.json();

//       const lotDetails = await Promise.all(
//         lotData.map(async (lot) => {
//           const lotInfoRes = await fetch(
//             `${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`
//           );
//           const lotInfo = await lotInfoRes.json();
//           return {
//             lot,
//             type: lotInfo.info.type || "",
//             design: lotInfo.info.design || "",
//           };
//         })
//       );
//       setLots(lotDetails);
//     } catch (err) {
//       alert("Failed to load lots");
//     }
//   };

//   // Load lot info + color options when a lot is selected
//   const handleLotChange = async (lot) => {
//     setSelectedLot(lot);
//     const lotInfo = lots.find((l) => l.lot === lot);
//     setSelectedLotInfo({
//       type: lotInfo?.type || "",
//       design: lotInfo?.design || "",
//     });
//     try {
//       const colorRes = await fetch(
//         `${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`
//       );
//       const colorData = await colorRes.json();
//       setColorOptions(colorData.colors || []);
//     } catch (err) {
//       alert("Failed to load colors");
//     }
//   };

//   // Load row details and add table
//   const handleAddTable = async () => {
//     if (!selectedLot || !selectedColor) {
//       alert("Please select both lot and color");
//       return;
//     }
//     try {
//       const detailRes = await fetch(
//         `${baseUrl}/detailsres?lot=${selectedLot}&color=${encodeURIComponent(
//           selectedColor
//         )}`
//       );
//       const detailData = await detailRes.json();
//       const validRows = detailData.rows.filter(
//         (row) => row.finishing !== "" && row.status !== "Delivered"
//       );

//       setTables((prev) => [
//         ...prev,
//         {
//           lot: selectedLot,
//           type: selectedLotInfo.type,
//           design: selectedLotInfo.design,
//           color: selectedColor,
//           rows: validRows,
//         },
//       ]);

//       // Reset color select
//       setSelectedColor("");
//     } catch (err) {
//       alert("Error loading details");
//     }
//   };

//   const handleRemoveTable = (index) => {
//     const newTables = [...tables];
//     newTables.splice(index, 1);
//     setTables(newTables);
//   };

//   const handleSubmit = async () => {
//     if (tables.length === 0 || !tables.some((table) => table.rows.length > 0)) {
//       alert("No data to submit");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       for (const table of tables) {
//         const response = await fetch(`${baseUrl}/griegeupdate`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ lot: table.lot, color: table.color }),
//         });
//         if (!response.ok) throw new Error("Failed to update");
//       }
//       alert("Delivered status updated successfully");
//       setTables([]);
//       setSelectedLot("");
//       setSelectedLotInfo({ type: "", design: "" });
//       setColorOptions([]);
//     } catch (err) {
//       alert(`Submit error: ${err.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-[1280px] p-6 bg-opacity-30 bg-white">
//         {/* Party Selection */}
//         <div className="grid grid-cols-3 gap-4 mb-4">
//           <label className="font-semibold text-gray-700 col-span-1">
//             Party:
//           </label>
//           <select
//             className="col-span-2 border border-gray-300 rounded px-3 py-2"
//             value={selectedParty}
//             onChange={(e) => handlePartyChange(e.target.value)}
//           >
//             <option value="">Select Party</option>
//             {parties.map((p, i) => (
//               <option key={i} value={p}>
//                 {p}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Lot + Color Selection */}
//         <div className="grid grid-cols-4 gap-4 mb-4">
//           <div>
//             <label>Lot:</label>
//             <select
//               value={selectedLot}
//               onChange={(e) => handleLotChange(e.target.value)}
//               className="w-full border rounded px-2 py-1"
//             >
//               <option value="">Select Lot</option>
//               {lots.map((l, i) => (
//                 <option key={i} value={l.lot}>
//                   {l.lot}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label>Color:</label>
//             <select
//               value={selectedColor}
//               onChange={(e) => setSelectedColor(e.target.value)}
//               className="w-full border rounded px-2 py-1"
//             >
//               <option value="">Select Color</option>
//               {colorOptions.map((c, i) => (
//                 <option key={i} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label>Type:</label>
//             <input
//               value={selectedLotInfo.type}
//               readOnly
//               className="w-full border rounded px-2 py-1 bg-gray-100"
//             />
//           </div>
//           <div>
//             <label>Design:</label>
//             <input
//               value={selectedLotInfo.design}
//               readOnly
//               className="w-full border rounded px-2 py-1 bg-gray-100"
//             />
//           </div>
//         </div>

//         {/* Add Button */}
//         <button
//           onClick={handleAddTable}
//           className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Add
//         </button>

//         {/* Tables */}
//         <div className="grid grid-cols-5 gap-4">
//           {tables.map((table, tIndex) => (
//             <div
//               key={tIndex}
//               className="bg-white p-4 border rounded shadow col-span-1"
//             >
//               <div className="space-y-2 mb-4">
//                 <input
//                   value={table.lot}
//                   readOnly
//                   className="border px-2 py-1 w-full bg-gray-100 rounded"
//                 />
//                 <input
//                   value={table.type}
//                   readOnly
//                   className="border px-2 py-1 w-full bg-gray-100 rounded"
//                 />
//                 <input
//                   value={table.design}
//                   readOnly
//                   className="border px-2 py-1 w-full bg-gray-100 rounded"
//                 />
//                 <input
//                   value={table.color}
//                   readOnly
//                   className="border px-2 py-1 w-full bg-gray-100 rounded"
//                 />
//               </div>
//               <div className="grid grid-cols-2 font-semibold mb-2 text-sm text-gray-600">
//                 <div>Greige</div>
//                 <div>Finishing</div>
//               </div>
//               {table.rows.map((row, rIndex) => (
//                 <div key={rIndex} className="grid grid-cols-2 gap-2 mb-1">
//                   <input
//                     value={row.griege}
//                     readOnly
//                     className="border px-2 py-1 rounded bg-gray-100"
//                   />
//                   <input
//                     value={row.finishing}
//                     readOnly
//                     className="border px-2 py-1 rounded bg-gray-100"
//                   />
//                 </div>
//               ))}
//               <button
//                 onClick={() => handleRemoveTable(tIndex)}
//                 className="mt-4 w-full bg-red-600 text-white py-1 rounded hover:bg-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Submit Button */}
//         {tables.length > 0 && (
//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className={`mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Delivery;

import React, { useState, useEffect } from "react";

const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

function Delivery() {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [lots, setLots] = useState([]);
  const [tables, setTables] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Party Names initially
  useEffect(() => {
    fetch(`${baseUrl}/party`)
      .then((res) => res.json())
      .then((data) => setParties(data))
      .catch((error) => {
        console.error("Error fetching parties:", error);
        alert("Failed to load parties. Please try again.");
      });
  }, []);

  // When Party changes, load lots
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

  // Add new table
  const addTable = () => {
    setTables([
      ...tables,
      {
        lot: "",
        type: "",
        design: "",
        color: "",
        colorOptions: [],
        rows: [],
      },
    ]);
  };

  // Remove a table
  const removeTable = (index) => {
    const newTables = [...tables];
    newTables.splice(index, 1);
    setTables(newTables);
  };

  // On Lot Change
  const handleLotChange = async (lot, index) => {
    try {
      const infoRes = await fetch(
        `${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`
      );
      if (!infoRes.ok) throw new Error("Failed to fetch lot info");
      const lotInfo = await infoRes.json();

      const colorRes = await fetch(
        `${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`
      );
      if (!colorRes.ok) throw new Error("Failed to fetch colors");
      const colorData = await colorRes.json();

      const newTables = [...tables];
      newTables[index] = {
        ...newTables[index],
        lot,
        type: lotInfo.info?.type || "",
        design: lotInfo.info?.design || "",
        color: "",
        colorOptions: colorData.colors || [],
        rows: [],
      };
      setTables(newTables);
    } catch (error) {
      console.error("Error in handleLotChange:", error);
      alert("Error loading lot info: " + error.message);
    }
  };

  // On Color Change
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
      console.error("Error in handleColorChange:", error);
      alert("Error: " + error.message);
    }
  };

  // Submit Delivery
  const handleSubmit = async () => {
    if (tables.length === 0 || !tables.some((table) => table.rows.length > 0)) {
      alert("No valid data to submit. Please select a lot and color.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const table of tables) {
        if (table.rows.length > 0 && table.lot && table.color) {
          const response = await fetch(`${baseUrl}/griegeupdate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lot: table.lot, color: table.color }),
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update: ${errorText}`);
          }
        }
      }
      alert("Status updated to Delivered and saved.");
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
        {/* Party Select */}
        <div className="bg-white p-4 rounded shadow mb-6">
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
          {selectedParty && (
            <button
              onClick={addTable}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Table
            </button>
          )}
        </div>

        {/* Dynamic Tables */}
        <div className="grid grid-cols-5 gap-4">
          {tables.map((table, tIndex) => (
            <div
              key={tIndex}
              className="bg-white p-4 rounded shadow border col-span-1 relative"
            >
              {/* Remove Button */}
              <button
                className="absolute top-1 right-1 text-red-500 font-bold"
                onClick={() => removeTable(tIndex)}
              >
                ✕
              </button>

              {/* Lot Dropdown */}
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

              {/* Type & Design */}
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

              {/* Color Dropdown */}
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

              {/* Rows */}
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
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {tables.length > 0 && (
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
        )}
      </div>
    </div>
  );
}

export default Delivery;
