// import React, { useState, useEffect } from "react";

// const ColorPurchaseForm = () => {
//   const [colorMap, setColorMap] = useState({});
//   const [vendorList, setVendorList] = useState([]);
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

//   // Fetch color map
//   useEffect(() => {
//     fetch("https://hcml-ry8s.vercel.app/color")
//       .then((res) => res.json())
//       .then(setColorMap)
//       .catch((err) => console.error("Failed to fetch colors:", err));
//   }, []);

//   // Fetch vendor list and update vendorList state properly
//   useEffect(() => {
//     fetch("https://hcml-ry8s.vercel.app/vendor")
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 1) {
//           const rows = data.slice(1);
//           const vendor = rows.map((item) => item[0]);
//           setVendorList(vendor);
//         } else {
//           setVendorList([]);
//         }
//       })
//       .catch((err) => console.error("Failed to fetch vendors:", err));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "colorName") {
//       const category = value ? colorMap[value] || "" : "";
//       setFormData((prev) => ({
//         ...prev,
//         colorName: value,
//         category,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const updateStock = async () => {
//     try {
//       const res = await fetch("https://hcml-ry8s.vercel.app/stock/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           colorName: formData.colorName,
//           qty: Number(formData.qtyKg) * 1000,
//         }),
//       });
//       const result = await res.text();
//       return result;
//     } catch (err) {
//       console.error("Stock update failed:", err);
//       setMessage("Stock update failed!");
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("Submitting purchase...");

//     try {
//       const res = await fetch("https://hcml-ry8s.vercel.app/proxy", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();

//       if (result.success) {
//         setMessage("Updating Stock...");
//         const stockResult = await updateStock();
//         if (stockResult !== null) {
//           setMessage("✅ Stock updated successfully...");
//           setTimeout(() => {
//             setFormData({
//               date: "",
//               colorName: "",
//               category: "",
//               vendor: "",
//               memo: "",
//               qtyKg: "",
//               pricePerKg: "",
//             });
//             setMessage("");
//           }, 3000);
//         }
//       } else {
//         setMessage("❌ Failed to submit purchase");
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       setMessage("❌ Submission failed. Try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
//       <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">
//         🎨 Color Purchase Entry
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6 text-black">
//         {/* Date & Color Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField
//             label="Date"
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//           <div>
//             <FormLabel name="Color Name" required />
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

//         {/* Category & Vendor */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             label="Category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             readOnly
//             bgGray
//           />
//           <div>
//             <FormLabel name="Vendor" />
//             <select
//               name="vendor"
//               value={formData.vendor}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border rounded-xl"
//             >
//               <option value="">Select Vendor</option>
//               {vendorList.map((vendor, index) => (
//                 <option key={index} value={vendor}>
//                   {vendor}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Memo */}
//         <FormField
//           label="Memo"
//           name="memo"
//           value={formData.memo}
//           onChange={handleChange}
//         />

//         {/* Quantity & Price */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField
//             label="Quantity (KG)"
//             type="number"
//             name="qtyKg"
//             value={formData.qtyKg}
//             onChange={handleChange}
//             required
//           />
//           <FormField
//             label="Price per KG"
//             type="number"
//             name="pricePerKg"
//             value={formData.pricePerKg}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold"
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>

//         {message && (
//           <p
//             className={`text-center mt-4 font-semibold text-lg ${
//               message.includes("✅") ? "text-green-600" : "text-red-600"
//             } animate-pulse`}
//           >
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// };

// // Reusable Form Field Component
// const FormField = ({
//   label,
//   type = "text",
//   name,
//   value,
//   onChange,
//   required = false,
//   readOnly = false,
//   bgGray = false,
// }) => (
//   <div>
//     <FormLabel name={label} required={required} />
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       required={required}
//       readOnly={readOnly}
//       className={`w-full px-4 py-2 border rounded-xl ${
//         bgGray ? "bg-gray-100" : ""
//       }`}
//     />
//   </div>
// );

// // Reusable Label Component
// const FormLabel = ({ name, required = false }) => (
//   <label className="block text-sm font-medium text-gray-600 mb-1">
//     {name} {required && <span className="text-red-500">*</span>}
//   </label>
// );

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
      .catch((err) => {
        console.error("Failed to fetch colors:", err);
        setColorMap({});
      });
  }, []);
  console.log(colorMap);
  // Fetch vendor list
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/vendor")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          const rows = data.slice(1);
          const vendors = rows.map((item) => item[0]);
          setVendorList(vendors);
        } else {
          setVendorList([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch vendors:", err);
        setVendorList([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "colorName") {
      const category = value ? colorMap[value] || "" : "";
      setFormData((prev) => ({ ...prev, colorName: value, category }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateStock = async () => {
    try {
      const res = await fetch("https://hcml-ry8s.vercel.app/stock/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorName: formData.colorName,
          qty: Number(formData.qtyKg) * 1000,
        }),
      });

      const result = await res.text();
      return result;
    } catch (err) {
      console.error("Stock update failed:", err);
      return null;
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
        setMessage("Updating stock...");
        const stockResult = await updateStock();
        if (stockResult !== null) {
          setMessage("✅ Purchase & stock updated successfully!");
          setFormData({
            date: "",
            colorName: "",
            category: "",
            vendor: "",
            memo: "",
            qtyKg: "",
            pricePerKg: "",
          });
        } else {
          setMessage("⚠️ Purchase added but stock update failed.");
        }
      } else {
        setMessage(`❌ Failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Network error. Submission failed.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
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
            {Object.keys(colorMap).length === 0 ? (
              <p className="text-sm text-gray-500">Loading colors...</p>
            ) : (
              <datalist id="colorNameOptions">
                {Object.keys(colorMap).map((color, index) => (
                  <option key={index} value={color} />
                ))}
              </datalist>
            )}
          </div>
        </div>

        {/* Category & Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className={`text-center mt-4 font-semibold text-lg ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-500"
                : "text-red-600"
            } animate-pulse`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

// 🔁 Reusable Field Components
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

const FormLabel = ({ name, required = false }) => (
  <label className="block text-sm font-medium text-gray-600 mb-1">
    {name} {required && <span className="text-red-500">*</span>}
  </label>
);

export default ColorPurchaseForm;
