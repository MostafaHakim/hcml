const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=lotinfo"
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get lot list" });
  }
});

router.get("/than", async (req, res) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getthan"
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get lot list" });
  }
});
router.get("/delivarythan", async (req, res) => {
  try {
    const { lot } = req.query;
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=delivarythan&lot=${lot}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching delivery than:", error);
    res.status(500).json({ error: "Failed to get delivery than list" });
  }
});
router.get("/getLotsByParty", async (req, res) => {
  try {
    const { party } = req.query;
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getLotsByParty&party=${encodeURIComponent(
        party
      )}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching delivery than:", error);
    res.status(500).json({ error: "Failed to get delivery than list" });
  }
});
router.get("/getThansByLot", async (req, res) => {
  try {
    const { lot } = req.query; // শুধু 'lot' প্যারামিটার আসবে, 'lot.lotNo' নয়

    if (!lot) {
      return res.status(400).json({ error: "Lot number is required" });
    }

    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getThansByLot&lot=${lot}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Google Script");
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching delivery than:", error);
    res.status(500).json({
      error: "Failed to get delivery than list",
      details: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=addnewlot`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error forwarding to Google Apps Script");
  }
});
router.post("/thanpost", async (req, res) => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=thanpost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error forwarding to Google Apps Script");
  }
});

module.exports = router;
