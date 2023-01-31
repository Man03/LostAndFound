const Coordinator = require("../model/adminModel");
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
    password: hashedPassword,
    conPassword: hashedConPassword,
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

module.exports = {
  registerCoordinator,
};
