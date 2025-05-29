const Party = require("../model/party.model");

// Get All Parties
const getParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.status(200).json({
      status: "success",
      data: parties,
    });
  } catch (error) {
    console.error("Error in getParties:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

// Create a New Party
const createNewParty = async (req, res) => {
  try {
    const newParty = new Party(req.body);
    const savedParty = await newParty.save();
    res.status(201).json({
      status: "success",
      data: savedParty,
      message: "Party created successfully",
    });
  } catch (error) {
    console.error("Error in createNewParty:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

module.exports = { getParties, createNewParty };
