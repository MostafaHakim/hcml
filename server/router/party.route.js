const express = require("express");
const router = express.Router();
const {
  createNewParty,
  getParties,
} = require("../controller/party.controller");

// Get All Parties
router.get("/", getParties);

// Create a New Party
router.post("/", createNewParty);

module.exports = router;
