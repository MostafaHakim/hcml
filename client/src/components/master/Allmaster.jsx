import React, { useEffect, useState } from "react";

function Allmaster() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/user/master")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setMessage("Server error. Please try again later.");
      });
  }, []);

  return (
    <div>
      <div>
        <h2>Master Name</h2>
        <h3>Address</h3>
        <h3>Mobile</h3>
      </div>
    </div>
  );
}

export default Allmaster;
