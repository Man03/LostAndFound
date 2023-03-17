const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Item = require("../model/ItemModel");
const Coordinator = require("../model/coordinatorModel");
const Student = require("../model/studentModel");
const Department = require("../model/departmentModel");
const jwt = require("jsonwebtoken");
const jsPDF = require("jspdf");
const autotable = require("jspdf-autotable");
// Date Fns is used to format the dates we receive
// from our API call
const format = require("date-fns");
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

//-----------------------------------------> get-CountsForDashboard <----------------------------------------------------------------//

const getCounts = async (req, res) => {
  try {
    // Total Lost Items
    const totalLostItems = await Item.countDocuments({
      ItemType: "Lost",
    });

    // Total Found Items
    const totalFoundItems = await Item.countDocuments({
      ItemType: "Found",
    });

    //Total Claimed Items
    const totalClaimedItems = await Item.countDocuments({
      status: "Claimed",
    });

    //Total Lost And Found Items
    const totalLostAndFoundItems = totalFoundItems + totalLostItems;

    //Total Users
    const totalCoordinator = await Coordinator.countDocuments();
    const totalStudent = await Student.countDocuments();
    const totalUsers = totalCoordinator + totalStudent;

    //Current Lost Items
    const totalCurrentLostItems = await Item.countDocuments({
      ItemType: "Lost",
      status: "Not found",
    });

    //Current Founded Items
    const totalCurrentFoundedItems = await Item.countDocuments({
      ItemType: "Found",
      status: "Not claimed",
    });

    //Total Current Lost And Found Items
    const totalCurrentLostandFoundItems =
      totalCurrentFoundedItems + totalCurrentLostItems;

    res.status(200).json({
      totalUsers,
      totalClaimedItems,
      totalLostAndFoundItems,
      totalFoundItems,
      totalLostItems,
      totalCurrentLostandFoundItems,
      totalCurrentFoundedItems,
      totalCurrentLostItems,
    });
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> Add-Department <----------------------------------------------------------------//

const addDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    const ckeckDepartment = await Department.findOne({
      department: department,
    });

    if (ckeckDepartment) {
      res.json({ message: "Department already Exists" });
    } else {
      await Department.create({
        department,
      });
      res.json({ message: `Department added + ${department}` });
    }
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> Delete Department <----------------------------------------------------------------//

const delDept = async (req, res) => {
  try {
    const { department } = req.body;
    const dept = await Department.findOne({ department });
    if (!dept) {
      return res.status(400).json({ message: "Department not found" });
    }
    await dept.remove();

    return res.status(404).json({ message: "Department deleted" });
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> get Department <----------------------------------------------------------------//

const getdept = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json({
      depts: depts,
    });
  } catch (error) {
    console.log(error);
  }
};

//--------------------------------------------- define a generatePDF function that accepts a tickets argument-----------------------------------------------------------------

const generatePDF = async (req, res) => {
  try {
    // initialize jsPDF
    const doc = new jsPDF();

    // define the columns we want and their titles
    const tableColumn = ["Id", "Title", "Issue", "Status", "Closed on"];
    // define an empty array of rows
    const tableRows = [];

    // for each ticket pass all its data into an array
    tickets.forEach((ticket) => {
      const ticketData = [
        ticket.id,
        ticket.title,
        ticket.request,
        ticket.status,
        // called date-fns to format the date on the ticket
        format(new Date(ticket.updated_at), "yyyy-MM-dd"),
      ];
      // push each tickcet's info into a row
      tableRows.push(ticketData);
    });

    // startY is basically margin-top
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    // ticket title. and margin-top + margin-left
    doc.text("Closed tickets within the last one month.", 14, 15);
    // we define the name of our PDF file.
    doc.save(`report_${dateStr}.pdf`);
  } catch (err) {}
};

module.exports = {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  getCounts,
  addDepartment,
  delDept,
  getdept,
  generatePDF,
};
