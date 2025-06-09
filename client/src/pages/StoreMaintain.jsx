// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";

// function StoreMaintain() {
//   const [data, setData] = useState([]);
//   const [batchData, setBatchData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [memoSearch, setMemoSearch] = useState("");
//   const [dateSearch, setDateSearch] = useState("");

//   useEffect(() => {
//     fetch(`https://hcml-ry8s.vercel.app/demand/verifydyes`)
//       .then((res) => res.json())
//       .then((data) => {
//         setData(data);
//       });
//   }, []);

//   // নতুন useEffect যোগ করুন:
//   useEffect(() => {
//     if (data.length > 0) {
//       filterByDateAndMemo(data);
//     }
//   }, [memoSearch, dateSearch, data]);

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return isNaN(date) ? dateStr : date.toISOString().split("T")[0];
//   };

//   const filterByDateAndMemo = (fullData) => {
//     if (!fullData || fullData.length === 0) return;

//     const headers = fullData[0];
//     const rows = fullData.slice(1);

//     const batches = [];
//     let currentBatch = [];

//     rows.forEach((row) => {
//       const isNewBatch = row[0] !== "";
//       if (isNewBatch && currentBatch.length > 0) {
//         batches.push(currentBatch);
//         currentBatch = [];
//       }
//       currentBatch.push(row);
//     });
//     if (currentBatch.length > 0) batches.push(currentBatch);

//     const filteredBatches = batches.filter((batch) => {
//       const first = batch[0];
//       const date = formatDate(first[0]);
//       const memo = String(first[1] || "").trim(); // শুধু trim, no toLowerCase
//       const memoSearchClean = memoSearch.trim(); // শুধু trim

//       const matchMemo = !memoSearchClean || memo.includes(memoSearchClean);
//       const matchDate = !dateSearch || date === dateSearch;

//       return matchMemo && matchDate;
//     });

//     setFilteredData([headers, ...filteredBatches.flat()]);
//   };

//   const holdUpdate = async () => {
//     const response = await fetch("https://hcml-ry8s.vercel.app/stock/hold", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         batchData: [
//           { color: "Red", gram: 150 },
//           { color: "Blue", gram: 200 },
//         ],
//       }),
//     });
//   };

//   const markDelivered = async (batch) => {
//     try {
//       // ব্যাচ থেকে memoNo এবং date নিন
//       const memoNo = batch[0][1]; // ধরে নিচ্ছি memoNo কলাম 1 এ আছে
//       const date = formatDate(batch[0][0]); // ধরে নিচ্ছি date কলাম 0 এ আছে

//       // Google Apps Script Web App URL-এ পাঠানোর জন্য পেলোড তৈরি করুন
//       const payload = {
//         memoNo,
//         date,
//         status: "Delivered",
//       };

//       // Google Apps Script Web App URL-এ POST রিকোয়েস্ট পাঠান
//       const response = await fetch(
//         "https://hcml-ry8s.vercel.app/demand/status",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );
//       holdUpdate();
//       if (!response.ok) {
//         throw new Error("গুগল শিটে স্ট্যাটাস আপডেট করতে ব্যর্থ");
//       }

//       // ফ্রন্টএন্ডে অপটিমিস্টিক আপডেট
//       batch.forEach((row) => {
//         row[19] = "Delivered"; // স্ট্যাটাস কলাম (ইনডেক্স 19) আপডেট
//       });

//       setFilteredData((prev) => {
//         const headers = prev[0];
//         const others = prev.slice(1).filter((r) => !batch.includes(r));
//         return [headers, ...others, ...batch];
//       });

//       // ঐচ্ছিক: ব্যবহারকারীকে সফল মেসেজ দেখান
//       alert("ব্যাচ সফলভাবে ডেলিভারড হিসেবে চিহ্নিত!");
//     } catch (error) {
//       console.error("স্ট্যাটাস আপডেটে ত্রুটি:", error);
//       alert("ব্যাচ ডেলিভারড হিসেবে চিহ্নিত করতে ব্যর্থ। আবার চেষ্টা করুন।");
//     }
//   };

//   const headers = filteredData[0] || [];
//   const rows = filteredData.slice(1);

//   const batchRows = [];
//   let currentBatch = [];
//   rows.forEach((row) => {
//     if (row[0] !== "" && currentBatch.length > 0) {
//       batchRows.push(currentBatch);
//       currentBatch = [];
//     }
//     currentBatch.push(row);
//   });
//   if (currentBatch.length > 0) batchRows.push(currentBatch);

//   return (
//     <div className="w-screen h-screen">
//       <Navbar />
//       <div className="w-screen h-screen p-4 text-sm">
//         {/* Filter Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div>
//             <label className="text-xs font-semibold">Memo No</label>
//             <input
//               type="text"
//               value={memoSearch}
//               onChange={(e) => setMemoSearch(e.target.value)}
//               placeholder="Memo No"
//               className="border px-2 py-1 w-full rounded"
//             />
//           </div>
//           <div>
//             <label className="text-xs font-semibold">Date</label>
//             <input
//               type="date"
//               value={dateSearch}
//               onChange={(e) => setDateSearch(e.target.value)}
//               className="border px-2 py-1 w-full rounded"
//             />
//           </div>
//           <div className="flex items-end">
//             <button
//               onClick={() => filterByDateAndMemo(data)}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
//             >
//               Filter
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//           {/* Display Table */}
//           {batchRows.map((batch, batchIndex) => {
//             if (batch[0][18] === "pending") {
//               return (
//                 <div
//                   key={batchIndex}
//                   className="border rounded-lg mb-8 shadow p-3 bg-white col-span-1"
//                 >
//                   {/* Header Info */}
//                   <div className="mb-3 text-sm font-medium">
//                     <div>Memo No: {batch[0][1]}</div>
//                     <div>Date: {formatDate(batch[0][0])}</div>
//                     <div>Lot No: {batch[0][12]}</div>
//                     <div>Party: {batch[0][10]}</div>
//                     <div>Status: {batch[0][18]}</div>
//                   </div>

//                   {/* Colors Table */}
//                   <table className="min-w-full text-left mb-3 border">
//                     <thead className="bg-gray-200">
//                       <tr>
//                         <th className="border px-2 py-1">Color</th>
//                         <th className="border px-2 py-1">Gram</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {batch.map((row, idx) => (
//                         <tr key={idx} className="hover:bg-gray-50">
//                           <td className="border px-2 py-1">{row[6]}</td>
//                           <td className="border px-2 py-1">{row[13]}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>

//                   {/* Mark Delivered Button */}
//                   <button
//                     onClick={() => markDelivered(batch)}
//                     className={`text-white px-4 py-1 rounded ${
//                       batch[0][18] === "Delivered"
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-green-600 hover:bg-green-700"
//                     }`}
//                   >
//                     Mark as Delivered
//                   </button>
//                 </div>
//               );
//             }
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StoreMaintain;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function StoreMaintain() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [memoSearch, setMemoSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand/verifydyes`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Failed to load data. Please try again.");
      });
  }, []);

  useEffect(() => {
    filterByDateAndMemo(data);
  }, [memoSearch, dateSearch, data]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toISOString().split("T")[0];
  };

  const filterByDateAndMemo = (fullData) => {
    if (!fullData?.length) {
      setFilteredData([]);
      return;
    }

    const headers = fullData[0];
    const rows = fullData.slice(1);

    const batches = [];
    let currentBatch = [];

    rows.forEach((row) => {
      const isNewBatch = row[0] !== "";
      if (isNewBatch && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
      }
      currentBatch.push(row);
    });
    if (currentBatch.length > 0) batches.push(currentBatch);

    const filteredBatches = batches.filter((batch) => {
      const first = batch[0];
      const date = formatDate(first[0]);
      const memo = String(first[1] || "").trim();
      const memoSearchClean = memoSearch.trim();

      const matchMemo = !memoSearchClean || memo.includes(memoSearchClean);
      const matchDate = !dateSearch || date === dateSearch;

      return matchMemo && matchDate;
    });

    setFilteredData([headers, ...filteredBatches.flat()]);
  };

  const holdUpdate = async (batch) => {
    const payload = batch.map((row) => ({
      color: String(row[6] || "").trim(), // Ensure color is a string
      gram: parseFloat(row[13]) || 0, // Ensure gram is a number
    }));

    try {
      const response = await fetch("https://hcml-ry8s.vercel.app/stock/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchData: payload }),
      });
      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "Failed to update stock hold");
    } catch (error) {
      console.error("Hold update error:", error);
      alert("Failed to update stock hold.");
      throw error; // Propagate error to markDelivered
    }
  };

  const markDelivered = async (batch) => {
    try {
      const memoNo = batch[0][1];
      const date = formatDate(batch[0][0]);
      const payload = { memoNo, date, status: "Delivered" };

      const response = await fetch(
        "https://hcml-ry8s.vercel.app/demand/status",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok)
        throw new Error("Failed to update status in Google Sheet");

      await holdUpdate(batch); // Dynamic batch data
      batch.forEach((row) => {
        row[19] = "Delivered";
      });

      setFilteredData((prev) => {
        const headers = prev[0];
        const others = prev.slice(1).filter((r) => !batch.includes(r));
        return [headers, ...others, ...batch];
      });

      alert("Batch marked as delivered successfully!");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to mark batch as delivered. Please try again.");
    }
  };

  const headers = filteredData[0] || [];
  const rows = filteredData.slice(1);

  const batchRows = [];
  let currentBatch = [];
  rows.forEach((row) => {
    if (row[0] !== "" && currentBatch.length > 0) {
      batchRows.push(currentBatch);
      currentBatch = [];
    }
    currentBatch.push(row);
  });
  if (currentBatch.length > 0) batchRows.push(currentBatch);

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="w-screen h-screen p-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold">Memo No</label>
            <input
              type="text"
              value={memoSearch}
              onChange={(e) => setMemoSearch(e.target.value)}
              placeholder="Memo No"
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Date</label>
            <input
              type="date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              className="border px-2 py-1 w-full rounded"
            />
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow">
              Filter
            </button>
          </div>
        </div>

        {batchRows.length === 0 ? (
          <div className="text-center text-gray-500">
            No matching batches found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {batchRows.map((batch, batchIndex) => {
              if (batch[0][18] === "pending") {
                return (
                  <div
                    key={batchIndex}
                    className="border rounded-lg mb-8 shadow p-3 bg-white col-span-1"
                  >
                    <div className="mb-3 text-sm font-medium">
                      <div>Memo No: {batch[0][1]}</div>
                      <div>Date: {formatDate(batch[0][0])}</div>
                      <div>Lot No: {batch[0][12]}</div>
                      <div>Party: {batch[0][10]}</div>
                      <div>Status: {batch[0][18]}</div>
                    </div>
                    <table className="min-w-full text-left mb-3 border">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border px-2 py-1">Color</th>
                          <th className="border px-2 py-1">Gram</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batch.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{row[6]}</td>
                            <td className="border px-2 py-1">{row[13]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      onClick={() => markDelivered(batch)}
                      disabled={batch[0][18] === "Delivered"}
                      className={`text-white px-4 py-1 rounded ${
                        batch[0][18] === "Delivered"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreMaintain;
