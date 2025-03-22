const router = require("express").Router();
const { createStoryController } = require("../controllers/storyController");

/** need to add middleware to check session */
router.post("/create", createStoryController);
module.exports = router;
