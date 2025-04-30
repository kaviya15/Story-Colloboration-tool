const User = require("../models/userModel");

const findById = async (userId) => User.findById(userId).select("-password");

const findByEmail = async (email) => User.findOne({ email });

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const resetPassword = async (email, hashedPassword) => {
  const user = await User.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true }
  );
  console.log("user", user);
  return user;
};

module.exports = { findById, findByEmail, createUser, resetPassword };
