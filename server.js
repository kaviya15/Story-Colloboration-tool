const express = require("express");
require("dotenv").config();
const connectDB = require("./src/config/db");

connectDB();

const app = express();
app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
  console.log(" ✅ server started listening at port", process.env.PORT || 5000);
});
