const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/jwt");
const User = require("../models/userModel");
const Story = require("../models/storyModel");

const registerUser = async (name, email, password) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });
};

const loginUser = async (body) => {
  try {
    const { email, password } = body;
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const { _id, email, name } = existingUser;
      const passmatch = await bcrypt.compare(password, existingUser.password);
      if (passmatch) {
        let token = generateToken(existingUser.email);
        return { email, token, name, _id };
      } else throw new Error("Invalid password");
    } else throw new Error("No user found");
  } catch (err) {
    throw new Error(err + " issue in login service layer");
  }
};

const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { error: 'User not found', statusCode: 404 };
    const totalStoriesWritten = await Story.countDocuments({ createdBy: userId });
    const totalContributions = await Story.countDocuments({ contributors: userId});
    return {
      name: user.name,
      profilePic: user.profilePic,
      totalStoriesWritten,
      totalContributions,
    };
  } catch (err) {
    console.log(err)
    throw new Error(err + " issue in user service layer");
  }
};

const getUserById = async (userId) => userRepository.findById(userId);

module.exports = { registerUser, getUserById,getUserProfile, loginUser };
