// import { useState, useEffect, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import CompanyPad from "./CompanyPad";
// import Signature from "./Signature";

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

//   const pdfRef = useRef();

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [partyRes, challanRes] = await Promise.all([
//           fetch(`${baseUrl}/party`),
//           fetch(`${baseUrl}/lastchallan`),
//         ]);
//         const partyData = await partyRes.json();
//         setParties(partyData);
//         const challanData = await challanRes.json();
//         setChallanNo(challanData.lastChallan || "DC-250618001");
//       } catch (error) {
//         console.error("Initial fetch error:", error);
//         setChallanNo("DC-250618001");
//       }
//     };
//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     if (!selectedParty) {
//       setAddress("");
//       return;
//     }
//     fetch(`${baseUrl}/getaddress?party=${encodeURIComponent(selectedParty)}`)
//       .then((res) => res.json())
//       .then((data) => setAddress(data?.address || ""))
//       .catch(() => setAddress(""));
//   }, [selectedParty]);

//   const handlePartyChange = async (party) => {
//     setSelectedParty(party);
//     setTables([]);
//     try {
//       const lotRes = await fetch(
//         `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
//       );
//       const lotData = await lotRes.json();
//       setLots(lotData);
//     } catch (error) {
//       console.error("Error fetching lots:", error);
//       alert("Failed to load lots.");
//     }
//   };

//   const addTable = () => {
//     setTables((prev) => [
//       ...prev,
//       { lot: "", type: "", design: "", color: "", colorOptions: [], rows: [] },
//     ]);
//   };

//   const removeTable = (index) => {
//     setTables((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleLotChange = async (lot, index) => {
//     try {
//       const [infoRes, colorRes] = await Promise.all([
//         fetch(`${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`),
//         fetch(`${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`),
//       ]);
//       const lotInfo = await infoRes.json();
//       const colorData = await colorRes.json();
//       setTables((prev) => {
//         const t = [...prev];
//         t[index] = {
//           ...t[index],
//           lot,
//           type: lotInfo?.info?.type || "",
//           design: lotInfo?.info?.design || "",
//           color: "",
//           colorOptions: colorData?.colors || [],
//           rows: [],
//         };
//         return t;
//       });
//     } catch (error) {
//       console.error("handleLotChange error:", error);
//       alert("Could not load lot info");
//     }
//   };

//   const handleColorChange = async (color, index) => {
//     try {
//       const lot = tables[index].lot;
//       const detailRes = await fetch(
//         `${baseUrl}/detailsres?lot=${lot}&color=${encodeURIComponent(color)}`
//       );
//       const detailData = await detailRes.json();
//       const validRows = detailData.rows.filter(
//         (row) => row.finishing !== "" && row.status !== "Delivered"
//       );
//       setTables((prev) => {
//         const t = [...prev];
//         t[index] = { ...t[index], color, rows: validRows };
//         return t;
//       });
//     } catch (error) {
//       console.error("handleColorChange error:", error);
//       alert("Color loading failed: " + error.message);
//     }
//   };

//   const calculateTableTotals = (rows) => {
//     let totalGreige = 0,
//       totalFinishing = 0;
//     rows.forEach(({ griege, finishing }) => {
//       const g = parseFloat(griege);
//       const f = parseFloat(finishing);
//       if (!isNaN(g)) totalGreige += g;
//       if (!isNaN(f)) totalFinishing += f;
//     });
//     return {
//       totalGreige: totalGreige.toFixed(2),
//       totalFinishing: totalFinishing.toFixed(2),
//     };
//   };

//   const getSummary = () => {
//     const summary = {};
//     tables.forEach(({ type, rows }) => {
//       if (!type || rows.length === 0) return;
//       const key = `${type}`;
//       if (!summary[key]) summary[key] = { type, greige: 0, finishing: 0 };
//       rows.forEach(({ griege, finishing }) => {
//         const g = parseFloat(griege);
//         const f = parseFloat(finishing);
//         if (!isNaN(g)) summary[key].greige += g;
//         if (!isNaN(f)) summary[key].finishing += f;
//       });
//     });
//     return Object.values(summary);
//   };

//   const payload = {
//     deliveryDate,
//     challanNo,
//     selectedParty,
//     tables,
//     deliveredBy: localStorage.getItem("username"),
//     comments,
//   };

//   const DeliveryUpdate = async () => {
//     try {
//       await fetch(`${baseUrl}/delivarydata`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!tables.some((t) => t.rows.length > 0)) {
//       alert("No valid data to submit.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       for (const table of tables) {
//         if (table.lot && table.color && table.rows.length > 0) {
//           const res = await fetch(`${baseUrl}/griegeupdate`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ lot: table.lot, color: table.color }),
//           });
//           if (!res.ok) throw new Error(await res.text());
//           await DeliveryUpdate();
//         }
//       }
//       alert("Status updated to Delivered.");
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

//   const handleDownloadPDF = () => {
//     const input = pdfRef.current;

//     // --- PDF জেনারেশনের জন্য অতিরিক্ত স্টাইল যোগ করা এবং বিদ্যমান এলিমেন্ট প্রতিস্থাপন ---
//     // Original style সংরক্ষণ করুন যাতে PDF তৈরি হওয়ার পর restore করা যায়।
//     const originalWidth = input.style.width;
//     const originalMaxWidth = input.style.maxWidth;
//     const originalPadding = input.style.padding;
//     const originalMargin = input.style.margin;
//     const originalPosition = input.style.position; // position সংরক্ষণ করুন

//     // PDF ক্যাপচারের জন্য অস্থায়ীভাবে প্রস্থ (width) বাড়ান এবং অন্যান্য স্টাইল সেট করুন।
//     // এটি নিশ্চিত করবে যে html2canvas একটি উচ্চ-রেজোলিউশনের ছবি ক্যাপচার করছে।
//     input.style.width = "1000px"; // প্রিন্ট আউটপুটের জন্য একটি উপযুক্ত প্রস্থ
//     input.style.maxWidth = "none"; // যদি কোনো max-width থাকে তাহলে তা বাতিল করুন
//     input.style.padding = "20mm"; // প্রিন্টের মার্জিনের জন্য প্যাডিং
//     input.style.margin = "0 auto"; // কন্টেন্ট মাঝখানে আনার জন্য
//     input.style.backgroundColor = "#fff"; // নিশ্চিত করুন ব্যাকগ্রাউন্ড সাদা
//     input.style.position = "relative"; // যদি CompanyPad-এর কোনো absolute পজিশন থাকে, তাহলে তার জন্য

//     // বাটনগুলো লুকান যাতে PDF-এ না আসে
//     const buttons = input.querySelectorAll("button");
//     buttons.forEach((btn) => (btn.style.display = "none"));

//     // ফর্ম এলিমেন্ট (ইনপুট, সিলেক্ট, টেক্সটএরিয়া) স্ট্যাটিক টেক্সট দিয়ে প্রতিস্থাপন করুন
//     // এটি PDF-এ ফর্ম ফিল্ডের পরিবর্তে প্লেইন টেক্সট দেখাবে এবং স্টাইলিং সমস্যা কমাবে।
//     const elementsToReplace = input.querySelectorAll("input, select, textarea");
//     const originals = [];

//     elementsToReplace.forEach((el) => {
//       const replacement = document.createElement("div");
//       replacement.className = "pdf-text-replacement";
//       // value যদি select বা input হয়, তাহলে value ব্যবহার করুন। অন্যথায় textContent।
//       replacement.textContent = el.value || el.textContent;

//       // মূল এলিমেন্টের স্টাইল কপি করুন যাতে প্রতিস্থাপিত টেক্সট একই রকম দেখায়
//       const computed = window.getComputedStyle(el);
//       replacement.style.width = computed.width;
//       replacement.style.height = computed.height;
//       replacement.style.padding = computed.padding;
//       replacement.style.margin = computed.margin;
//       replacement.style.font = computed.font;
//       replacement.style.border = "1px solid transparent"; // বর্ডার লুকাতে
//       replacement.style.background = "transparent"; // ব্যাকগ্রাউন্ড লুকাতে
//       replacement.style.display = "flex";
//       replacement.style.alignItems = "center";
//       replacement.style.boxSizing = "border-box"; // বক্স মডেল ঠিক রাখার জন্য
//       replacement.style.wordBreak = "break-word"; // লম্বা টেক্সট যাতে ভেঙে যায়

//       originals.push({
//         element: el,
//         parent: el.parentNode,
//         replacement,
//       });
//       el.parentNode.replaceChild(replacement, el);
//     });

//     // অস্থায়ী CSS স্টাইল যোগ করুন যা PDF এর জন্য কাস্টমাইজড
//     // এটি ফন্ট সাইজ এবং ওভারফ্লো নিয়ন্ত্রণ করতে সাহায্য করবে
//     const style = document.createElement("style");
//     style.innerHTML = `
//       /* প্রতিস্থাপিত টেক্সট ফিল্ডের জন্য */
//       .pdf-text-replacement {
//         white-space: normal; /* নরমাল রাখুন যাতে টেক্সট ভেঙে যায় */
//         overflow: visible !important;
//         text-overflow: clip !important;
//         font-size: 11px; /* প্রয়োজন অনুযায়ী ফন্ট সাইজ সামঞ্জস্য করুন */
//         color: #333;
//         min-height: 20px; /* যদি উচ্চতা খুব কম হয় */
//       }
//       /* টেবিলের হেডার এবং বডির টেক্সটের জন্য */
//       .pdf-table-header, .pdf-table-cell {
//         font-size: 10px; /* টেবিলের টেক্সটের জন্য উপযুক্ত ফন্ট সাইজ */
//         line-height: 1.2;
//         padding: 4px 2px; /* টেবিল সেলের প্যাডিং কমান */
//       }
//       /* ওভারল্যাপ এড়াতে কিছু সাধারণ স্টাইল */
//       .grid {
//         gap: 8px !important; /* গ্রিড গ্যাপ সামঞ্জস্য করুন */
//       }
//       .col-span-1 {
//         flex-grow: 1;
//       }
//       /* CompanyPad এর ভেতরের টেক্সট যদি ছোট আসে, এখানে ফন্ট সাইজ বাড়াতে পারেন */
//       .company-pad-text {
//         font-size: 14px; /* উদাহরণস্বরূপ */
//       }
//       /* অতিরিক্ত মার্জিন বা প্যাডিং সরান যা ওয়েব লেআউটের জন্য প্রয়োজন */
//       .mb-4, .mb-6, .mt-8, .mt-6 {
//         margin-bottom: 0 !important;
//         margin-top: 0 !important;
//       }
//       .p-4, .p-6, .p-2 {
//         padding: 0 !important;
//       }
//     `;
//     document.head.appendChild(style);

//     // PDF জেনারেট করুন
//     html2canvas(input, {
//       scale: 3, // স্কেল বাড়িয়ে 3 বা 4 করুন যাতে রেজোলিউশন ভালো হয়
//       useCORS: true,
//       logging: true, // ডিবাগিং এর জন্য লগিং চালু রাখুন
//       // windowWidth: input.scrollWidth,  // যদি কন্টেন্ট স্ক্রল হয়, পুরোটা ক্যাপচার করার জন্য
//       // windowHeight: input.scrollHeight, // যদি কন্টেন্ট স্ক্রল হয়, পুরোটা ক্যাপচার করার জন্য
//     }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4"); // "p" মানে পোর্ট্রেট, "mm" মানে মিলিমিটার, "a4" মানে A4 সাইজ
//       const imgProps = pdf.getImageProperties(imgData);

//       // A4 পেজের প্রস্থ এবং উচ্চতা
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // ছবির অনুপাত বজায় রেখে উচ্চতা গণনা

//       // PDF এ ছবি যোগ করুন
//       // 0, 0 মানে x, y স্থানাঙ্ক (উপরে-বামে শুরু)
//       pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
//       pdf.save(`${challanNo || "Delivery"}.pdf`);

//       // --- PDF তৈরি হওয়ার পর মূল স্টাইল restore করা ---
//       // মূল এলিমেন্টগুলো ফিরিয়ে আনুন
//       originals.forEach(({ element, parent, replacement }) => {
//         parent.replaceChild(element, replacement);
//       });

//       // মূল কন্টেইনারের স্টাইলগুলো restore করুন
//       input.style.width = originalWidth;
//       input.style.maxWidth = originalMaxWidth;
//       input.style.padding = originalPadding;
//       input.style.margin = originalMargin;
//       input.style.backgroundColor = ""; // ব্যাকগ্রাউন্ড কালার সরাুন
//       input.style.position = originalPosition; // পজিশন restore করুন

//       // বাটনগুলো আবার দেখান
//       buttons.forEach((btn) => (btn.style.display = "block"));

//       // অস্থায়ী স্টাইল ট্যাগ সরান
//       document.head.removeChild(style);
//     });
//   };

//   return (
//     <div className="w-full flex flex-col items-center bg-white">
//       {isSubmitting && (
//         <div className="fixed inset-0 bg-gray-100 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-16 w-16"></div>
//           <p className="ml-4 text-lg font-semibold">Submitting...</p>
//         </div>
//       )}

//       {/* pdfRef এখানে সেট করা আছে, যা html2canvas ক্যাপচার করবে */}
//       <div
//         className="w-full flex flex-col items-center justify-center p-2 bg-opacity-30 bg-white"
//         ref={pdfRef}
//       >
//         <div className="w-full flex flex-col items-center justify-center p-6">
//           <div className="w-full p-6 bg-opacity-30 bg-white">
//             <CompanyPad needUseFor={"Packing List"} />{" "}
//             {/* Packing List এডিট করা হয়েছে */}
//             <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2">
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Delivery Date:
//                 </label>
//                 <input
//                   type="date"
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2"
//                   value={deliveryDate}
//                   onChange={(e) => setDeliveryDate(e.target.value)}
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Challan No:
//                 </label>
//                 <input
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                   value={challanNo}
//                   readOnly
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Party's Name:
//                 </label>
//                 <select
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2"
//                   value={selectedParty}
//                   onChange={(e) => handlePartyChange(e.target.value)}
//                 >
//                   <option value="">Select Party</option>
//                   {parties.map((p, i) => (
//                     <option key={i} value={p}>
//                       {p}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Address:
//                 </label>
//                 <input
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                   value={address}
//                   readOnly
//                 />
//               </div>
//               {selectedParty && (
//                 <button
//                   onClick={addTable}
//                   className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   + Add Table
//                 </button>
//               )}
//             </div>
//             {/* এখানে প্রতিটি টেবিল রেন্ডার করা হয়েছে */}
//             <div className="grid grid-cols-5 gap-4">
//               {tables.map((table, tIndex) => {
//                 const { totalGreige, totalFinishing } = calculateTableTotals(
//                   table.rows
//                 );

//                 return (
//                   <div
//                     key={tIndex}
//                     className="bg-white p-4 rounded shadow border col-span-1 relative text-sm"
//                   >
//                     <button
//                       className="absolute top-1 right-1 text-red-500 font-bold"
//                       onClick={() => removeTable(tIndex)}
//                     >
//                       ✕
//                     </button>

//                     <div className="grid grid-cols-2 items-center justify-between text-left text-sm">
//                       <label className="text-sm font-mono pdf-table-header">
//                         Lot Number
//                       </label>
//                       <select
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         value={table.lot}
//                         onChange={(e) =>
//                           handleLotChange(e.target.value, tIndex)
//                         }
//                       >
//                         <option value="">Select Lot</option>
//                         {lots.map((lot, i) => (
//                           <option className="text-sm" key={i} value={lot}>
//                             {lot}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono pdf-table-header">
//                         Type
//                       </label>
//                       <input
//                         value={table.type}
//                         readOnly
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         placeholder="Type"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono ">Design</label>{" "}
//                       {/* Typo 'Degien' corrected to 'Design' */}
//                       <input
//                         value={table.design}
//                         readOnly
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         placeholder="Type"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono pdf-table-header">
//                         Color
//                       </label>
//                       <select
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         value={table.color}
//                         onChange={(e) =>
//                           handleColorChange(e.target.value, tIndex)
//                         }
//                       >
//                         <option value="">Select Color</option>
//                         {table.colorOptions.map((color, i) => (
//                           <option className="text-sm" key={i} value={color}>
//                             {color}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 font-semibold text-gray-600 mb-1 text-sm pdf-table-header">
//                       <div>Greige</div>
//                       <div>Finishing</div>
//                     </div>
//                     {table.rows.map((row, rIndex) => (
//                       <div key={rIndex} className="grid grid-cols-2 gap-2 mb-1">
//                         <input
//                           value={row.griege}
//                           readOnly
//                           className="border px-2 py-1 rounded bg-gray-100 pdf-table-cell"
//                         />
//                         <input
//                           value={row.finishing}
//                           readOnly
//                           className="border px-2 py-1 rounded bg-gray-100 pdf-table-cell"
//                         />
//                       </div>
//                     ))}

//                     <div className="mt-2 pt-2 border-t border-gray-300">
//                       <div className="grid grid-cols-2 gap-1 pdf-table-header">
//                         <div className="font-semibold">Greige:</div>
//                         <div className="text-right font-medium">
//                           {totalGreige}
//                         </div>
//                         <div className="font-semibold">Finishing:</div>
//                         <div className="text-right font-medium">
//                           {totalFinishing}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//             {tables.length > 0 && (
//               <>
//                 <div className="mt-8 bg-white p-4 rounded shadow w-full">
//                   <h2 className="text-lg font-bold mb-4">Summary</h2>
//                   <table className="w-full table-auto border-collapse">
//                     <thead>
//                       <tr className="bg-gray-200 text-center">
//                         <th className="border px-2 py-1 pdf-table-header">
//                           Type
//                         </th>
//                         <th className="border px-2 py-1 pdf-table-header">
//                           Greige Total (Gaj)
//                         </th>
//                         <th className="border px-2 py-1 pdf-table-header">
//                           Finishing Total (Gaj)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getSummary().map((item, idx) => (
//                         <tr key={idx}>
//                           <td className="border px-2 py-1 pdf-table-cell">
//                             {item.type}
//                           </td>
//                           <td className="border px-2 py-1 pdf-table-cell">
//                             {item.greige.toFixed(2)}
//                           </td>
//                           <td className="border px-2 py-1 pdf-table-cell">
//                             {item.finishing.toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="mt-6 w-full">
//                   <label className="font-semibold text-gray-700 block mb-2 pdf-table-header">
//                     Comments:
//                   </label>
//                   <textarea
//                     rows={3}
//                     className="w-full border border-gray-300 rounded px-3 py-2 pdf-text-replacement"
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                     placeholder="Enter any additional comments..."
//                   />
//                 </div>
//                 <Signature />
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-center gap-4">
//         <button
//           onClick={handleDownloadPDF}
//           className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
//         >
//           Download PDF
//         </button>
//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className={`px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 ${
//             isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isSubmitting ? "Submitting..." : "Submit"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Delivery;
// import { useState, useEffect, useRef, forwardRef } from "react";
// import { useReactToPrint } from "react-to-print";
// import CompanyPad from "./CompanyPad";
// import Signature from "./Signature";

// const baseUrl = "https://hcml-ry8s.vercel.app/griegein";

// // PrintableContent কম্পোনেন্টটি ঠিক আছে
// const PrintableContent = forwardRef(
//   (
//     {
//       deliveryDate,
//       challanNo,
//       selectedParty,
//       address,
//       tables,
//       comments,
//       calculateTableTotals,
//       getSummary,
//     },
//     ref
//   ) => {
//     return (
//       <div
//         ref={ref} // এখানে ref ঠিক আছে
//         className="w-full flex flex-col items-center justify-center p-2 bg-opacity-30 bg-white"
//       >
//         <div className="w-full flex flex-col items-center justify-center p-6">
//           <div className="w-full p-6 bg-opacity-30 bg-white">
//             <CompanyPad needUseFor={"Packing List"} />
//             <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2">
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Delivery Date:
//                 </label>
//                 <input
//                   type="date"
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2"
//                   value={deliveryDate}
//                   readOnly
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Challan No:
//                 </label>
//                 <input
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                   value={challanNo}
//                   readOnly
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Party's Name:
//                 </label>
//                 <input
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                   value={selectedParty}
//                   readOnly
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Address:
//                 </label>
//                 <input
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                   value={address}
//                   readOnly
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-5 gap-4">
//               {tables.map((table, tIndex) => {
//                 const { totalGreige, totalFinishing } = calculateTableTotals(
//                   table.rows
//                 );

//                 return (
//                   <div
//                     key={tIndex}
//                     className="bg-white p-4 rounded shadow border col-span-1 relative text-sm"
//                   >
//                     <div className="grid grid-cols-2 items-center justify-between text-left text-sm">
//                       <label className="text-sm font-mono">Lot Number</label>
//                       <input
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         value={table.lot}
//                         readOnly
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono">Type</label>
//                       <input
//                         value={table.type}
//                         readOnly
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         placeholder="Type"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono ">Design</label>
//                       <input
//                         value={table.design}
//                         readOnly
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         placeholder="Type"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono">Color</label>
//                       <input
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         value={table.color}
//                         readOnly
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 font-semibold text-gray-600 mb-1 text-sm">
//                       <div>Greige</div>
//                       <div>Finishing</div>
//                     </div>
//                     {table.rows.map((row, rIndex) => (
//                       <div key={rIndex} className="grid grid-cols-2 gap-2 mb-1">
//                         <input
//                           value={row.griege}
//                           readOnly
//                           className="border px-2 py-1 rounded bg-gray-100"
//                         />
//                         <input
//                           value={row.finishing}
//                           readOnly
//                           className="border px-2 py-1 rounded bg-gray-100"
//                         />
//                       </div>
//                     ))}

//                     <div className="mt-2 pt-2 border-t border-gray-300">
//                       <div className="grid grid-cols-2 gap-1">
//                         <div className="font-semibold">Greige:</div>
//                         <div className="text-right font-medium">
//                           {totalGreige}
//                         </div>
//                         <div className="font-semibold">Finishing:</div>
//                         <div className="text-right font-medium">
//                           {totalFinishing}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {tables.length > 0 && (
//               <>
//                 <div className="mt-8 bg-white p-4 rounded shadow w-full">
//                   <h2 className="text-lg font-bold mb-4">Summary</h2>
//                   <table className="w-full table-auto border-collapse">
//                     <thead>
//                       <tr className="bg-gray-200 text-center">
//                         <th className="border px-2 py-1">Type</th>
//                         <th className="border px-2 py-1">Greige Total (Gaj)</th>
//                         <th className="border px-2 py-1">
//                           Finishing Total (Gaj)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getSummary().map((item, idx) => (
//                         <tr key={idx}>
//                           <td className="border px-2 py-1">{item.type}</td>
//                           <td className="border px-2 py-1">
//                             {item.greige.toFixed(2)}
//                           </td>
//                           <td className="border px-2 py-1">
//                             {item.finishing.toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="mt-6 w-full">
//                   <label className="font-semibold text-gray-700 block mb-2">
//                     Comments:
//                   </label>
//                   <textarea
//                     rows={3}
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                     value={comments}
//                     readOnly
//                   />
//                 </div>

//                 <Signature />
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// function Delivery() {
//   const [parties, setParties] = useState([]);
//   const [selectedParty, setSelectedParty] = useState("");
//   const [address, setAddress] = useState("");
//   const [lots, setLots] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [comments, setComments] = useState("");
//   const [deliveryDate, setDeliveryDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   });
//   const [challanNo, setChallanNo] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // useRef এর সঠিক টাইপিং (TypeScript-এ যদি ব্যবহার করেন)
//   const componentRef = useRef(null);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [partyRes, challanRes] = await Promise.all([
//           fetch(`${baseUrl}/party`),
//           fetch(`${baseUrl}/lastchallan`),
//         ]);
//         const partyData = await partyRes.json();
//         setParties(partyData);
//         const challanData = await challanRes.json();
//         setChallanNo(challanData.lastChallan || "DC-250618001");
//       } catch (error) {
//         console.error("Initial fetch error:", error);
//         setChallanNo("DC-250618001");
//       }
//     };
//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     if (!selectedParty) {
//       setAddress("");
//       return;
//     }
//     fetch(`${baseUrl}/getaddress?party=${encodeURIComponent(selectedParty)}`)
//       .then((res) => res.json())
//       .then((data) => setAddress(data?.address || ""))
//       .catch(() => setAddress(""));
//   }, [selectedParty]);

//   const handlePartyChange = async (party) => {
//     setSelectedParty(party);
//     setTables([]);
//     try {
//       const lotRes = await fetch(
//         `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
//       );
//       const lotData = await lotRes.json();
//       setLots(lotData);
//     } catch (error) {
//       console.error("Error fetching lots:", error);
//       alert("Failed to load lots.");
//     }
//   };

//   const addTable = () => {
//     setTables((prev) => [
//       ...prev,
//       { lot: "", type: "", design: "", color: "", colorOptions: [], rows: [] },
//     ]);
//   };

//   const removeTable = (index) => {
//     setTables((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleLotChange = async (lot, index) => {
//     try {
//       const [infoRes, colorRes] = await Promise.all([
//         fetch(`${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`),
//         fetch(`${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`),
//       ]);
//       const lotInfo = await infoRes.json();
//       const colorData = await colorRes.json();
//       setTables((prev) => {
//         const t = [...prev];
//         t[index] = {
//           ...t[index],
//           lot,
//           type: lotInfo?.info?.type || "",
//           design: lotInfo?.info?.design || "",
//           color: "",
//           colorOptions: colorData?.colors || [],
//           rows: [],
//         };
//         return t;
//       });
//     } catch (error) {
//       console.error("handleLotChange error:", error);
//       alert("Could not load lot info");
//     }
//   };

//   const handleColorChange = async (color, index) => {
//     try {
//       const lot = tables[index].lot;
//       const detailRes = await fetch(
//         `${baseUrl}/detailsres?lot=${lot}&color=${encodeURIComponent(color)}`
//       );
//       const detailData = await detailRes.json();
//       const validRows = detailData.rows.filter(
//         (row) => row.finishing !== "" && row.status !== "Delivered"
//       );
//       setTables((prev) => {
//         const t = [...prev];
//         t[index] = { ...t[index], color, rows: validRows };
//         return t;
//       });
//     } catch (error) {
//       console.error("handleColorChange error:", error);
//       alert("Color loading failed: " + error.message);
//     }
//   };

//   const calculateTableTotals = (rows) => {
//     let totalGreige = 0,
//       totalFinishing = 0;
//     rows.forEach(({ griege, finishing }) => {
//       const g = parseFloat(griege);
//       const f = parseFloat(finishing);
//       if (!isNaN(g)) totalGreige += g;
//       if (!isNaN(f)) totalFinishing += f;
//     });
//     return {
//       totalGreige: totalGreige.toFixed(2),
//       totalFinishing: totalFinishing.toFixed(2),
//     };
//   };

//   const getSummary = () => {
//     const summary = {};
//     tables.forEach(({ type, rows }) => {
//       if (!type || rows.length === 0) return;
//       const key = `${type}`;
//       if (!summary[key]) summary[key] = { type, greige: 0, finishing: 0 };
//       rows.forEach(({ griege, finishing }) => {
//         const g = parseFloat(griege);
//         const f = parseFloat(finishing);
//         if (!isNaN(g)) summary[key].greige += g;
//         if (!isNaN(f)) summary[key].finishing += f;
//       });
//     });
//     return Object.values(summary);
//   };

//   const payload = {
//     deliveryDate,
//     challanNo,
//     selectedParty,
//     tables,
//     deliveredBy: localStorage.getItem("username"),
//     comments,
//   };

//   const DeliveryUpdate = async () => {
//     try {
//       await fetch(`${baseUrl}/delivarydata`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!tables.some((t) => t.rows.length > 0)) {
//       alert("No valid data to submit.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       for (const table of tables) {
//         if (table.lot && table.color && table.rows.length > 0) {
//           const res = await fetch(`${baseUrl}/griegeupdate`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ lot: table.lot, color: table.color }),
//           });
//           if (!res.ok) throw new Error(await res.text());
//           await DeliveryUpdate();
//         }
//       }
//       alert("Status updated to Delivered.");
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

//   const handlePrint = useReactToPrint({
//     content: () => {
//       console.log("ref:", componentRef.current); // এটা যুক্ত করুন
//       return componentRef.current;
//     },
//   });
//   // const handlePrint = useReactToPrint({
//   //   content: () => componentRef.current,

//   //   documentTitle: `${challanNo || "Delivery"}`,
//   //   pageStyle: `
//   //     @page {
//   //       size: A4;
//   //       margin: 10mm;
//   //     }
//   //     @media print {
//   //       body {
//   //         -webkit-print-color-adjust: exact;
//   //       }
//   //       /* প্রিন্ট করার সময় ফর্ম কন্ট্রোলগুলি লুকানোর জন্য */
//   //       .print-only-display { display: block !important; }
//   //       .no-print { display: none !important; }
//   //     }
//   //     /* ওয়েব ভিউতে প্রিন্ট-শুধুমাত্র উপাদানগুলি লুকানোর জন্য */
//   //     .print-only-display { display: none; }
//   //   `,
//   // });

//   return (
//     <div className="w-full flex flex-col items-center bg-white">
//       {/* Hidden printable content */}
//       <div style={{ display: "none print:block" }}>
//         <PrintableContent
//           // <-- এখানে 'Ref' কে 'ref' এ পরিবর্তন করুন
//           deliveryDate={deliveryDate}
//           challanNo={challanNo}
//           selectedParty={selectedParty}
//           address={address}
//           tables={tables}
//           comments={comments}
//           calculateTableTotals={calculateTableTotals}
//           getSummary={getSummary}
//           ref={componentRef}
//         />
//       </div>
//       {isSubmitting && (
//         <div className="fixed inset-0 bg-gray-100 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-16 w-16"></div>
//           <p className="ml-4 text-lg font-semibold">Submitting...</p>
//         </div>
//       )}

//       {/* Main interactive form */}
//       <div className="w-full flex flex-col items-center justify-center p-2 bg-opacity-30 bg-white">
//         <div className="w-full flex flex-col items-center justify-center p-6">
//           <div className="w-full p-6 bg-opacity-30 bg-white">
//             <CompanyPad needUseFor={"Packing List"} />
//             <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2">
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Delivery Date:
//                 </label>
//                 <input
//                   type="date"
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2"
//                   value={deliveryDate}
//                   onChange={(e) => setDeliveryDate(e.target.value)}
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Challan No:
//                 </label>
//                 <input
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                   value={challanNo}
//                   readOnly
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Party's Name:
//                 </label>
//                 <select
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2"
//                   value={selectedParty}
//                   onChange={(e) => handlePartyChange(e.target.value)}
//                 >
//                   <option value="">Select Party</option>
//                   {parties.map((p, i) => (
//                     <option key={i} value={p}>
//                       {p}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4 col-span-1">
//                 <label className="font-semibold text-gray-700 col-span-1">
//                   Address:
//                 </label>
//                 <input
//                   className="col-span-2 border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                   value={address}
//                   readOnly
//                 />
//               </div>
//               {selectedParty && (
//                 <button
//                   onClick={addTable}
//                   className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 no-print" // Add no-print class
//                 >
//                   + Add Table
//                 </button>
//               )}
//             </div>

//             <div className="grid grid-cols-5 gap-4">
//               {tables.map((table, tIndex) => {
//                 const { totalGreige, totalFinishing } = calculateTableTotals(
//                   table.rows
//                 );

//                 return (
//                   <div
//                     key={tIndex}
//                     className="bg-white p-4 rounded shadow border col-span-1 relative text-sm"
//                   >
//                     <button
//                       className="absolute top-1 right-1 text-red-500 font-bold no-print" // Add no-print class
//                       onClick={() => removeTable(tIndex)}
//                     >
//                       ✕
//                     </button>

//                     <div className="grid grid-cols-2 items-center justify-between text-left text-sm">
//                       <label className="text-sm font-mono">Lot Number</label>
//                       <select
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         value={table.lot}
//                         onChange={(e) =>
//                           handleLotChange(e.target.value, tIndex)
//                         }
//                       >
//                         <option value="">Select Lot</option>
//                         {lots.map((lot, i) => (
//                           <option className="text-sm" key={i} value={lot}>
//                             {lot}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono">Type</label>
//                       <input
//                         value={table.type}
//                         readOnly
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         placeholder="Type"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono ">Design</label>
//                       <input
//                         value={table.design}
//                         readOnly
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         placeholder="Type"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 items-center justify-between text-left">
//                       <label className="text-sm font-mono">Color</label>
//                       <select
//                         className="mb-2 border px-2 py-1 rounded col-span-1 text-sm"
//                         value={table.color}
//                         onChange={(e) =>
//                           handleColorChange(e.target.value, tIndex)
//                         }
//                       >
//                         <option value="">Select Color</option>
//                         {table.colorOptions.map((color, i) => (
//                           <option className="text-sm" key={i} value={color}>
//                             {color}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 font-semibold text-gray-600 mb-1 text-sm">
//                       <div>Greige</div>
//                       <div>Finishing</div>
//                     </div>
//                     {table.rows.map((row, rIndex) => (
//                       <div key={rIndex} className="grid grid-cols-2 gap-2 mb-1">
//                         <input
//                           value={row.griege}
//                           readOnly
//                           className="border px-2 py-1 rounded bg-gray-100"
//                         />
//                         <input
//                           value={row.finishing}
//                           readOnly
//                           className="border px-2 py-1 rounded bg-gray-100"
//                         />
//                       </div>
//                     ))}

//                     <div className="mt-2 pt-2 border-t border-gray-300">
//                       <div className="grid grid-cols-2 gap-1">
//                         <div className="font-semibold">Greige:</div>
//                         <div className="text-right font-medium">
//                           {totalGreige}
//                         </div>
//                         <div className="font-semibold">Finishing:</div>
//                         <div className="text-right font-medium">
//                           {totalFinishing}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {tables.length > 0 && (
//               <>
//                 <div className="mt-8 bg-white p-4 rounded shadow w-full">
//                   <h2 className="text-lg font-bold mb-4">Summary</h2>
//                   <table className="w-full table-auto border-collapse">
//                     <thead>
//                       <tr className="bg-gray-200 text-center">
//                         <th className="border px-2 py-1">Type</th>
//                         <th className="border px-2 py-1">Greige Total (Gaj)</th>
//                         <th className="border px-2 py-1">
//                           Finishing Total (Gaj)
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {getSummary().map((item, idx) => (
//                         <tr key={idx}>
//                           <td className="border px-2 py-1">{item.type}</td>
//                           <td className="border px-2 py-1">
//                             {item.greige.toFixed(2)}
//                           </td>
//                           <td className="border px-2 py-1">
//                             {item.finishing.toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="mt-6 w-full">
//                   <label className="font-semibold text-gray-700 block mb-2">
//                     Comments:
//                   </label>
//                   <textarea
//                     rows={3}
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                     value={comments}
//                     onChange={(e) => setComments(e.target.value)}
//                     placeholder="Enter any additional comments..."
//                   />
//                 </div>

//                 <Signature />
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-center gap-4 no-print">
//         {" "}
//         {/* Add no-print class */}
//         <button
//           onClick={handlePrint}
//           className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
//         >
//           Print Challan
//         </button>
//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className={`px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 ${
//             isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isSubmitting ? "Submitting..." : "Submit"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Delivery;
import { useState, useEffect } from "react";
import CompanyPad from "./CompanyPad";
import Signature from "./Signature";

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
      .catch(() => setAddress(""));
  }, [selectedParty]);

  const handlePartyChange = async (party) => {
    setSelectedParty(party);
    setTables([]);
    try {
      const lotRes = await fetch(
        `${baseUrl}/getlots?party=${encodeURIComponent(party)}`
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
        fetch(`${baseUrl}/getlotinfo?lot=${encodeURIComponent(lot)}`),
        fetch(`${baseUrl}/colorres?lot=${encodeURIComponent(lot)}`),
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
        `${baseUrl}/detailsres?lot=${lot}&color=${encodeURIComponent(color)}`
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
      await fetch(`${baseUrl}/delivarydata`, {
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
          const res = await fetch(`${baseUrl}/griegeupdate`, {
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
    <div className="w-full flex flex-col items-center bg-white">
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
                        <th className="border px-2 py-1">Greige Total (Gaj)</th>
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

                <Signature />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
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
  );
}

export default Delivery;
