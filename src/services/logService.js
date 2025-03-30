const { addLogs, getLogs } = require("../repositories/logRepository");

module.exports.addLogsService = async function (body) {
  try {
    const data = {
      storyId: body.storyId,
      logs: body.logs,
    };
    return await addLogs(data);
  } catch (err) {
    return err;
  }
};

module.exports.getLogsService = async function (storyId) {
  try {
    return await getLogs(storyId);
  } catch (err) {
    return err;
  }
};
