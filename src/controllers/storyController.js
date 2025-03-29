const { StoryService } = require("../services/storyService");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("./errorHandlerController");
const storyService = new StoryService();
const createStoryController = async (req, res) => {
  try {
    const data = await storyService.createStoryService(req.fileId, req.body);
    console.log(req.body, "req.body");
    return sendSuccessResponse(res, data);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};
const getStoryController = async (req, res) => {
  try {
    const stories = await storyService.getStoryService();
    return sendSuccessResponse(res, stories);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};

module.exports = { createStoryController, getStoryController };
