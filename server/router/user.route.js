const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbzSoRDX7B1GtfO8Syi8jIEneR6jiAlJOnBvmDWCNYeAxfewy6inAxlJkg23M1fZGk3nNQ/exec";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL}?action=getuser`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to get user list" });
  }
});
router.get("/master", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL}?action=master`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching master:", error);
    res.status(500).json({ error: "Failed to get master list" });
  }
});

module.exports = router;
