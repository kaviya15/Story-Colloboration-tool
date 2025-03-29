const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { connectDB } = require("./src/config/db");
const routes = require("./src/routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);
app.listen(process.env.PORT || 5000, async () => {
  await connectDB();
  console.log(" ✅ server started listening at port", process.env.PORT || 5000);
});
