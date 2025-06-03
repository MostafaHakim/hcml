// import React, { useState, useEffect } from "react";

// const DemoForm = () => {
//   const [colors, setColors] = useState([]);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("https://hcml-ry8s.vercel.app/stock")
//       .then((res) => res.json())
//       .then((data) => {
//         setColors(data);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Failed to load color stock.");
//       });
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       const res = await fetch("https://hcml-ry8s.vercel.app/stock", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           color: selectedColor,
//           quantity: quantity,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Stock updated successfully!");
//       } else {
//         alert(data.error || "Something went wrong");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Failed to update stock");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-2">Color Demand Form</h2>

//       {/* Display error message if there's any */}
//       {error && <p className="text-red-500">{error}</p>}

//       <select
//         value={selectedColor}
//         onChange={(e) => setSelectedColor(e.target.value)}
//         className="border p-2 text-black"
//       >
//         <option value="">Select Color</option>
//         {colors && colors.length > 0 ? (
//           colors.map((c, idx) => (
//             <option
//               key={idx}
//               value={c["PRODUCT NAME"]}
//               className="text-black bg-green-300"
//             >
//               {c["PRODUCT NAME"]}
//             </option>
//           ))
//         ) : (
//           <option value="">Loading colors...</option>
//         )}
//       </select>

//       <input
//         type="number"
//         placeholder="Quantity"
//         value={quantity}
//         onChange={(e) => setQuantity(e.target.value)}
//         className="border p-2 ml-2 text-black"
//       />

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-500 text-white px-4 py-2 ml-2"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default DemoForm;

import React, { useEffect, useState } from "react";

export default function ColorDemandForm() {
  const [colors, setColors] = useState([{ colorName: "", gram: "" }]);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  const addRow = () => {
    setColors([...colors, { colorName: "", gram: "" }]);
  };

  const removeRow = (index) => {
    const updated = [...colors];
    updated.splice(index, 1);
    setColors(updated);
  };

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/stock`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const response = await fetch("https://hcml-ry8s.vercel.app/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setMessage("✅ স্টক থেকে কমে গেছে এবং অন হোল্ড এ গেছে!");
        setColors([{ colorName: "", gram: "" }]); // reset form
      } else {
        setMessage("❌ সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
    } catch (error) {
      setMessage("❌ কানেকশনের সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded text-black">
      <h2 className="text-xl font-bold mb-4">Color Demand Form</h2>
      <form onSubmit={handleSubmit}>
        {colors.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <select
              placeholder="Color Name"
              onChange={(e) => handleChange(index, "colorName", e.target.value)}
              className="border p-2 flex-1 rounded"
              required
            >
              <option>---Select---</option>
              {data.map((c, i) => {
                return (
                  <option key={i} value={c["PRODUCT NAME"]}>
                    {c["PRODUCT NAME"]}
                  </option>
                );
              })}
            </select>
            <input
              type="number"
              placeholder="Gram"
              value={item.gram}
              onChange={(e) =>
                handleChange(index, "gram", parseInt(e.target.value))
              }
              className="border p-2 w-28 rounded"
              required
              min="1"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          + Add Color
        </button>
        <button
          type="submit"
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
