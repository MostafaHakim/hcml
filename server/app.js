require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

// const partyRoute = require("./router/party.route");
// const dyesRoute = require("./router/dyes.route");
// const colorsRoute = require("./router/color.route");
// const vendorsRoute = require("./router/vendor.route");
// const demandRoute = require("./router/demand.route");
// const colorPriceRoute = require("./router/colorPrice.route");
// const griegeIn = require("./router/griegein.route");

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

app.get("/", (req, res) => {
  res.send("Welcome");
});

// app.use("/party", partyRoute);
// app.use("/proxy", dyesRoute);
// app.use("/color", colorsRoute);
// app.use("/vendor", vendorsRoute);
// app.use("/demand", demandRoute);
// app.use("/colorprice", colorPriceRoute);
// app.use("/griegein", griegeIn);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at PORT ${PORT}`);
});
