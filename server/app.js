require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

const partyRoute = require("./router/party.route");
const dyesRoute = require("./router/dyes.route");
const colorsRoute = require("./router/color.route");
const vendorsRoute = require("./router/vendor.route");
const demandRoute = require("./router/demand.route");
const colorPriceRoute = require("./router/colorPrice.route");
const griegeIn = require("./router/griegein.route");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/party", partyRoute);
app.use("/proxy", dyesRoute);
app.use("/color", colorsRoute);
app.use("/vendor", vendorsRoute);
app.use("/demand", demandRoute);
app.use("/colorprice", colorPriceRoute);
app.use("/griegein", griegeIn);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error("❌ Initial DB Connection Error:", err));

mongoose.connection.once("open", () => {
  console.log("✅ DB Connected Successfully");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ DB Connection Error:", err);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at PORT ${PORT}`);
});
