const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  const decoded = verifyToken(token.replace("Bearer ", "")); // Remove "Bearer " prefix

  if (!decoded) {
    return res.status(401).json({ message: "Access Denied: Invalid token" });
  }

  req.userId = decoded.userId; // Add userId to the request for access in routes
  next();
};

module.exports = { authenticate };
