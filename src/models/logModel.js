const mongoose = require("mongoose");
const logSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Story",
  },
  logs: [
    {
      message: { type: String, required: true },
      user_id: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Logs", logSchema);
