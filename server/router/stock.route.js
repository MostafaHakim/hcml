const express = require("express");
const router = express.Router();

const GAS_BASE_URL = process.env.STOCK_SHEET;

router.get("/", async (req, res) => {
  try {
    const response = await fetch(
      `https://hcml-ry8s.vercel.app?action=colorStock`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get color list" });
  }
});

module.exports = router;
