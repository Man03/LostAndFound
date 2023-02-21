const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//-------------------------------->Register Admin<------------------------------------------------------------------------------//

// @desc Register new Coordinator
const registerAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, email, password, conPassword } = req.body;

  //Check empty fields
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

  // Create Admin user
  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (admin) {
    res.status(201).json({
      message: "Register successfully",
      _id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//-------------------------------->Login Admin<------------------------------------------------------------------------------//

const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin email
    const user = await Admin.findOne({ email });
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

//-------------------------------->Generate JWT<------------------------------------------------------------------------------//

const generateToken = (id) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "5d",
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
