const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");

// import all routes here
router.use("/users", userRoutes);
// router.use("/users", storyRoutes);

module.exports = router;