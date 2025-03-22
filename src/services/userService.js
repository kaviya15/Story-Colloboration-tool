const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

const registerUser = async (name, email, password) => {

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  return await userRepository.createUser({ name, email, password: hashedPassword });
};

const getUserById = async (userId) => userRepository.findById(userId);

module.exports = { registerUser, getUserById };
