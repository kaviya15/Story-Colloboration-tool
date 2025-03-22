const userService = require('../services/userService');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await userService.registerUser(name, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, getUser };
