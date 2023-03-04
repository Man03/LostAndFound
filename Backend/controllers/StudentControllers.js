const asyncHandler = require("express-async-handler");
const Student = require("../model/studentModel");
const Items = require("../model/ItemModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer.config");
const dotenv = require("dotenv");
dotenv.config();

//----------------------------------------->  delete Student <----------------------------------------------------------------//

const deleteStudent = async (req, res) => {
  try {
    // res.clearCookie("jwtokenCoordinator", { path: "/" });
    const { email } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      res.status(400);
      console.log("Student not found to be deleted");
    }
    nodemailer.sendDeclineEmail(student.email);
    await student.remove();

    return res.status(404).json({ message: "Student deleted" });
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  Get All Student - Based on Status <----------------------------------------------------------------//

const getAllUser = async (req, res) => {
  try {
    const { status } = req.body;

    const student = await Student.find({ status });
    if (!student) {
      res.json({ message: "No Student" });
    } else {
      res.json({ message: "student Details", student: student });
    }
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  Get Student Info <----------------------------------------------------------------//

const getStudentInfo = async (req, res) => {
  try {
    // console.log(req.user);
    const userName = req.user.user.userName;
    // console.log(userName);
    res.status(200).json({
      userName,
    });
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  My-Listing (Only posts that req by Student) <----------------------------------------------------------------//

const getMyListing = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    const items = await Items.find({
      listedBy: student.userName,
    });
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  deleteStudent,
  getAllUser,
  getStudentInfo,
  getMyListing,
};
