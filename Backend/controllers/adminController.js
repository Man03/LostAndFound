const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//-------------------------------->Register Admin<------------------------------------------------------------------------------//

// @desc Register new Coordinator
const signupAdmin = asyncHandler(async (req, res) => {
  try {
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
      const token = await admin.generateAuthToken();
      console.log(token);

      await admin.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        console.log("information of user: ");

        console.log(admin.firstName);
        console.log(admin.lastName);
        console.log(admin.email);
        console.log(admin.token);
      });

      res.status(201).json({
        message: "Register successfully",
        _id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (err) {
    console.log(err);
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
    } else if (user && (await bcrypt.compare(password, user.password))) {
      const token = await user.generateAuthToken();

      res.cookie("jwtokenAdmin", token, {
        expires: new Date(Date.now() + 86400000),
        httpOnly: true,
      });

      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        message: "Successfully logged in",
      });
    } else {
      res.json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
  }
});

//-------------------------------->Logout Admin<------------------------------------------------------------------------------//

const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("jwtokenAdmin", { path: "/" });
    res.status(200).send("user logout");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupAdmin,
  loginAdmin,
  logoutAdmin
};
