import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MasterProfile() {
  const [data, setData] = useState([]);
  const { id } = useParams(); // Mobile number from URL (string)

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/user/master")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error("Failed to fetch user data", err);
      });
  }, []);

  if (data.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  const headers = data[0];
  const rows = data.slice(1);

  const master = rows.find((row) => row[2].toString() === id);

  if (!master) {
    return <div className="p-4 text-red-600">Master not found</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Master Profile</h2>
      <ul className="space-y-2">
        {headers.map((title, i) => (
          <li key={i} className="flex justify-between border-b pb-1">
            <span className="font-semibold">{title}</span>
            <span>{master[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MasterProfile;
