require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

const partyRoute = require("./router/party.route");
const dyesRoute = require("./router/dyes.route");
const colorsRoute = require("./router/color.route");
const vendorsRoute = require("./router/vendor.route");
const demandRoute = require("./router/demand.route");
const colorPriceRoute = require("./router/colorPrice.route");
const griegeIn = require("./router/griegein.route");
const stockRoute = require("./router/stock.route");
const addStock = require("./router/add.stock.route");

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/party", partyRoute);
app.use("/proxy", dyesRoute);
app.use("/color", colorsRoute);
app.use("/vendor", vendorsRoute);
app.use("/demand", demandRoute);
app.use("/colorprice", colorPriceRoute);
app.use("/griegein", griegeIn);
app.use("/stock", stockRoute);
app.use("/addstock");

// =====================Unknown URL =========================
app.use((req, res, next) => {
  res.status(404).json({ massage: "Page Not Found" });
});
// =====================Unknown Server Error =========================
app.use((err, req, res, next) => {
  res.status(500).json(err.massage);
});

app.listen(PORT, () => {
  console.log(`server is start at the port of ${PORT}`);
});

module.exports = app;
