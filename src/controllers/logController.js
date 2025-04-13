const { addLogsService, getLogsService } = require("../services/logService");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("./errorHandlerController");

module.exports.addLogsController = async function (req, res) {
  try {
    const data = await addLogsService(req.body);
    return sendSuccessResponse(res, data);
  } catch (err) {
    return sendErrorResponse(res, err);
  }
};

module.exports.getLogsController = async function (req, res) {
  try {
    const data = await getLogsService(req.query.storyId);
    return sendSuccessResponse(res, data);
  } catch (err) {
    console.log("error", err);
    return sendErrorResponse(res, err);
  }
};
