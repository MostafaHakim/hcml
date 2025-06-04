// server/routes/colorStock.js

const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbzb0jNX8NpS27_BA7aWs2_whhQPgirwQ2sDvPq581Z9KpBLNR4tUAqfrwLc-herqSfT/exec";

// POST: Update stock when color is demanded

router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const response = await fetch(`${GAS_BASE_URL}?action=addcolorstock`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Error updating color stock:", error);
    res.status(500).json({ error: "Failed to update color stock" });
  }
});

module.exports = router;
