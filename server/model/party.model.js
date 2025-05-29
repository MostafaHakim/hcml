const mongoose = require("mongoose");

const thanSchema = new mongoose.Schema({
  griege: {
    type: Number,
    required: true,
    min: 0,
  },
  finishing: {
    type: Number,
    required: true,
    min: 0,
  },
});

const febricSchema = new mongoose.Schema({
  febricType: {
    type: String,
    required: true,
    trim: true,
  },
  febricQuality: {
    type: String,
    required: true,
    trim: true,
  },
  thans: {
    type: [thanSchema],
    default: [],
  },
});

const lotSchema = new mongoose.Schema({
  lotNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  receiveDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalThen: {
    type: Number,
    required: true,
    min: 0,
  },
  febrics: {
    type: [febricSchema],
    default: [],
  },
});

const partySchema = new mongoose.Schema(
  {
    partyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    lots: {
      type: [lotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const partyModel = mongoose.model("Party", partySchema);
module.exports = partyModel;
