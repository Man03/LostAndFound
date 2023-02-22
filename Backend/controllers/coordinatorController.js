const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Coordinator = require("../model/coordinatorModel");
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
    } else if (bcrypt.compare(user.password, password)) {
      const token = await user.generateAuthToken();

      res.cookie("jwtokenCoordinator", token, {
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

//------------------------------------------------Register new Coordinator----------------------------------------------------------->

const signupCoordinator = asyncHandler(async (req, res) => {
  try {
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

    //Create Coordinator

    const coordinator = await Coordinator.create({
      firstName,
      lastName,
      email,
      department,
      password: hashedPassword,
    });

    if (coordinator) {
      const token = await coordinator.generateAuthToken();
      console.log(token);

      // res.cookie("jwtokenCoordinator", token, {
      //   expires: new Date(Date.now() + 86400000),
      //   httpOnly: true,
      // });

      await coordinator.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        console.log("information of user: ");

        console.log(coordinator.firstName);
        console.log(coordinator.lastName);
        console.log(coordinator.email);
        console.log(coordinator.department);
        console.log(coordinator.token);
      });

      res.status(200).json({
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
  } catch (error) {
    console.log(error);
  }
});

// //-------------------------------->Generate JWT<------------------------------------------------------------------------------//

// const generateToken = (id) => {
//   return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
//     expiresIn: "5d",
//   });
// };

//----------------------------------------->  Logout - Coordinator <----------------------------------------------------------------//

const logoutCoordinator = async (req, res) => {
  try {
    res.clearCookie("jwtokenCoordinator", { path: "/" });
    res.status(200).send("user logout");
    console.log("logout finish ");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { loginCoordinator, signupCoordinator, logoutCoordinator };
