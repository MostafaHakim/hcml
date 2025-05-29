const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycby0mRlZIXzT8quaX3rnthIKAh4Pur1B6CzEPnugZsMhWtmEELcoVgfQQfgB567dHcVhVw/exec";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL}?action=getVendors`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get vendor list" });
  }
});

module.exports = router;
