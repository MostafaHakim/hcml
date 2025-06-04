import React, { useState, useEffect } from "react";

function DemoForm() {
  // const [products, setProducts] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState("");
  // const [newQty, setNewQty] = useState("");
  // const [message, setMessage] = useState("");

  // // গুগল শিট থেকে প্রোডাক্ট লোড করা
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("https://hcml-ry8s.vercel.app/stock");
  //       const data = await response.json();
  //       setProducts(data); // হেডার বাদ দিতে
  //     } catch (error) {
  //       console.error("ডেটা লোড করতে সমস্যা:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const payload = {
  //     product: selectedProduct,
  //     newQty: newQty,
  //   };

  //   try {
  //     const response = await fetch("https://hcml-ry8s.vercel.app/addstock", {
  //       method: "POST",
  //       body: JSON.stringify(payload),
  //     });

  //     const result = await response.text();
  //     setMessage(result);

  //     // রিসেট ফর্ম
  //     setNewQty("");
  //   } catch (error) {
  //     setMessage("এরর: " + error.message);
  //   }
  // };

  return (
    <div className="container text-black">
      {/* <h1>প্রোডাক্ট কোয়ান্টিটি আপডেট</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>প্রোডাক্ট নির্বাচন করুন:</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">-- প্রোডাক্ট নির্বাচন করুন --</option>
            {products.map((product, index) => (
              <option key={index} value={product[0]}>
                {product[0]} (বর্তমান: {product[1]})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>নতুন কোয়ান্টিটি:</label>
          <input
            type="number"
            value={newQty}
            onChange={(e) => setNewQty(e.target.value)}
            required
            min="0"
          />
        </div>

        <button type="submit">আপডেট করুন</button>
      </form>

      {message && <div className="message">{message}</div>} */}
    </div>
  );
}

export default DemoForm;
