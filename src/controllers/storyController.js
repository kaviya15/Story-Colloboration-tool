const { StoryService } = require("../services/storyService");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("./errorHandlerController");
const storyService = new StoryService();
const createStoryController = async (req, res) => {
  try {
    // console.log(req.body);
    const data = await storyService.createStoryService(req.body);
    return sendSuccessResponse(res, data);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};

module.exports = { createStoryController };
