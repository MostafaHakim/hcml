import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/user")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setMessage("Server error. Please try again later.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim username for safer comparison
    const user = data.find(
      (item) =>
        item["USER NAME"].toLowerCase() === username.trim().toLowerCase() &&
        String(item["PASSWORD"]) === password
    );

    if (user) {
      console.log("Login successful:", user);
      if (user["ROLE"] === "Admin") {
        navigate("/home");
      }

      if (user["ROLE"] === "Storeman") {
        navigate("/store");
      }

      // Optional: Save user info to localStorage or context
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start mt-40">
      <form
        className="w-1/3 bg-gradient-to-tl from-white to-sky-200 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-sans font-semibold uppercase text-white py-2 rounded-t-lg bg-sky-600 text-center">
          Login
        </h2>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded"
              required
            />
          </div>
          {message && <p className="text-red-500 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
