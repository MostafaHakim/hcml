const express = require("express");
const router = express.Router();

const GAS_BASE_URL_GRIEGE = `https://script.google.com/macros/s/AKfycbzeJBBADTL8ePMhvS9GlTO8gX7Z1wcZEWuWHWhChgeCUqlHjmumharewpVr3s757OFXxA/exec`;

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=lotinfo`);
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
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=getthan`);
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
      `${GAS_BASE_URL_GRIEGE}?action=delivarythan&lot=${lot}`
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
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=getParties`);
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
      `${GAS_BASE_URL_GRIEGE}?action=getLots&party=${encodeURIComponent(party)}`
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
      `${GAS_BASE_URL_GRIEGE}?action=getLotInfo&lot=${encodeURIComponent(lot)}`
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
      `${GAS_BASE_URL_GRIEGE}?action=getColorsByLot&lot=${encodeURIComponent(
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
      `${GAS_BASE_URL_GRIEGE}?action=getDetails&lot=${lot}&color=${encodeURIComponent(
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
      `${GAS_BASE_URL_GRIEGE}?action=getNextChallanNumber`
    );
    const data = await response.json();
    res.json(data); // { lastChallan: "DC-250618004" }
  } catch (error) {
    console.error("Error fetching challan number:", error);
    res.status(500).json({ error: "Failed to fetch challan number" });
  }
});
// ==========================Delivary Info==========================================================================
router.get("/delivaryinfo", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=delivaryInfo`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching challan number:", error);
    res.status(500).json({ error: "Failed to fetch challan number" });
  }
});
// =============================================================Address=========================
router.get("/getaddress", async (req, res) => {
  const party = req.query.party;
  console.log("Party received:", party); // এটা লগ করুন

  if (!party) return res.status(400).json({ error: "Party name is required" });

  try {
    const url = `${GAS_BASE_URL_GRIEGE}?action=getAddressByParty&party=${encodeURIComponent(
      party
    )}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Google Script error");

    const data = await response.json();
    console.log("Address response from GAS:", data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Failed to get address" });
  }
});

// ================================POST ROUTE+++++++++++++++++++++++++++++++++++++++++++++++
// ================================POST ROUTE+++++++++++++++++++++++++++++++++++++++++++++++
// ================================POST ROUTE+++++++++++++++++++++++++++++++++++++++++++++++

router.post("/", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=addnewlot`, {
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
router.post("/thanpost", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=thanpost`, {
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
router.post("/griegeupdate", async (req, res) => {
  try {
    const response = await fetch(
      `${GAS_BASE_URL_GRIEGE}?action=markDelivered`,
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
router.post("/delivarydata", async (req, res) => {
  try {
    const response = await fetch(`${GAS_BASE_URL_GRIEGE}?action=delivaryData`, {
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
