// import React, { useState } from "react";

// function Delivery() {
//   const [tables, setTables] = useState([
//     {
//       lot: "",
//       type: "",
//       design: "",
//       color: "",
//       rows: [{ index: "", greige: "", finishing: "" }],
//     },
//   ]);

//   const handleAddRow = (tableIndex) => {
//     const newTables = [...tables];
//     newTables[tableIndex].rows.push({ index: "", greige: "", finishing: "" });
//     setTables(newTables);
//   };

//   const handleAddTable = () => {
//     setTables([
//       ...tables,
//       {
//         lot: "",
//         type: "",
//         design: "",
//         color: "",
//         rows: [{ index: "", greige: "", finishing: "" }],
//       },
//     ]);
//   };

//   return (
//     <div className="w-full flex flex-col items-center justify-center">
//       <div className="w-full max-w-[1280px]  p-6 flex flex-col items-center bg-opacity-30 bg-white">
//         {/* Header Info */}
//         <div className="w-full max-w-[1280px] bg-white p-4 rounded shadow mb-6">
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <label className="font-semibold text-gray-700 col-span-1">
//               Party's Name:
//             </label>
//             <select className="col-span-2 border border-gray-300 rounded px-3 py-2">
//               <option>AMIN BROTHERS</option>
//             </select>
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             <label className="font-semibold text-gray-700 col-span-1">
//               Address:
//             </label>
//             <h2 className="col-span-2 text-gray-800">Islampur</h2>
//           </div>
//         </div>

//         {/* All Tables */}
//         <div className="w-full max-w-[1280px] grid grid-cols-5 gap-4">
//           {tables.map((table, tIndex) => (
//             <div
//               key={tIndex}
//               className="bg-white p-4 rounded shadow border border-gray-200 col-span-1"
//             >
//               {/* Table Header Info */}
//               <div className="flex flex-col space-y-2 mb-4">
//                 <input
//                   type="text"
//                   placeholder="Lot"
//                   className="border px-2 py-1 rounded"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Type"
//                   className="border px-2 py-1 rounded"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Design"
//                   className="border px-2 py-1 rounded"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Color"
//                   className="border px-2 py-1 rounded"
//                 />
//               </div>

//               {/* Table Column Headers */}
//               <div className="grid grid-cols-3 gap-4 font-semibold text-gray-600 mb-2">
//                 <div>Index</div>
//                 <div>Greige</div>
//                 <div>Finishing</div>
//               </div>

//               {/* Table Rows */}
//               {table.rows.map((row, rIndex) => (
//                 <div key={rIndex} className="grid grid-cols-3 gap-4 mb-2">
//                   <input
//                     type="text"
//                     placeholder="#"
//                     className="border px-2 py-1 rounded"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Greige Gaj"
//                     className="border px-2 py-1 rounded"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Finish Gaj"
//                     className="border px-2 py-1 rounded"
//                   />
//                 </div>
//               ))}

//               {/* Add Row Button */}
//               <div className="text-right">
//                 <button
//                   onClick={() => handleAddRow(tIndex)}
//                   className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//                 >
//                   + Add Row
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Add New Table Button */}
//         <button
//           onClick={handleAddTable}
//           className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
//         >
//           + Add New Table
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Delivery;

// import React, { useEffect, useState } from "react";

// function Delivery() {
//   const [tables, setTables] = useState([
//     { party: "", lot: "", type: "", design: "", color: "", rows: [] },
//   ]);

//   const [parties, setParties] = useState([]);
//   const baseUrl = "YOUR_GOOGLE_SCRIPT_URL"; // ⬅️ Replace with actual

//   useEffect(() => {
//     // Load Party List
//     fetch(`${baseUrl}?action=getParties`)
//       .then((res) => res.json())
//       .then((data) => setParties(data.parties));
//   }, []);

//   const handlePartyChange = (index, party) => {
//     const updated = [...tables];
//     updated[index].party = party;
//     updated[index].lot = "";
//     updated[index].type = "";
//     updated[index].design = "";
//     updated[index].color = "";
//     updated[index].rows = [];

//     // Load Lot Options
//     fetch(`${baseUrl}?action=getLots&party=${encodeURIComponent(party)}`)
//       .then((res) => res.json())
//       .then((data) => {
//         updated[index].lotOptions = data.lots;
//         setTables(updated);
//       });
//   };

//   const handleLotChange = (index, lot) => {
//     const updated = [...tables];
//     updated[index].lot = lot;

//     // Auto-fill Type & Design
//     fetch(`${baseUrl}?action=getLotInfo&lot=${encodeURIComponent(lot)}`)
//       .then((res) => res.json())
//       .then((data) => {
//         updated[index].type = data.info.type;
//         updated[index].design = data.info.design;
//         setTables(updated);
//       });

//     // Load Color Dropdown
//     fetch(`${baseUrl}?action=getColorsByLot&lot=${encodeURIComponent(lot)}`)
//       .then((res) => res.json())
//       .then((data) => {
//         updated[index].colorOptions = data.colors;
//         setTables(updated);
//       });
//   };

//   const handleColorChange = (index, color) => {
//     const updated = [...tables];
//     updated[index].color = color;

//     // Load GREIGE/FINISHING rows
//     fetch(
//       `${baseUrl}?action=getDetails&lot=${encodeURIComponent(
//         updated[index].lot
//       )}&color=${encodeURIComponent(color)}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         updated[index].rows = data.rows;
//         setTables(updated);
//       });
//   };

//   const handleAddTable = () => {
//     setTables([
//       ...tables,
//       { party: "", lot: "", type: "", design: "", color: "", rows: [] },
//     ]);
//   };

//   const handleSubmit = (index) => {
//     const t = tables[index];
//     fetch(baseUrl, {
//       method: "POST",
//       body: JSON.stringify({
//         action: "markDelivered",
//         lot: t.lot,
//         color: t.color,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => res.text())
//       .then(() => {
//         alert(`Lot ${t.lot} - Color ${t.color} marked as Delivered`);
//         const updated = [...tables];
//         updated[index].rows = [];
//         setTables(updated);
//       });
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen space-y-6">
//       {/* Multiple Tables */}
//       <div className="grid grid-cols-5 gap-4">
//         {tables.map((table, idx) => (
//           <div
//             key={idx}
//             className="p-4 bg-gray-50 border rounded shadow space-y-2"
//           >
//             {/* Party Select */}
//             <select
//               className="w-full border px-2 py-1 rounded"
//               value={table.party}
//               onChange={(e) => handlePartyChange(idx, e.target.value)}
//             >
//               <option value="">Select Party</option>
//               {parties.map((p, i) => (
//                 <option key={i} value={p}>
//                   {p}
//                 </option>
//               ))}
//             </select>

//             {/* Lot Select */}
//             <select
//               className="w-full border px-2 py-1 rounded"
//               value={table.lot}
//               onChange={(e) => handleLotChange(idx, e.target.value)}
//             >
//               <option value="">Select Lot</option>
//               {table.lotOptions &&
//                 table.lotOptions.map((lot, i) => (
//                   <option key={i} value={lot}>
//                     {lot}
//                   </option>
//                 ))}
//             </select>

//             {/* Type / Design */}
//             <input
//               readOnly
//               value={table.type}
//               className="w-full border px-2 py-1 rounded"
//               placeholder="Type"
//             />
//             <input
//               readOnly
//               value={table.design}
//               className="w-full border px-2 py-1 rounded"
//               placeholder="Design"
//             />

//             {/* Color Select */}
//             <select
//               className="w-full border px-2 py-1 rounded"
//               value={table.color}
//               onChange={(e) => handleColorChange(idx, e.target.value)}
//             >
//               <option value="">Select Color</option>
//               {table.colorOptions &&
//                 table.colorOptions.map((color, i) => (
//                   <option key={i} value={color}>
//                     {color}
//                   </option>
//                 ))}
//             </select>

//             {/* Rows if loaded */}
//             {table.rows.length > 0 && (
//               <div className="border-t pt-2">
//                 <div className="font-semibold text-sm mb-1">Delivery Rows:</div>
//                 <div className="text-xs grid grid-cols-3 font-bold">
//                   <div>Greige</div>
//                   <div>Finishing</div>
//                   <div>Status</div>
//                 </div>
//                 {table.rows.map((r, i) => (
//                   <div
//                     key={i}
//                     className="text-xs grid grid-cols-3 border-t py-1"
//                   >
//                     <div>{r.griege}</div>
//                     <div>{r.finishing}</div>
//                     <div>{r.status}</div>
//                   </div>
//                 ))}
//                 <button
//                   onClick={() => handleSubmit(idx)}
//                   className="mt-2 w-full bg-blue-600 text-white text-xs py-1 rounded"
//                 >
//                   Submit & Mark Delivered
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Add New Table */}
//       <button
//         onClick={handleAddTable}
//         className="px-4 py-2 bg-green-600 text-white rounded"
//       >
//         + Add New Table
//       </button>
//     </div>
//   );
// }

// export default Delivery;
// Updated Delivery Component with Google Sheet Integration Logic (Frontend only)
// Updated Delivery Component with Google Sheet Integration Logic (Frontend only)
import React, { useState, useEffect } from "react";

const baseUrl = "https://hcml-ry8s.vercel.app/griegein"; // Replace with your actual deployed script URL

function Delivery() {
  const [parties, setParties] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");

  // Load Party Names initially
  useEffect(() => {
    fetch(`${baseUrl}/party`)
      .then((res) => res.json())
      .then((data) => setParties(data));
  }, []);

  const handlePartyChange = async (party) => {
    setSelectedParty(party);
    const lotRes = await fetch(
      `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
    );
    const lotData = await lotRes.json();
    console.log(lotData);
    const tableList = await Promise.all(
      lotData.map(async (lot) => {
        const lotInfoRes = await fetch(
          `${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`
        );
        const lotInfo = await lotInfoRes.json();

        const colorRes = await fetch(
          `${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`
        );
        const colors = await colorRes.json();
        console.log(lotInfo);
        return {
          lot,
          type: lotInfo.info.type,
          design: lotInfo.info.design,
          color: "",
          colorOptions: colors.colors,
          rows: [],
        };
      })
    );

    setTables(tableList);
  };

  const handleColorChange = async (color, tableIndex) => {
    const lot = tables[tableIndex].lot;
    const detailRes = await fetch(
      `${baseUrl}/detailsres?lot=${lot}&color=${encodeURIComponent(color)}`
    );
    const detailData = await detailRes.json();

    const validRows = detailData.rows.filter(
      (row) => row.finishing !== "" && row.status !== "Delivered"
    );
    console.log(detailData);
    const newTables = [...tables];
    newTables[tableIndex].color = color;
    newTables[tableIndex].rows = validRows;
    setTables(newTables);
  };

  const handleSubmit = async () => {
    for (const table of tables) {
      if (table.rows.length > 0) {
        await fetch(`${baseUrl}/griegeupdate`, {
          method: "POST",
          body: JSON.stringify({
            lot: table.lot,
            color: table.color,
          }),
        });
      }
    }
    alert("Status updated to Delivered and saved in DELIVERED sheet.");
    setTables([]);
    setSelectedParty("");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1280px] p-6 flex flex-col items-center bg-opacity-30 bg-white">
        {/* Header Info */}
        <div className="w-full max-w-[1280px] bg-white p-4 rounded shadow mb-6">
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
        </div>

        {/* Tables */}
        <div className="w-full max-w-[1280px] grid grid-cols-5 gap-4">
          {tables.map((table, tIndex) => (
            <div
              key={tIndex}
              className="bg-white p-4 rounded shadow border border-gray-200 col-span-1"
            >
              <div className="flex flex-col space-y-2 mb-4">
                <input
                  value={table.lot}
                  readOnly
                  className="border px-2 py-1 rounded"
                  placeholder="Lot"
                />
                <input
                  value={table.type}
                  readOnly
                  className="border px-2 py-1 rounded"
                  placeholder="Type"
                />
                <input
                  value={table.design}
                  readOnly
                  className="border px-2 py-1 rounded"
                  placeholder="Design"
                />

                <select
                  className="border px-2 py-1 rounded"
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
              </div>

              <div className="grid grid-cols-2 gap-4 font-semibold text-gray-600 mb-2">
                <div>Greige</div>
                <div>Finishing</div>
              </div>
              {table.rows.map((row, rIndex) => (
                <div key={rIndex} className="grid grid-cols-2 gap-4 mb-1">
                  <input
                    value={row.griege}
                    readOnly
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    value={row.finishing}
                    readOnly
                    className="border px-2 py-1 rounded"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {tables.length > 0 && (
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default Delivery;
