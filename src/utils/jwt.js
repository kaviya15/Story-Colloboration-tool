const jwt = require('jsonwebtoken');
const User =  require("../models/userModel");


const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};


const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.userId });
    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    return null; 
  }
};

module.exports = { generateToken, verifyToken };
