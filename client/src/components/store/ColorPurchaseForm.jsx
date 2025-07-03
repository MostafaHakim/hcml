import React, { useState, useEffect } from "react";

const ColorPurchaseForm = () => {
  const [colorMap, setColorMap] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    vendor: "",
    memo: "",
  });
  const [formDataList, setFormDataList] = useState([
    { colorName: "", category: "", qtyKg: "", pricePerKg: "" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/color`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = {};
        if (Array.isArray(data) && data.length > 1) {
          data.slice(1).forEach(([color, category]) => {
            mapped[color] = category;
          });
        }
        setColorMap(mapped);
      })
      .catch(() => setColorMap({}));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/vendor`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          setVendorList(data.slice(1).map((item) => item[0]));
        }
      });
  }, []);

  const handleMainChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRowChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...formDataList];
    updated[index][name] = value;

    if (name === "colorName") {
      updated[index].category = colorMap[value] || "";
    }

    setFormDataList(updated);
  };

  const addRow = () => {
    setFormDataList([
      ...formDataList,
      { colorName: "", category: "", qtyKg: "", pricePerKg: "" },
    ]);
  };

  const removeRow = () => {
    const updated = [...formDataList];
    updated.pop();
    setFormDataList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Submitting...");

    try {
      // Save purchase
      const res = await fetch(`${BASE_URL}/color`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, items: formDataList }),
      });

      const result = await res.json();

      if (result.success) {
        // Update stock
        const stockRes = await fetch(`${BASE_URL}/stock/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            formDataList.map((item) => ({
              colorName: item.colorName,
              qty: parseFloat(item.qtyKg) * 1000,
            }))
          ),
        });

        const stockResult = await stockRes.json();

        if (stockResult.status === "success") {
          setMessage("✅ Purchase & stock updated successfully!");
          setFormData({ date: "", vendor: "", memo: "" });
          setFormDataList([
            { colorName: "", category: "", qtyKg: "", pricePerKg: "" },
          ]);
        } else {
          setMessage("⚠️ Purchase saved but stock update failed.");
        }
      } else {
        setMessage("❌ Failed to save purchase.");
      }
    } catch (err) {
      setMessage("❌ Network error.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
        🎨 Color Purchase Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleMainChange}
            required
          />
          <div>
            <FormLabel name="Vendor" required />
            <select
              name="vendor"
              value={formData.vendor}
              onChange={handleMainChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Vendor</option>
              {vendorList.map((vendor, i) => (
                <option key={i} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="Memo"
            name="memo"
            value={formData.memo}
            onChange={handleMainChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Colors</h3>
          <div>
            <button
              type="button"
              onClick={addRow}
              className="text-blue-600 font-semibold mr-2"
            >
              + Add Row
            </button>
            {formDataList.length > 1 && (
              <button
                type="button"
                onClick={removeRow}
                className="text-red-600 font-semibold"
              >
                - Remove
              </button>
            )}
          </div>
        </div>

        {formDataList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border mb-2"
          >
            <FormField
              label="Color Name"
              name="colorName"
              value={item.colorName}
              onChange={(e) => handleRowChange(e, index)}
              list="colorNameOptions"
              required
            />
            <FormField
              label="Category"
              name="category"
              value={item.category}
              readOnly
              bgGray
            />
            <FormField
              label="Qty (KG)"
              name="qtyKg"
              type="number"
              value={item.qtyKg}
              onChange={(e) => handleRowChange(e, index)}
              required
            />
            <FormField
              label="Price/KG"
              name="pricePerKg"
              type="number"
              value={item.pricePerKg}
              onChange={(e) => handleRowChange(e, index)}
              required
            />
          </div>
        ))}

        <datalist id="colorNameOptions">
          {Object.keys(colorMap).map((color, index) => (
            <option key={index} value={color} />
          ))}
        </datalist>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p className="text-center font-semibold mt-4 animate-pulse">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  readOnly = false,
  list = "",
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
      list={list}
      className={`w-full px-3 py-2 border rounded-lg ${
        bgGray ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

const FormLabel = ({ name, required = false }) => (
  <label className="block text-sm text-gray-700 font-medium mb-1">
    {name} {required && <span className="text-red-500">*</span>}
  </label>
);

export default ColorPurchaseForm;
