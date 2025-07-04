// server/routes/colorStock.js

const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbwXgpEmBQ6OqYSCRVySHSYqMVy7zlegy7_bddbt6aR06_tqgDoQtcIkoHbGJankYang5Q/exec";

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

// POST: Update stock when color is demanded
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const response = await fetch(`${GAS_BASE_URL}?action=updatecolorstock`, {
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
router.post("/add", async (req, res) => {
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

router.post("/hold", async (req, res) => {
  try {
    const { batchData } = req.body;
    if (
      !Array.isArray(batchData) ||
      !batchData.every(
        (item) =>
          typeof item.color === "string" && typeof item.gram === "number"
      )
    ) {
      return res.status(400).json({ error: "Invalid batchData format" });
    }

    const response = await fetch(`${GAS_BASE_URL}?action=holdcolor`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    if (!result.success) {
      return res
        .status(400)
        .json({ error: result.message || "Failed to update color stock" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating color stock:", error);
    res.status(500).json({ error: "Failed to update color stock" });
  }
});

module.exports = router;
