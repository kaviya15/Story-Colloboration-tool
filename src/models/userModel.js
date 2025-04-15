const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
}, { timestamps: true });

const UserProfile = new mongoose.Schema({
  profilePic: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
module.exports = mongoose.model("UserProfile", UserProfile);
