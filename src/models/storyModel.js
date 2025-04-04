const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: { type: String },
    versions: [
      {
        coverImage: { type: mongoose.Schema.Types.ObjectId, ref: "uploads" },
        content: { type: String, default: "" },
        updatedTime: { type: Date, default: Date.now },
        lastEditor: { type: mongoose.Schema.Types.ObjectId, required: true },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    allContributors: [{ type: mongoose.Schema.Types.ObjectId }],
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // New field to track users who liked
    currentEditor: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("stories", storySchema);
