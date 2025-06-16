// // File: src/pages/Delivery.jsx
// import React, { useState, useEffect } from "react";
// import PackingListView from "../griege/PackingListView";
// import LotThanSelector from "../griege/LotThanSelector";

// function Delivery() {
//   const [party, setParty] = useState("");
//   const [parties, setParties] = useState(["Party A", "Party B", "Party C"]); // You can fetch dynamically
//   const [lots, setLots] = useState([]);
//   const [selectedThans, setSelectedThans] = useState([]);

//   // Fetch Lots based on selected Party
//   const handlePartyChange = async (e) => {
//     const selectedParty = e.target.value;
//     setParty(selectedParty);
//     setLots([]);
//     setSelectedThans([]);

//     if (!selectedParty) return;

//     try {
//       const res = await fetch(
//         `https://hcml-ry8s.vercel.app/griegein/getLotsByParty&party=${encodeURIComponent(
//           selectedParty
//         )}`
//       );
//       const data = await res.json();
//       if (data.lots) setLots(data.lots);
//     } catch (err) {
//       console.error("Failed to fetch lots:", err);
//     }
//   };

//   // Called when a Than is selected from LotThanSelector
//   const handleThanSelection = (lotNo, thanData) => {
//     setSelectedThans((prev) => [...prev, { lotNo, ...thanData }]);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Packing List Generator</h1>

//       {/* Party Selection */}
//       <div className="mb-4">
//         <label className="block font-semibold mb-1">Select Party:</label>
//         <select
//           className="border p-2 rounded w-full"
//           value={party}
//           onChange={handlePartyChange}
//         >
//           <option value="">-- Select Party --</option>
//           {parties.map((p) => (
//             <option key={p} value={p}>
//               {p}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Lot + Than Selector */}
//       {lots.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {lots.map((lot) => (
//             <LotThanSelector
//               key={lot.lotNo}
//               lot={lot}
//               onThanSelect={handleThanSelection}
//               apiBase={API_BASE}
//             />
//           ))}
//         </div>
//       )}

//       {/* Packing List View */}
//       {selectedThans.length > 0 && (
//         <div className="mt-6">
//           <PackingListView selectedThans={selectedThans} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Delivery;

// File: src/pages/Delivery.jsx
import React, { useState } from "react";
import PackingListView from "../griege/PackingListView";
import LotThanSelector from "../griege/LotThanSelector";

const API_BASE = "https://hcml-ry8s.vercel.app"; // সংজ্ঞায়িত করুন

function Delivery() {
  const [party, setParty] = useState("");
  const [parties, setParties] = useState([
    "আমিন ব্রাদার্স(Amin Brothers)",
    "Party B",
    "Party C",
  ]);
  const [lots, setLots] = useState([]);
  const [selectedThans, setSelectedThans] = useState([]);

  const handlePartyChange = async (e) => {
    const selectedParty = e.target.value;
    setParty(selectedParty);
    setLots([]);
    setSelectedThans([]);

    if (!selectedParty) return;

    try {
      const res = await fetch(
        `${API_BASE}/griegein/getLotsByParty?party=${selectedParty}`
      );
      const data = await res.json();
      if (data.lots) setLots(data.lots);
    } catch (err) {
      console.error("Failed to fetch lots:", err);
    }
  };

  const handleThanSelection = (lotNo, thanData) => {
    setSelectedThans((prev) => {
      // ডুপ্লিকেট চেক করুন
      const exists = prev.some(
        (item) => item.lotNo === lotNo && item.thanNo === thanData.thanNo
      );
      return exists ? prev : [...prev, { lotNo, ...thanData }];
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Packing List Generator</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Party:</label>
        <select
          className="border p-2 rounded w-full"
          value={party}
          onChange={handlePartyChange}
        >
          <option value="">-- Select Party --</option>
          {parties.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {lots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lots.map((lot) => (
            <LotThanSelector
              key={lot.lotNo}
              lot={lot}
              onThanSelect={handleThanSelection}
              apiBase={API_BASE}
            />
          ))}
        </div>
      )}

      {selectedThans.length > 0 && (
        <div className="mt-6">
          <PackingListView selectedThans={selectedThans} />
        </div>
      )}
    </div>
  );
}

export default Delivery;
