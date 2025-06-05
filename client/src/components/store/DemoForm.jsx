import { useEffect, useState } from "react";

function DemoForm() {
  const [color, setColor] = useState([]);
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/stock")
      .then((res) => res.json())
      .then((data) => setColor(data));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://hcml-ry8s.vercel.app/demand`, {
        method: "POST",
        body: JSON.stringify({ product, qty }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.text(); // Apps Script সাধারণত text output দেয়
      alert(result);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Update failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-100 rounded-md w-96 text-black"
    >
      <h2 className="text-lg font-bold mb-2">Update Product Quantity</h2>
      <select
        type="text"
        placeholder="Product Name"
        onChange={(e) => setProduct(e.target.value)}
        className="block w-full p-2 mb-2 border border-gray-300 rounded text-black"
        required
      >
        <option>--Select Color--</option>
        {color.map((color) => {
          return (
            <option className="text-black">{color["PRODUCT NAME"]}</option>
          );
        })}
      </select>
      <input
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        className="block w-full p-2 mb-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update
      </button>
    </form>
  );
}

export default DemoForm;
