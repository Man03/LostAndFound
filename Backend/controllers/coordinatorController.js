const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Coordinator = require("../model/coordinatorModel");
const dotenv = require("dotenv");
dotenv.config();

// @desc   Authenticate a Coordinator
// @route  Post /api/users/login
// access  Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Coordinator.findOne({ email });
    if (!user) {
      res.json({ message: "User not found" });
    } else if (user.password !== password) {
      res.json({ message: "Invalid Password" });
    } else {
      res.status(200).json({ message: "Successfully logged in" });
    }
    // if email and password match, log the user in and return a token
    // req.session.user=user.email;
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: 'Error while logging in' });
  }

  // res.json({ message: "Login Coordinator " });
});

module.exports = { loginUser };
