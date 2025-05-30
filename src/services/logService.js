const { addLogs, getLogs } = require("../repositories/logRepository");
const { getUserById } = require("../services/userService");
const { formatDate } = require("../utils/helper");
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
    let logData = await getLogs(storyId);
    logData = logData.logs.toObject();
    logData = logData.slice(0, 20);
    // console.log("logs", logData);

    const resp = await Promise.all(
      logData
        .filter((value) => value.user_id) // Filter out logs that don't have user_id
        .map(async (value) => {
          const response = await getUserById(value.user_id);
          console.log(response, value);
          let logmessage = null;
          if (response) {
            logmessage = `${response?.name} ${value.message} at ${formatDate(
              value.timestamp
            )}`;
            return { ...value, logmessage };
          }
          return { ...value };
        })
    );

    return resp;
  } catch (err) {
    console.log(err, "error");
    throw err;
  }
};
