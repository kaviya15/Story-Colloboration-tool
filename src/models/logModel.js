const mongoose = require("mongoose");

const logSchema = mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId },
  logs: [{ type: String }],
});

module.exports = mongoose.model("logs", logSchema);
