const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec",
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
