// import React, { useState, useEffect } from "react";

// const ColorPurchaseForm = () => {
//   const [colorMap, setColorMap] = useState({});
//   const [vendorMap, setVendorMap] = useState([]);
//   const [formData, setFormData] = useState({
//     date: "",
//     colorName: "",
//     category: "",
//     vendor: "",
//     memo: "",
//     qtyKg: "",
//     pricePerKg: "",
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchColorMap = async () => {
//       try {
//         const res = await fetch("https://hcml-ry8s.vercel.app/color");
//         const data = await res.json();
//         setColorMap(data);
//       } catch (error) {
//         console.error("Failed to fetch colors:", error);
//       }
//     };
//     fetchColorMap();
//   }, []);

//   useEffect(() => {
//     const getVendorData = async () => {
//       try {
//         const res = await fetch("https://hcml-ry8s.vercel.app/vendor");
//         const data = await res.json();
//         setVendorMap(data);
//       } catch (error) {
//         console.error("Failed to fetch colors:", error);
//       }
//     };
//     getVendorData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "colorName") {
//       const category = colorMap[value] || "";
//       setFormData((prev) => ({
//         ...prev,
//         colorName: value,
//         category: category,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const stockUpdate = async () => {
//     try {
//       const response = await fetch(`https://hcml-ry8s.vercel.app/stock/add`, {
//         method: "POST",
//         body: JSON.stringify({
//           colorName: formData.colorName,
//           qty: formData.qtyKg,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.text(); // Apps Script সাধারণত text output দেয়
//       alert(result);
//     } catch (error) {
//       console.error("Error updating product:", error);
//       alert("Update failed!");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("Submitting purchase...");

//     try {
//       const response = await fetch("https://hcml-ry8s.vercel.app/proxy", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       if (result.success) {
//         setMessage("✅ Purchase submitted! Updating stock...");
//         stockUpdate();
//       } else {
//         setMessage("❌ Failed to submit purchase");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       setMessage("❌ Submission failed. Try again.");
//     }

//     setLoading(false);

//     // Reset form only after successful operations
//     if (message.includes("success")) {
//       setTimeout(() => {
//         setFormData({
//           date: "",
//           colorName: "",
//           category: "",
//           vendor: "",
//           memo: "",
//           qtyKg: "",
//           pricePerKg: "",
//         });
//         setMessage("");
//       }, 3000);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
//       <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">
//         🎨 Color Purchase Entry
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6 text-black">
//         {/* Row 1: Date & Color Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-xl"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Color Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="colorName"
//               list="colorNameOptions"
//               value={formData.colorName}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-xl"
//             />
//             <datalist id="colorNameOptions">
//               {Object.keys(colorMap).map((color, index) => (
//                 <option key={index} value={color} />
//               ))}
//             </datalist>
//           </div>
//         </div>

//         {/* Row 2: Category & Vendor... */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Category
//             </label>
//             <input
//               type="text"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               readOnly
//               className="w-full px-4 py-2 border rounded-xl bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Vendor
//             </label>
//             <select
//               name="vendor"
//               value={formData.vendor}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-xl"
//             >
//               {vendorMap.map((v, i) => (
//                 <option key={i} value={v}>
//                   {v}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Memo */}
//         <div>
//           <label className="block text-sm font-medium text-gray-600 mb-1">
//             Memo
//           </label>
//           <input
//             type="text"
//             name="memo"
//             value={formData.memo}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-xl"
//           />
//         </div>

//         {/* Quantity & Price */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Quantity (KG)
//             </label>
//             <input
//               type="number"
//               name="qtyKg"
//               value={formData.qtyKg}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-xl"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">
//               Price per KG
//             </label>
//             <input
//               type="number"
//               name="pricePerKg"
//               value={formData.pricePerKg}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border rounded-xl"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold"
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>

//         {message && (
//           <p
//             className="text-center mt-4 font-semibold text-lg animate-pulse"
//             style={
//               message.includes("✅") ? { color: "green" } : { color: "red" }
//             }
//           >
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ColorPurchaseForm;

import React, { useState, useEffect } from "react";

const ColorPurchaseForm = () => {
  const [colorMap, setColorMap] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    colorName: "",
    category: "",
    vendor: "",
    memo: "",
    qtyKg: "",
    pricePerKg: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch color map
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/color")
      .then((res) => res.json())
      .then(setColorMap)
      .catch((err) => console.error("Failed to fetch colors:", err));
  }, []);

  // Fetch vendor list
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/vendor")
      .then((res) => res.json())
      .then(setVendorList)
      .catch((err) => console.error("Failed to fetch vendors:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "colorName") {
      setFormData((prev) => ({
        ...prev,
        colorName: value,
        category: colorMap[value] || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const updateStock = async () => {
    try {
      const res = await fetch("https://hcml-ry8s.vercel.app/stock/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorName: formData.colorName,
          qty: formData.qtyKg * 1000,
        }),
      });
      const result = await res.text();
    } catch (err) {
      console.error("Stock update failed:", err);
      setMessage("Stock update failed!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Submitting purchase...");

    try {
      const res = await fetch("https://hcml-ry8s.vercel.app/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setMessage("Updating Stock...");
        await updateStock();
        setMessage("✅ Stock updated successfully...");
        setTimeout(() => {
          setFormData({
            date: "",
            colorName: "",
            category: "",
            vendor: "",
            memo: "",
            qtyKg: "",
            pricePerKg: "",
          });
          setMessage("");
        }, 3000);
      } else {
        setMessage("❌ Failed to submit purchase");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Submission failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        🎨 Color Purchase Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        {/* Date & Color Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <div>
            <FormLabel name="Color Name" required />
            <input
              type="text"
              name="colorName"
              list="colorNameOptions"
              value={formData.colorName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
            <datalist id="colorNameOptions">
              {Object.keys(colorMap).map((color, index) => (
                <option key={index} value={color} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Category & Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            readOnly
            bgGray
          />
          <div>
            <FormLabel name="Vendor" />
            <select
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            >
              <option value="">Select Vendor</option>
              {vendorList.map((vendor, index) => (
                <option key={index} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Memo */}
        <FormField
          label="Memo"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
        />

        {/* Quantity & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Quantity (KG)"
            type="number"
            name="qtyKg"
            value={formData.qtyKg}
            onChange={handleChange}
            required
          />
          <FormField
            label="Price per KG"
            type="number"
            name="pricePerKg"
            value={formData.pricePerKg}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p
            className="text-center mt-4 font-semibold text-lg animate-pulse"
            style={{ color: message.includes("✅") ? "green" : "red" }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

// Reusable Form Field Component
const FormField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  readOnly = false,
  bgGray = false,
}) => (
  <div>
    <FormLabel name={label} required={required} />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      className={`w-full px-4 py-2 border rounded-xl ${
        bgGray ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

// Reusable Label Component
const FormLabel = ({ name, required = false }) => (
  <label className="block text-sm font-medium text-gray-600 mb-1">
    {name} {required && <span className="text-red-500">*</span>}
  </label>
);

export default ColorPurchaseForm;
