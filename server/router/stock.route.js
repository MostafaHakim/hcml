// server/routes/colorStock.js

const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbzb0jNX8NpS27_BA7aWs2_whhQPgirwQ2sDvPq581Z9KpBLNR4tUAqfrwLc-herqSfT/exec";

// GET: Fetch color list
router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL}?action=colorstock`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get color list" });
  }
});

module.exports = router;
