const Coordinator = require("../model/coordinatorModel");
const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");

// @desc Register new Coordinator
const registerCoordinator = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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

  const coordinator = await Coordinator.create({
    firstName,
    lastName,
    email,
    department,
    password,
    conPassword,
  });

  if (coordinator) {
    res.status(201).json({
      message: "Register successfully",
      _id: coordinator.id,
      firstName: coordinator.firstName,
      lastName: coordinator.lastName,
      email: coordinator.email,
      department: coordinator.department,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//-------------------------------->Register Admin<------------------------------------------------------------------------------//

// @desc Register new Coordinator
const registerAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, email, password, conPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !conPassword) {
    res.status(400);
    throw new Error("Please add all field");
  }

  // Check if Coordinator exist

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the Password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const hashedConPassword = await bcrypt.hash(conPassword, salt);

  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password,
    conPassword,
  });

  if (admin) {
    res.status(201).json({
      message: "Register successfully",
      _id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
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

module.exports = {
  registerCoordinator,
  registerAdmin,
  loginAdmin,
};
