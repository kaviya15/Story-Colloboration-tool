const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    versions: [
      {
        content: { type: String, default: "" },
        img: { type: String, default: "" },
        updatedTime: { type: Date, default: Date.now },
        lastEditor: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    allContributors: [{ type: mongoose.Schema.Types.ObjectId }],
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    currentEditor: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("stories", storySchema);
