const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/jwt");

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

const getUserById = async (userId) => userRepository.findById(userId);

module.exports = { registerUser, getUserById, loginUser };
