const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby0mRlZIXzT8quaX3rnthIKAh4Pur1B6CzEPnugZsMhWtmEELcoVgfQQfgB567dHcVhVw/exec?action=addcolordemand",
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
