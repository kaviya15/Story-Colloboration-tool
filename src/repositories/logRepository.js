const mongoose = require("mongoose");
const logSchema = require("../models/logModel");
const { getUserById } = require("../services/userService");
module.exports.getLogs = async function (storyId) {
  try {
    let logData = await logSchema.findOne({
      storyId: new mongoose.Types.ObjectId(String(storyId)),
    });
    console.log(logData, "log");
    return logData;
  } catch (err) {
    return err;
  }
};
module.exports.addLogs = async function addLogs(logData) {
  try {
    const storyObjectId = new mongoose.Types.ObjectId(String(logData.storyId));

    // Find the existing log entry and append the new log message
    const updatedLog = await logSchema.findOneAndUpdate(
      { storyId: storyObjectId }, // Find by storyId
      { $push: { logs: logData.logs } }, // Append `message` to `logs` array
      { new: true, upsert: true } // Return updated document " new ", create if not exists "upsert"
    );

    console.log("Updated Log:", updatedLog);
    return updatedLog;
  } catch (err) {
    console.error("Error adding logs:", err);
    return err;
  }
};

module.exports.deleteLogs = async function deleteLogs(storyId) {
  try {
    const deletedLogs = await Log.deleteMany(storyId);
    return deletedLogs;
  } catch (e) {
    throw e;
  }
};
