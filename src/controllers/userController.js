const User = require("../models/userModel");
// I think if we use repository too, it will be more complicated. Till this controller is enough for this project ?


// Create a new user
exports.createUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const newUser = new User({ name, email, password }); // this actually supposed to goes inside repository
      await newUser.save(); // and this
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  };
  
// Get a user by ID
//   const getUser = async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);
//       if (!user) return res.status(404).json({ message: "User not found" });
//       res.status(200).json(user);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching user", error });
//     }
//   };