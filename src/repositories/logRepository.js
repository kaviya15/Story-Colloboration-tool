const mongoose = require("mongoose");
const logSchema = require("../models/logModel");

module.exports.getLogs = async function (storyId) {
  try {
    const logs = await logSchema.findOne({
      storyId: new mongoose.Types.ObjectId(String(storyId)),
    });
    console.log("logs", logs);
    return logs;
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
