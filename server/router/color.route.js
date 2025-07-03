const express = require("express");
const router = express.Router();

const GAS_BASE_URL_DATA =
  "https://script.google.com/macros/s/AKfycbwOneVfSutEEDnbcePm5r7gm_hT2oH3ngBG0tk26CVpJjZk-1Lgk0RVUY88GfBgwFcJfw/exec";
const GAS_BASE_URL_STORE =
  "https://script.google.com/macros/s/AKfycbwhj1xQSi8qi1DmdzkJ1YwM0XrYFZIInHDnUUAvcFDHUtyGz30DcsqhtkcroUhZYo5k/exec";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_DATA}?action=getcolors`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get color list" });
  }
});

router.post("/", async (req, res) => {
  const { date, vendor, memo, items } = req.body;

  const sendData = items.map((item) => ({
    date,
    vendor,
    memo,
    colorName: item.colorName,
    category: item.category,
    qtyKg: item.qtyKg,
    pricePerKg: item.pricePerKg,
  }));

  try {
    const response = await fetch(
      `${GAS_BASE_URL_STORE}?action=addPurchaseEntry`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      }
    );

    const result = await response.text();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error sending to GAS" });
  }
});

module.exports = router;
