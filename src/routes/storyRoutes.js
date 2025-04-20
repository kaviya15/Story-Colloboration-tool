const router = require("express").Router();
const {
  createStoryController,
  getStoryController,
  likeStoryController,
  getAllStoriesController,
  subscribeNotificationsController,
  publishStoryController,
  uploadImageController,
  editStoryController,
  discardStoryController,
  getUserStoriesController,
  getPaginatedStoriesController,
  deleteStoryController,
  versionStoryController,
  versionSpecificStoryController,
} = require("../controllers/storyController");

const { uploadFileMiddleware } = require("../middleware/upload");
/** need to add middleware to check session */
router.post("/create", uploadFileMiddleware, createStoryController);
router.get("/getversions/:storyId", versionStoryController);
router.post("/getversions/:storyId", versionSpecificStoryController);

router.post("/like/:storyId", likeStoryController);
router.post("/notify/:storyId", subscribeNotificationsController);
router.post("/lock/:storyId", editStoryController);
router.put("/publish/:storyId", uploadFileMiddleware, publishStoryController);
router.put("/discard/:storyId", discardStoryController);
router.get("/created/:id", getUserStoriesController);
router.get("/userstories/stories", getPaginatedStoriesController);
router.delete("/:storyId", deleteStoryController);

router.get("/:storyId", getStoryController);
router.get("/", getAllStoriesController);
// router.post("/lock/:storyId")
module.exports = router;
