const { StoryService } = require("../services/storyService");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("./errorHandlerController");
const storyService = new StoryService();
module.exports.createStoryController = async (req, res) => {
  try {
    const data = await storyService.createStoryService(req.fileId, req.body);
    console.log(req.body, "req.body");
    return sendSuccessResponse(res, data);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};
module.exports.getAllStoriesController = async (req, res) => {
  try {
    const stories = await storyService.getAllStoryService();
    return sendSuccessResponse(res, stories);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};
module.exports.getStoryService = async (req, res) => {
  try {
    const story = await storyService.getStoryService(req.params.storyId);
    return sendSuccessResponse(res, story);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};

module.exports.likeStoryController = async (req, res) => {
  try {
    console.log("like story controller");
    const likes = await storyService.likeStoryService(
      req.params.storyId,
      req.body
    );
    return sendSuccessResponse(res, likes);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};

module.exports.notifyUsers = async (req, res) => {};
