const userService = require("../services/userService");
const { generateToken, verifyToken } = require("../utils/jwt");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("./errorHandlerController");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await userService.registerUser(name, email, password);

    if (!newUser) {
      return res.status(400).json({ message: "User registration failed" });
    }

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      SameSite: "None",
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const existingUser = await userService.loginUser(req.body);
    const { token, ...rest } = existingUser;
    if (existingUser) {
      res.cookie("token", token, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        sameSite: "None", // Allow cross-origin cookies
        secure: true, // Set to false for local dev (no HTTPS)
        path: "/",
      });

      sendSuccessResponse(res, rest);
    }
  } catch (e) {
    sendErrorResponse(res, e);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userProfile = await userService.getUserProfile(req.params.id); 
    if (userProfile.error) {
      return res.status(result.statusCode || 500).json({ message: userProfile.error });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    if (req.cookies.token) {
      res.clearCookie("token", {
        httpOnly: true,
      });
      sendSuccessResponse(res, "Logged out ");
    }
  } catch (err) {
    sendErrorResponse(res, "Failed to logout");
  }
};

const authentication = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = await verifyToken(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { registerUser, getUser, loginUser,getUserProfile, logout, authentication};
