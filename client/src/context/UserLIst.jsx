import React, { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/user")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">User List</h2>
      <ul className="list-disc pl-6">
        {users.map((row, index) => (
          <li key={index}>
            {row["USER NAME"]} {/* প্রতিটি row হলো [name, email, etc.] */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
