// import { useEffect, useState } from "react";

// export default function LotEntryForm() {
//   const [partyListOptions, setPartyListOptions] = useState([]);
//   const [form, setForm] = useState({
//     lotNo: "",
//     date: "",
//     party: "",
//     fabric: "",
//     quality: "",
//     than: "",
//     totalGaj: "",
//     unit: "",
//     action: [],
//   });

//   const processOptions = [
//     "Dyeing",
//     "Printing",
//     "Finishing",
//     "Washing",
//     "Packing",
//   ];

//   useEffect(() => {
//     const getNextLotNo = async () => {
//       try {
//         const res = await fetch("https://hcml-ry8s.vercel.app/griegein");
//         const data = await res.json();
//         const nextLot = parseInt(data) + 1;
//         setForm((prev) => ({ ...prev, lotNo: nextLot.toString() }));
//       } catch (error) {
//         console.error("Failed to fetch lot data:", error);
//       }
//     };

//     getNextLotNo();
//   }, []);

//   useEffect(() => {
//     const getAllParty = async () => {
//       try {
//         const res = await fetch("https://hcml-ry8s.vercel.app/party");
//         const data = await res.json();
//         setPartyListOptions(data);
//       } catch (error) {
//         console.error("Failed to fetch lot data:", error);
//       }
//     };

//     getAllParty();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setForm((prev) => ({ ...prev, action: [...prev.action, value] }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         action: prev.action.filter((item) => item !== value),
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...form,
//       action: form.action.join(", "),
//     };

//     try {
//       const response = await fetch("https://hcml-ry8s.vercel.app/griegein", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();
//       if (result.result === "success") {
//         alert("Data saved successfully!");
//         // reset form, except lotNo (could refresh next lot here if needed)
//         setForm({
//           lotNo: "", // or set next lot again
//           date: "",
//           party: "",
//           fabric: "",
//           quality: "",
//           than: "",
//           totalGaj: "",
//           unit: "",
//           action: [],
//         });
//       } else {
//         alert("Failed to save data!");
//       }
//     } catch (error) {
//       alert("Error: " + error.message);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto p-6 bg-white shadow rounded space-y-4 text-black"
//     >
//       <h2 className="text-xl font-bold mb-4">Lot Entry Form</h2>

//       <input
//         name="lotNo"
//         value={form.lotNo}
//         onChange={handleChange}
//         placeholder="Lot Number"
//         required
//         className="border p-2 w-full"
//         readOnly
//       />
//       <input
//         type="date"
//         name="date"
//         value={form.date}
//         onChange={handleChange}
//         required
//         className="border p-2 w-full"
//       />
//       <input
//         type="text"
//         name="party"
//         list="partyNameListOptions"
//         value={form.party}
//         onChange={handleChange}
//         placeholder="Party Name"
//         required
//         className="border p-2 w-full"
//       />
//       <datalist id="partyNameListOptions">
//         {[...new Set(partyListOptions)].sort().map((item) => (
//           <option key={item} value={item} />
//         ))}
//       </datalist>

//       <input
//         name="fabric"
//         value={form.fabric}
//         onChange={handleChange}
//         placeholder="Fabric Type"
//         required
//         className="border p-2 w-full"
//       />
//       <input
//         name="quality"
//         value={form.quality}
//         onChange={handleChange}
//         placeholder="Fabric Quality"
//         required
//         className="border p-2 w-full"
//       />
//       <input
//         name="than"
//         value={form.than}
//         onChange={handleChange}
//         placeholder="No. of Thans"
//         required
//         className="border p-2 w-full"
//       />
//       <input
//         name="totalGaj"
//         value={form.totalGaj}
//         onChange={handleChange}
//         placeholder="Total Gaj"
//         required
//         className="border p-2 w-full"
//       />
//       <input
//         name="unit"
//         value={form.unit}
//         onChange={handleChange}
//         placeholder="Unit (e.g., Yards)"
//         required
//         className="border p-2 w-full"
//       />

//       <div>
//         <label className="block font-semibold mb-1">কার্যাবলী (Actions)</label>
//         <div className="flex flex-wrap gap-4">
//           {processOptions.map((option) => (
//             <label key={option} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 value={option}
//                 checked={form.action.includes(option)}
//                 onChange={handleCheckboxChange}
//               />
//               <span>{option}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//       >
//         Submit
//       </button>
//     </form>
//   );
// }

import { useEffect, useState } from "react";

export default function LotEntryForm() {
  const [partyListOptions, setPartyListOptions] = useState([]);
  const [thans, setThans] = useState([]);
  const [form, setForm] = useState({
    lotNo: "",
    date: "",
    party: "",
    fabric: "",
    quality: "",
    unit: "",
    action: [],
    tempThanGaj: "", // for current input
  });

  const processOptions = [
    "Dyeing",
    "Printing",
    "Finishing",
    "Washing",
    "Packing",
  ];

  useEffect(() => {
    const getNextLotNo = async () => {
      try {
        const res = await fetch("https://hcml-ry8s.vercel.app/griegein");
        const data = await res.json();
        const nextLot = parseInt(data) + 1;
        setForm((prev) => ({ ...prev, lotNo: nextLot.toString() }));
      } catch (error) {
        console.error("Failed to fetch lot data:", error);
      }
    };
    getNextLotNo();
  }, []);

  useEffect(() => {
    const getAllParty = async () => {
      try {
        const res = await fetch("https://hcml-ry8s.vercel.app/party");
        const data = await res.json();
        setPartyListOptions(data);
      } catch (error) {
        console.error("Failed to fetch party data:", error);
      }
    };
    getAllParty();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm((prev) => ({ ...prev, action: [...prev.action, value] }));
    } else {
      setForm((prev) => ({
        ...prev,
        action: prev.action.filter((item) => item !== value),
      }));
    }
  };

  const handleAddThan = () => {
    if (!form.tempThanGaj) return;
    setThans([...thans, form.tempThanGaj]);
    setForm({ ...form, tempThanGaj: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalGaj = thans.reduce((sum, val) => sum + parseFloat(val || 0), 0);

    const lotPayload = {
      lotNo: form.lotNo,
      date: form.date,
      party: form.party,
      fabric: form.fabric,
      quality: form.quality,
      unit: form.unit,
      than: thans.length.toString(),
      totalGaj: totalGaj.toString(),
      action: form.action.join(", "),
    };

    const thanDetails = thans.map((gaj) => ({
      lotNo: form.lotNo,
      gaj,
    }));

    const fullPayload = {
      ...lotPayload,
      thanDetails,
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
        {
          method: "POST",
          body: JSON.stringify(fullPayload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.result === "success") {
        alert("Data saved successfully!");
        setForm({
          lotNo: "",
          date: "",
          party: "",
          fabric: "",
          quality: "",
          unit: "",
          action: [],
          tempThanGaj: "",
        });
        setThans([]);
      } else {
        alert("Failed to save data!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded space-y-4 text-black"
    >
      <h2 className="text-xl font-bold mb-4">Lot Entry Form</h2>

      <input
        name="lotNo"
        value={form.lotNo}
        onChange={handleChange}
        placeholder="Lot Number"
        className="border p-2 w-full"
        readOnly
        required
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="party"
        list="partyNameListOptions"
        value={form.party}
        onChange={handleChange}
        placeholder="Party Name"
        className="border p-2 w-full"
        required
      />
      <datalist id="partyNameListOptions">
        {[...new Set(partyListOptions)].sort().map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      <input
        name="fabric"
        value={form.fabric}
        onChange={handleChange}
        placeholder="Fabric Type"
        className="border p-2 w-full"
        required
      />
      <input
        name="quality"
        value={form.quality}
        onChange={handleChange}
        placeholder="Fabric Quality"
        className="border p-2 w-full"
        required
      />
      <input
        name="unit"
        value={form.unit}
        onChange={handleChange}
        placeholder="Unit (e.g., Yards)"
        className="border p-2 w-full"
        required
      />
      <input
        name="unit"
        value={thans.reduce((sum, val) => sum + parseFloat(val || 0), 0)}
        placeholder="Unit (e.g., Yards)"
        className="border p-2 w-full"
        required
      />

      <div>
        <label className="block font-semibold mb-1">Thans (Per Gaj)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            name="tempThanGaj"
            value={form.tempThanGaj}
            onChange={handleChange}
            placeholder="Enter gaj"
            className="border p-2 flex-1"
          />
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleAddThan}
          >
            Add
          </button>
        </div>
        {thans.length > 0 && (
          <ul className="list-disc list-inside bg-gray-50 p-2 rounded">
            {thans.map((gaj, idx) => (
              <li key={idx}>
                Than {idx + 1}: {gaj} Gaj
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">কার্যাবলী (Actions)</label>
        <div className="flex flex-wrap gap-4">
          {processOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option}
                checked={form.action.includes(option)}
                onChange={handleCheckboxChange}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
