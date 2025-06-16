// import React, { useEffect, useState } from "react";

// function LotThanSelector({ lot, onThanSelect, apiBase }) {
//   const [thans, setThans] = useState([]);

//   useEffect(() => {
//     const fetchThans = async () => {
//       try {
//         const res = await fetch(
//           `${apiBase}?lot=${encodeURIComponent(lot.lotNo)}`
//         );
//         const data = await res.json();
//         setThans(data.thans || []);
//       } catch (err) {
//         console.error("Error loading thans:", err);
//       }
//     };

//     fetchThans();
//   }, [lot.lotNo]);

//   return (
//     <div className="border p-4 rounded shadow">
//       <h2 className="font-semibold mb-2">
//         {lot.lotNo} ({lot.type} / {lot.design})
//       </h2>
//       {thans.map((than, idx) => (
//         <div
//           key={idx}
//           className="flex items-center justify-between mb-1 text-sm"
//         >
//           <div>
//             {than.color} | Grey: {than.greige} | Finish: {than.finishing}
//           </div>
//           <button
//             className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
//             onClick={() => onThanSelect(lot.lotNo, than)}
//           >
//             Add
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default LotThanSelector;

import React, { useEffect, useState } from "react";

function LotThanSelector({ lot, onThanSelect, apiBase }) {
  const [thans, setThans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${apiBase}/getThansByLot?lot=${encodeURIComponent(lot.lotNo)}`
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setThans(data.thans || []);
      } catch (err) {
        console.error("Error loading thans:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThans();
  }, [lot.lotNo, apiBase]);

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-semibold mb-2">
        {lot.lotNo} ({lot.type} / {lot.design})
      </h2>

      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && thans.length === 0 && (
        <div className="text-sm text-gray-500">No thans available</div>
      )}

      {thans.map((than, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between mb-1 text-sm"
        >
          <div>
            {than.color} | Grey: {than.greige} | Finish: {than.finishing}
          </div>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition"
            onClick={() => onThanSelect(lot.lotNo, than)}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}

export default LotThanSelector;
