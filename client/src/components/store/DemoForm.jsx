import React, { useState, useEffect } from "react";
import axios from "axios";

const DemoForm = () => {
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/stock")
      .then((res) => res.json())
      .then((data) => {
        setColors(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load color stock.");
      });
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://hcml-ry8s.vercel.app/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          color: selectedColor,
          quantity: quantity,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Stock updated successfully!");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update stock");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Color Demand Form</h2>

      {/* Display error message if there's any */}
      {error && <p className="text-red-500">{error}</p>}

      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="border p-2 text-black"
      >
        <option value="">Select Color</option>
        {colors && colors.length > 0 ? (
          colors.map((c, idx) => (
            <option
              key={idx}
              value={c["PRODUCT NAME"]}
              className="text-black bg-green-300"
            >
              {c["PRODUCT NAME"]}
            </option>
          ))
        ) : (
          <option value="">Loading colors...</option>
        )}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2 ml-2 text-black"
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
