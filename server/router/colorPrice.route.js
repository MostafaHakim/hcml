const express = require("express");
const router = express.Router();

const GAS_BASE_URL =
  "https://script.google.com/macros/s/AKfycbwhj1xQSi8qi1DmdzkJ1YwM0XrYFZIInHDnUUAvcFDHUtyGz30DcsqhtkcroUhZYo5k/exec";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL}?action=getcolorprice`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get color list" });
  }
});
router.get("/purchase", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL}?action=getpurchase`);
    console.log("GAS Response Status:", response.status);
    console.log("GAS Response OK:", response.ok);
    const data = await response.json();
    console.log("GAS Response Data:", data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get color list" });
  }
});

module.exports = router;
