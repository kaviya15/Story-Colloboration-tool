const express = require("express");
const { registerUser, getUser } = require("../controllers/userController");

const router = express.Router();

// POST request to create a new user
router.post("/register", registerUser);
router.get('/:id', getUser);

// GET request to fetch user details by ID
// router.get("/:id", getUser);

module.exports = router;
