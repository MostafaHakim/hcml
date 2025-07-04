const express = require("express");
const router = express.Router();

const GAS_BASE_URL_STORE =
  "https://script.google.com/macros/s/AKfycbwhj1xQSi8qi1DmdzkJ1YwM0XrYFZIInHDnUUAvcFDHUtyGz30DcsqhtkcroUhZYo5k/exec";
const GAS_BASE_URL_GRIEGE = `https://script.google.com/macros/s/AKfycbzeJBBADTL8ePMhvS9GlTO8gX7Z1wcZEWuWHWhChgeCUqlHjmumharewpVr3s757OFXxA/exec`;

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=demanddata`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get lot list" });
  }
});
router.get("/verifydyes", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_STORE}?action=verifydyes`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get lot list" });
  }
});
router.get("/recipies", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_STORE}?action=getrecipies`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to get lot list" });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await fetch(
      `${GAS_BASE_URL_STORE}?action=addcolordemand`,
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
router.post("/status", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_STORE}?action=status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error forwarding to Google Apps Script");
  }
});

module.exports = router;
