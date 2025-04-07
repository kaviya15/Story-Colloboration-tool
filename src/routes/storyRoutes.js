const router = require("express").Router();
const {
  createStoryController,
  getStoryController,
  likeStoryController,
  getAllStoriesController,
  subscribeNotificationsController,
  publishStoryController,
} = require("../controllers/storyController");

const { uploadFileMiddleware } = require("../middleware/upload");
/** need to add middleware to check session */
router.post("/create", uploadFileMiddleware, createStoryController);
router.post("/like/:storyId", likeStoryController);
router.post("/notify/:storyId", subscribeNotificationsController);
router.get("/:storyId", getStoryController);
router.put("/publish/:storyId", publishStoryController);

router.get("/", getAllStoriesController);
// router.post("/lock/:storyId")
module.exports = router;
