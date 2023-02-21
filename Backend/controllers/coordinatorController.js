const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Coordinator = require("../model/coordinatorModel");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// @desc   Authenticate a Coordinator
// @route  Post /api/users/login
// access  Public
const loginCoordinator = asyncHandler(async (req, res) => {
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
  } catch (error) {
    console.log(error);
  }
});

//------------------------------------------------Register new Coordinator----------------------------------------------------------->

const registerCoordinator = asyncHandler(async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { firstName, lastName, email, department, password, conPassword } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !department ||
    !password ||
    !conPassword
  ) {
    res.status(400);
    throw new Error("Please add all field");
  }
  // Check if Coordinator exist
  const coordinatorExists = await Coordinator.findOne({ email });

  if (coordinatorExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the Password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const hashedConPassword = await bcrypt.hash(conPassword, salt);

  const coordinator = new Coordinator({
    firstName,
    lastName,
    email,
    department,
    password: hashedPassword,
  });

  const token = await coordinator.generateAuthToken();
  console.log(token);

  res.cookie("jwtoken", token, {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
  });

  await coordinator.save();

  if (coordinator) {
    res.status(201).json({
      message: "Register successfully",
      _id: coordinator.id,
      firstName: coordinator.firstName,
      lastName: coordinator.lastName,
      email: coordinator.email,
      department: coordinator.department,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// //-------------------------------->Generate JWT<------------------------------------------------------------------------------//

// const generateToken = (id) => {
//   return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
//     expiresIn: "5d",
//   });
// };

module.exports = { loginCoordinator, registerCoordinator };
