const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Coordinator = require("../model/coordinatorModel");
const Items = require("../model/ItemModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer.config");
const dotenv = require("dotenv");
dotenv.config();

// @desc   Authenticate a Coordinator
// @route  Post /api/users/login
// access  Public
const loginCoordinator = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin email
    const user = await Coordinator.findOne({ email });
    if (!user) {
      res.json({ message: "User not found" });
    } else if (user && (await bcrypt.compare(password, user.password))) {
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
    const { userName, email, department, password, conPassword } = req.body;

    //Check empty fields

    if (!userName || !email || !department || !password || !conPassword) {
      res.status(400).json({ message: "Please add all fields" });
      throw new Error("Please add all field");
    }
    // Check if Coordinator exist
    const coordinatorExists = await Coordinator.findOne({ email });

    if (coordinatorExists) {
      res.status(400).json({ message: "User alreay exists" });
      throw new Error("User already exists");
    }

    const forSendPassword = password;

    // Hash the Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create Coordinator

    const coordinator = await Coordinator.create({
      userName,
      email,
      department,
      password: hashedPassword,
      status: "Active",
    });

    if (coordinator) {
      const token = await coordinator.generateAuthToken();
      console.log(token);

      await coordinator.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        console.log("information of user: ");

        console.log(coordinator.userName);
        console.log(coordinator.email);
        console.log(coordinator.department);
        console.log(coordinator.token);
      });

      nodemailer.sendPasswordMail(
        coordinator.userName,
        forSendPassword,
        coordinator.email,
        coordinator.token
      );

      res.status(200).json({
        message: "Register successfully",
        _id: coordinator.id,
        firstName: coordinator.userName,
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

//----------------------------------------->  Get Coordinator Info <----------------------------------------------------------------//

const getCoordinatorInfo = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.user._id);
    // console.log(coordinator.userName);
    const userName = coordinator.userName;
    res.status(200).json({
      userName,
    });
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  delete Coordinator <----------------------------------------------------------------//

const deleteCoordinator = async (req, res) => {
  try {
    // res.clearCookie("jwtokenCoordinator", { path: "/" });
    const { email } = req.body;

    const coordinator = await Coordinator.findOne({ email });

    if (!coordinator) {
      res.status(400);
      console.log("Coordinator not found to be deleted");
    }
    nodemailer.sendDeclineEmail(coordinator.email, coordinator.token);
    await coordinator.remove();

    return res.status(404).json({ message: "Coordinator deleted" });
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  get all-Coordinator <----------------------------------------------------------------//

const getAllUser = async (req, res) => {
  try {
    const { status } = req.body;
    
    const coordinator = await Coordinator.find({ status });
    if (!coordinator) {
      res.json({ message: "No Coordinator" });
    } else {
      res.json({ message: "Coordinator Details", coordinator: coordinator });
    }
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  My-Listing (Only posts that req by Coordinator) <----------------------------------------------------------------//

const getMyListing = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.user._id);

    const items = await Items.find({
      listedBy: coordinator.userName,
    });
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginCoordinator,
  signupCoordinator,
  logoutCoordinator,
  getCoordinatorInfo,
  deleteCoordinator,
  getAllUser,
  getMyListing,
};
