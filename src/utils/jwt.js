const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};


const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; 
  }
};

module.exports = { generateToken, verifyToken };
