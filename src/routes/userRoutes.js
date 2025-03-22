const express = require("express");
const { createUser, getUser } = require("../controllers/userController");

const router = express.Router();

// POST request to create a new user
router.post("/", createUser);

// GET request to fetch user details by ID
// router.get("/:id", getUser);

module.exports = router;
