import React, { useState, useEffect } from "react";
import axios from "axios";

const DemoForm = () => {
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/colorstock") // Update port as needed
      .then((res) => setColors(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/colorstock/update", {
        color: selectedColor,
        quantity: quantity,
      });

      if (res.data.success) {
        alert("Stock updated successfully!");
      } else {
        alert(res.data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update stock");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Color Demand Form</h2>

      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="border p-2"
      >
        <option value="">Select Color</option>
        {colors.map((c, idx) => (
          <option key={idx} value={c["Color Name"]}>
            {c["Color Name"]}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2 ml-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
      >
        Submit
      </button>
    </div>
  );
};

export default DemoForm;
