import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // যদি আগেই লগইন থাকে তাহলে সরাসরি রিডাইরেক্ট
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      const role = localStorage.getItem("role");
      if (role === "Admin") navigate("/admin");
      else if (role === "Storeman") navigate("/store");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Logging in...");

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", result.username);
        localStorage.setItem("fullName", result.fullName);
        localStorage.setItem("role", result.role);

        if (result.role === "Admin") {
          navigate("/admin");
        } else if (result.role === "Storeman") {
          navigate("/store");
        } else {
          setMessage("Unauthorized role");
        }
      } else {
        setMessage(result.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login failed", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start mt-40">
      <form
        className="w-3/4 md:w-2/3 lg:w-1/3 bg-gradient-to-tl from-white to-sky-200 rounded-lg shadow-md"
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
