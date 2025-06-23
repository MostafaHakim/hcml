const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const googleAppsScriptURL =
    "https://script.google.com/macros/s/AKfycby0mRlZIXzT8quaX3rnthIKAh4Pur1B6CzEPnugZsMhWtmEELcoVgfQQfgB567dHcVhVw/exec?action=addPurchaseEntry";

  try {
    const response = await fetch(googleAppsScriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      return res
        .status(500)
        .send("❌ Invalid JSON response from Google Apps Script");
    }

    res.json(parsed);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("❌ Error forwarding to Google Apps Script");
  }
});

module.exports = router;
