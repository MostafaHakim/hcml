import { useEffect } from "react";
import { useState } from "react";

export default function LotEntryForm() {
  const [lotData, setLotData] = useState([]);
  const [form, setForm] = useState({
    lotNo: "",
    date: "",
    party: "",
    fabric: "",
    quality: "",
    than: "",
    totalGaj: "",
    unit: "",
    action: [],
  });

  const processOptions = [
    "Dyeing",
    "Printing",
    "Finishing",
    "Washing",
    "Packing",
  ];

  useEffect(() => {
    const getLotData = async () => {
      try {
        const res = await fetch("https://hcml-ry8s.vercel.app/griegein");
        const data = await res.json();
        setLotData(data);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
      }
    };
    getLotData();
  }, []);
  console.log(lotData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      action: form.action.join(", "),
    };

    try {
      const response = await fetch("https://hcml-ry8s.vercel.app/griegein", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.result === "success") {
        alert("Data saved successfully!");
        setForm({
          lotNo: "",
          date: "",
          party: "",
          fabric: "",
          quality: "",
          than: "",
          totalGaj: "",
          unit: "",
          action: [],
        });
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
        required
        className="border p-2 w-full"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <input
        name="party"
        value={form.party}
        onChange={handleChange}
        placeholder="Party Name"
        required
        className="border p-2 w-full"
      />
      <input
        name="fabric"
        value={form.fabric}
        onChange={handleChange}
        placeholder="Fabric Type"
        required
        className="border p-2 w-full"
      />
      <input
        name="quality"
        value={form.quality}
        onChange={handleChange}
        placeholder="Fabric Quality"
        required
        className="border p-2 w-full"
      />
      <input
        name="than"
        value={form.than}
        onChange={handleChange}
        placeholder="No. of Thans"
        required
        className="border p-2 w-full"
      />
      <input
        name="totalGaj"
        value={form.totalGaj}
        onChange={handleChange}
        placeholder="Total Gaj"
        required
        className="border p-2 w-full"
      />
      <input
        name="unit"
        value={form.unit}
        onChange={handleChange}
        placeholder="Unit (e.g., Yards)"
        required
        className="border p-2 w-full"
      />

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
