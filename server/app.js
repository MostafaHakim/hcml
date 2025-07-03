require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// ✅ Router imports
const partyRoute = require("./router/party.route");
const dyesRoute = require("./router/dyes.route");
const colorsRoute = require("./router/color.route");
const vendorsRoute = require("./router/vendor.route");
const demandRoute = require("./router/demand.route");
const colorPriceRoute = require("./router/colorPrice.route");
const griegeIn = require("./router/griegein.route");
const stockRoute = require("./router/stock.route");
const userRoute = require("./router/user.route");

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ API Routes
app.use("/party", partyRoute);
app.use("/dyes", dyesRoute); // changed from /proxy to /dyes
app.use("/color", colorsRoute);
app.use("/vendor", vendorsRoute);
app.use("/demand", demandRoute);
app.use("/colorprice", colorPriceRoute);
app.use("/griegein", griegeIn);
app.use("/stock", stockRoute);
app.use("/user", userRoute);

// ✅ 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: "Page Not Found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server is running on port 3000");
});

module.exports = app;
