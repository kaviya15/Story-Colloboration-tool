const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  getUserProfile,
  logout,
  authentication,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

// POST request to create a new user
router.get("/auth", authentication);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset_password", resetPassword);
router.post("/logout", logout);
router.get("/:id", getUser);
router.get("/profile/:id", getUserProfile);

// GET request to fetch user details by ID
// router.get("/:id", getUser);

module.exports = router;
