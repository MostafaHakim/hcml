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
// =============================================================================
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
// ==========================================================================
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
// ===================================================================================================================
router.get("/party", async (req, res) => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getParties`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching delivery than:", error);
    res.status(500).json({ error: "Failed to get delivery than list" });
  }
});
router.get("/getlots", async (req, res) => {
  try {
    const { party } = req.query;
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getLots&party=${encodeURIComponent(
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
router.get("/getlotinfo", async (req, res) => {
  try {
    const { lot } = req.query;
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getLotInfo&lot=${encodeURIComponent(
        lot
      )}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching delivery than:", error);
    res.status(500).json({ error: "Failed to get delivery than list" });
  }
});
router.get("/colorres", async (req, res) => {
  try {
    const { lot } = req.query;
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getColorsByLot&lot=${encodeURIComponent(
        lot
      )}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching delivery than:", error);
    res.status(500).json({ error: "Failed to get delivery than list" });
  }
});
// =========================================Detailsres=============================================
router.get("/detailsres", async (req, res) => {
  try {
    const { lot, color } = req.query;
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getDetails&lot=${lot}&color=${encodeURIComponent(
        color
      )}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching delivery than:", error);
    res.status(500).json({ error: "Failed to get delivery than list" });
  }
});
// =============================================================Chalan Genarate=========================
router.get("/lastchallan", async (req, res) => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=getNextChallanNumber`
    );
    const data = await response.json();
    res.json(data); // { lastChallan: "DC-250618004" }
  } catch (error) {
    console.error("Error fetching challan number:", error);
    res.status(500).json({ error: "Failed to fetch challan number" });
  }
});

// ================================POST ROUTE+++++++++++++++++++++++++++++++++++++++++++++++
// ================================POST ROUTE+++++++++++++++++++++++++++++++++++++++++++++++
// ================================POST ROUTE+++++++++++++++++++++++++++++++++++++++++++++++

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
router.post("/griegeupdate", async (req, res) => {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzYUQ8_qSdld8h4axOfMgaJ_W3fWfEKpWp5Lv_acdC20DMEL9GJ5umKNTjCm0ZUrM3-Bw/exec?action=markDelivered`,
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
