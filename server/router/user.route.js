// const express = require("express");
// const router = express.Router();

// const GAS_BASE_URL =
//   "https://script.google.com/macros/s/AKfycbzSoRDX7B1GtfO8Syi8jIEneR6jiAlJOnBvmDWCNYeAxfewy6inAxlJkg23M1fZGk3nNQ/exec";

// // Custom fetch with timeout
// async function fetchWithTimeout(url, timeout = 20000) {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   try {
//     const res = await fetch(url, { signal: controller.signal });
//     clearTimeout(timeoutId);
//     return await res.json();
//   } catch (err) {
//     clearTimeout(timeoutId);
//     throw err;
//   }
// }

// // ✅ POST /login route
// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const result = await fetchWithTimeout(`${GAS_BASE_URL}?action=getuser`);
//     const users = result.data || [];

//     const user = users.find(
//       (u) =>
//         u["USER NAME"]?.toLowerCase().trim() ===
//           username.toLowerCase().trim() &&
//         String(u["PASSWORD"]) === String(password)
//     );

//     if (user) {
//       res.json({
//         success: true,
//         username: user["USER NAME"],
//         fullName: user["FULL NAME"],
//         role: user["ROLE"],
//       });
//     } else {
//       res.status(401).json({
//         success: false,
//         message: "Invalid username or password",
//       });
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// });

// // (optional) old routes if still needed
// router.get("/", async (req, res) => {
//   try {
//     const result = await fetchWithTimeout(`${GAS_BASE_URL}?action=getuser`);
//     res.json(result.data || []);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Failed to get user list" });
//   }
// });

// router.get("/master", async (req, res) => {
//   try {
//     const result = await fetchWithTimeout(`${GAS_BASE_URL}?action=master`);
//     res.json(result.data || []);
//   } catch (error) {
//     console.error("Error fetching master:", error);
//     res.status(500).json({ error: "Failed to get master list" });
//   }
// });
// router.get("/masterOne", async (req, res) => {
//   try {
//     const result = await fetchWithTimeout(`${GAS_BASE_URL}?action=master`);
//     res.json(result.data || []);
//   } catch (error) {
//     console.error("Error fetching master:", error);
//     res.status(500).json({ error: "Failed to get master list" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbwEqPqxeLFv8c3-gZwqVFrqhgtnzKaBSrmjuhMqqe-rWZNuFoJGokN7tKbdWEL0v0VeHw/exec";

// 🔧 Custom fetch with timeout
async function fetchWithTimeout(url, timeout = 20000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ✅ Utility: handle fetch from GAS
async function fetchFromGAS(action) {
  const url = `${GAS_BASE_URL}?action=${action}`;
  const result = await fetchWithTimeout(url);
  return result.data || [];
}

// ✅ POST /login → validate user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await fetchFromGAS("getuser");

    const user = users.find(
      (u) =>
        u["USER NAME"]?.toLowerCase().trim() ===
          username.toLowerCase().trim() &&
        String(u["PASSWORD"]) === String(password)
    );

    if (user) {
      res.json({
        success: true,
        username: user["USER NAME"],
        fullName: user["FULL NAME"],
        role: user["ROLE"],
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// ✅ GET /users → full user list
router.get("/", async (req, res) => {
  try {
    const users = await fetchFromGAS("getuser");
    res.json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ error: "Failed to get user list" });
  }
});

// ✅ GET /master → all masters
router.get("/master", async (req, res) => {
  try {
    const masters = await fetchFromGAS("master");
    res.json(masters);
  } catch (error) {
    console.error("Error fetching master list:", error);
    res.status(500).json({ error: "Failed to get master list" });
  }
});

// 🔥 OPTIONAL: if masterOne needed for future filtering
router.get("/masterOne", async (req, res) => {
  try {
    const masters = await fetchFromGAS("master");
    res.json(masters);
  } catch (error) {
    console.error("Error fetching masterOne:", error);
    res.status(500).json({ error: "Failed to get master list" });
  }
});

module.exports = router;
