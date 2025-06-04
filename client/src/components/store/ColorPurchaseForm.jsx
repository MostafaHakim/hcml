import React, { useState, useEffect } from "react";

const ColorPurchaseForm = () => {
  const [colorMap, setColorMap] = useState({});
  const [stockColor, setStockColor] = useState([{ colorName: "", gram: "" }]);
  const [vendorMap, setVendorMap] = useState([]);
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

  useEffect(() => {
    const fetchColorMap = async () => {
      try {
        const res = await fetch("https://hcml-ry8s.vercel.app/color");
        const data = await res.json();
        setColorMap(data);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
      }
    };
    fetchColorMap();
  }, []);

  useEffect(() => {
    const getVendorData = async () => {
      try {
        const res = await fetch("https://hcml-ry8s.vercel.app/vendor");
        const data = await res.json();
        setVendorMap(data);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
      }
    };
    getVendorData();
  }, []);

  useEffect(() => {
    setStockColor([
      {
        // make sure it's an array of objects
        colorName: formData.colorName,
        gram: formData.qtyKg * 1000,
      },
    ]);
  }, [formData.colorName, formData.qtyKg]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "colorName") {
      const category = colorMap[value] || "";
      setFormData((prev) => ({
        ...prev,
        colorName: value,
        category: category,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const stockUpdate = async () => {
    setMessage("Submitting...");

    try {
      const response = await fetch("https://hcml-ry8s.vercel.app/addstock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors: stockColor }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setMessage("✅ স্টক থেকে কমে গেছে এবং অন হোল্ড এ গেছে!");
        setStockColor([{ colorName: "", gram: "" }]); // reset stock
      } else {
        setMessage("❌ সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
    } catch (error) {
      setMessage("❌ কানেকশনের সমস্যা হয়েছে।");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://hcml-ry8s.vercel.app/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("✅ Purchase submitted!");
        stockUpdate();
      } else {
        setMessage("❌ Failed to submit");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("❌ Submission failed. Try again.");
    }

    setTimeout(() => {
      setLoading(false);
      setMessage("");
    }, 4000);

    setFormData({
      date: "",
      colorName: "",
      category: "",
      vendor: "",
      memo: "",
      qtyKg: "",
      pricePerKg: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        🎨 Color Purchase Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        {/* Row 1: Date & Color Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Color Name <span className="text-red-500">*</span>
            </label>
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

        {/* Row 2: Category & Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-2 border rounded-xl bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Vendor
            </label>
            <select
              type="text"
              name="vendor"
              list="vendorNameOption"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            >
              {vendorMap.map((v, i) => {
                return (
                  <option key={i} value={v}>
                    {v}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Memo */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Memo
          </label>
          <input
            type="text"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl"
          />
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Quantity (KG)
            </label>
            <input
              type="number"
              name="qtyKg"
              value={formData.qtyKg}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price per KG
            </label>
            <input
              type="number"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p className="text-center text-green-600 mt-4 font-semibold">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ColorPurchaseForm;
