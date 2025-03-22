const User = require('../models/userModel');

const findById = async (userId) => User.findById(userId).select('-password');

const findByEmail = async (email) => User.findOne({ email });

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

module.exports = { findById, findByEmail, createUser };
