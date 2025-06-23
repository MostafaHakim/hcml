const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbynqHtTEoBVXJMH0TGr62VCUGtW1aTRm1Z3UslIRBqZJ_I_yrcTGeUqXh0Fg4cyIi0Q/exec";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL}?action=getcolors`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get color list" });
  }
});

module.exports = router;
