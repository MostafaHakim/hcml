const express = require("express");
const router = express.Router();

const GAS_BASE_URL_DATA =
  "https://script.google.com/macros/s/AKfycbwOneVfSutEEDnbcePm5r7gm_hT2oH3ngBG0tk26CVpJjZk-1Lgk0RVUY88GfBgwFcJfw/exec";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_DATA}?action=getvendors`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get vendor list" });
  }
});

module.exports = router;
