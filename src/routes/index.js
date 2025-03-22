const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const storyRoutes = require("./storyRoutes");

// import all routes here
console.log("router");
router.use("/users", userRoutes);
router.use("/story", storyRoutes);

module.exports = router;
