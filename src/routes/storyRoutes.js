const router = require("express").Router();
const {
  createStoryController,
  getStoryController,
} = require("../controllers/storyController");

const { uploadFileMiddleware } = require("../middleware/upload");
/** need to add middleware to check session */
router.post("/create", uploadFileMiddleware, createStoryController);
router.get("/", getStoryController);
module.exports = router;
