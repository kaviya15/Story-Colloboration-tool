const router = require("express").Router();
const {
  createStoryController,
  getStoryController,
  likeStoryController,
  getAllStoriesController,
} = require("../controllers/storyController");

const { uploadFileMiddleware } = require("../middleware/upload");
/** need to add middleware to check session */
router.post("/create", uploadFileMiddleware, createStoryController);
router.post("/like/:storyId", likeStoryController);
// router.get("/", getAllStoriesController);
// router.get("/:storyId", getStoryController);
// router.post("/:storyId/notify");
module.exports = router;
