const { StoryService } = require("../services/storyService");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("./errorHandlerController");
const { getImageAsBase64 } = require("../utils/imageConverter");
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
module.exports.getStoryController = async (req, res) => {
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

module.exports.subscribeNotificationsController = async (req, res) => {
  try {
    console.log("notify story controller");
    const notifyuser = await storyService.subscribeNotificationsService(
      req.params.storyId,
      req.body
    );
    return sendSuccessResponse(res, notifyuser);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};
module.exports.editStoryController = async (req, res) => {
  try {
    console.log("edit story controller");
    const edit = await storyService.lockStoryService(
      req.params.storyId,
      req.body
    );
    return sendSuccessResponse(res, edit);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};
module.exports.publishStoryController = async (req, res) => {
  try {
    console.log("publish story controller");
    const notifyuser = await storyService.unLockStoryService(
      req.params.storyId,
      req.body
    );

    const saveStory = await storyService.saveEditedVersion(
      req.params.storyId,
      req.fileId,
      req.body
    );
    return sendSuccessResponse(res, notifyuser);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};
module.exports.discardStoryController = async (req, res) => {
  try {
    console.log("discard story controller");
    const notifyuser = await storyService.unLockStoryService(
      req.params.storyId,
      req.body
    );
    return sendSuccessResponse(res, notifyuser);
  } catch (e) {
    return sendErrorResponse(res, e);
  }
};

module.exports.uploadImageController = async (req, res) => {
  try {
    const image = await getImageAsBase64(req.fileId);
    const data = {
      image,
      fileId: req.fileId,
    };
    sendSuccessResponse(res, data);
  } catch (err) {
    sendErrorResponse(res, err);
  }
};


module.exports.deleteStoryController = async (req, res) => {
  try {
    const deleted = await storyService.findByIdAndDelete(req.params.storyId);
    if (!deleted) {
      return sendErrorResponse(res, 'Story not found', 404);
    }
    sendSuccessResponse(res, {
      message: 'Story deleted successfully',
      story: deleted,
    });
  } catch (error) {
    sendErrorResponse(res, error.message || 'Error deleting story', 500);
  }
};
