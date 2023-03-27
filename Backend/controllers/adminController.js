const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Item = require("../model/ItemModel");
const Coordinator = require("../model/coordinatorModel");
const Student = require("../model/studentModel");
const Department = require("../model/departmentModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// For Excel
const xlsx = require("xlsx");
const path = require("path");

// const jsPDF = require("jspdf");
// const autotable = require("jspdf-autotable");
// Date Fns is used to format the dates we receive
// from our API call
// const format = require("date-fns");
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

// ---------------------------------------ExportAsExcel---------------------------------------------------------------->>>>>>>>>

const exportfile = async (req, res) => {
  var wb = xlsx.utils.book_new();
  Item.find({}, { _id: 0 }, (err, data) => {
    if (err) {
      console.log("Error : ", err);
    } else {
      var temp = JSON.stringify(data); // Convert JSON to Json string
      temp = JSON.parse(temp); // Convert to object
      var ws = xlsx.utils.json_to_sheet(temp); // Convert Json Object into sheet of EXCEL
      xlsx.utils.book_append_sheet(wb, ws, "sheet1"); //Append sheets into wb
      xlsx.writeFile(
        //Now creating new file with unique name and writing EXCEL data to it
        wb,
        (path1 = path.join(
          __dirname,
          "../../",
          "/datafetcher/",
          `${Date.now()}` + "test.xlsx"
        ))
      );
      res.download(path1);
    }
  });
};

// -------------------------------------------------------- GetItemsByFilter -------------------------------------------------------------------------

const getItemsByFilter = async (req,res) => {
  try{
  const { filter,duration,startDate,endDate } = req.body;

    // --------------------------------------------------- Lost Items ---------------------------------------------------------------------------------

    if(filter === "Lost Items"){
      if(duration === "All Time"){
        const items = await Item.find({
          ItemType : "Lost",
        })

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Week"){
        const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

        console.log(startOfLastWeek);
        console.log(endOfLastWeek);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt: {
            $gte: startOfLastWeek,
            $lte: endOfLastWeek
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Week"){
        const startOfThisWeek = moment().startOf('week').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisWeek);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt: {
            $gte: startOfThisWeek,
            $lte: endOfToday,
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Month"){
        const startOfThisMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisMonth);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt: {
            $gte: startOfThisMonth,
            $lte: endOfToday
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Month"){
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate).subtract(30, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast30Days);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt: {
            $gte: startOfLast30Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last 6 Month"){
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate).subtract(180, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast180Days);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt: {
            $gte: startOfLast180Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Year"){
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfCurrentYear);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt: {
            $gte: startOfCurrentYear,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Year"){
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format('YYYY-MM-DD');
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format('YYYY-MM-DD')

        console.log(startOfLastYear);
        console.log(endOfLastYear);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt: {
            $gte: startOfLastYear,
            $lte: endOfLastYear
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Manually"){

        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        console.log(sd);
        console.log(ed);

        const items = await Item.find({
          ItemType : "Lost",
          ListedAt : {
            $gte : sd,
            $lte : ed
          }
        })

        res.status(200).json({
          items: items,
        });

      }
    } 

  // --------------------------------------------------- Found Items ---------------------------------------------------------------------------------

    if(filter === "Found Items"){
      if(duration === "All Time"){
        const items = await Item.find({
          ItemType : "Found",
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Week"){
        const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

        console.log(startOfLastWeek);
        console.log(endOfLastWeek);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt: {
            $gte: startOfLastWeek,
            $lte: endOfLastWeek
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Week"){
        const startOfThisWeek = moment().startOf('week').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisWeek);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt: {
            $gte: startOfThisWeek,
            $lte: endOfToday,
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Month"){
        const startOfThisMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisMonth);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt: {
            $gte: startOfThisMonth,
            $lte: endOfToday
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Month"){
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate).subtract(30, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast30Days);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt: {
            $gte: startOfLast30Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last 6 Month"){
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate).subtract(180, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast180Days);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt: {
            $gte: startOfLast180Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Year"){
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfCurrentYear);
        console.log(endOfToday);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt: {
            $gte: startOfCurrentYear,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Year"){
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format('YYYY-MM-DD');
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format('YYYY-MM-DD')

        console.log(startOfLastYear);
        console.log(endOfLastYear);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt: {
            $gte: startOfLastYear,
            $lte: endOfLastYear
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Manually"){

        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        console.log(sd);
        console.log(ed);

        const items = await Item.find({
          ItemType : "Found",
          ListedAt : {
            $gte : sd,
            $lte : ed
          }
        })

        res.status(200).json({
          items: items,
        });

      }
    } 

  // --------------------------------------------------- Claimed Items ---------------------------------------------------------------------------------

    if(filter === "Claimed Items"){
      if(duration === "All Time"){
        const items = await Item.find({
          status : "Claimed",
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Week"){
        const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

        console.log(startOfLastWeek);
        console.log(endOfLastWeek);

        const items = await Item.find({
          status : "Claimed",
          ListedAt: {
            $gte: startOfLastWeek,
            $lte: endOfLastWeek
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Week"){
        const startOfThisWeek = moment().startOf('week').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisWeek);
        console.log(endOfToday);

        const items = await Item.find({
          status : "Claimed",
          ListedAt: {
            $gte: startOfThisWeek,
            $lte: endOfToday,
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Month"){
        const startOfThisMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisMonth);
        console.log(endOfToday);

        const items = await Item.find({
          status : "Claimed",
          ListedAt: {
            $gte: startOfThisMonth,
            $lte: endOfToday
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Month"){
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate).subtract(30, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast30Days);
        console.log(endOfToday);

        const items = await Item.find({
          status : "Claimed",
          ListedAt: {
            $gte: startOfLast30Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last 6 Month"){
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate).subtract(180, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast180Days);
        console.log(endOfToday);

        const items = await Item.find({
          status : "Claimed",
          ListedAt: {
            $gte: startOfLast180Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Year"){
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfCurrentYear);
        console.log(endOfToday);

        const items = await Item.find({
          status : "Claimed",
          ListedAt: {
            $gte: startOfCurrentYear,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Year"){
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format('YYYY-MM-DD');
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format('YYYY-MM-DD')

        console.log(startOfLastYear);
        console.log(endOfLastYear);

        const items = await Item.find({
          status : "Claimed",
          ListedAt: {
            $gte: startOfLastYear,
            $lte: endOfLastYear
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Manually"){

        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        console.log(sd);
        console.log(ed);

        const items = await Item.find({
          ItemType : "Claimed",
          ListedAt : {
            $gte : sd,
            $lte : ed
          }
        })

        res.status(200).json({
          items: items,
        });

      }
    } 

      // --------------------------------------------------- All Items ---------------------------------------------------------------------------------

    if(filter === "All Items"){
      if(duration === "All Time"){
        const items = await Item.find()

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Week"){
        const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');

        console.log(startOfLastWeek);
        console.log(endOfLastWeek);

        const items = await Item.find({
          ListedAt: {
            $gte: startOfLastWeek,
            $lte: endOfLastWeek
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Week"){
        const startOfThisWeek = moment().startOf('week').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisWeek);
        console.log(endOfToday);

        const items = await Item.find({
          ListedAt: {
            $gte: startOfThisWeek,
            $lte: endOfToday,
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Month"){
        const startOfThisMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfThisMonth);
        console.log(endOfToday);

        const items = await Item.find({
          ListedAt: {
            $gte: startOfThisMonth,
            $lte: endOfToday
          }
        })

        // console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Month"){
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate).subtract(30, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast30Days);
        console.log(endOfToday);

        const items = await Item.find({
          ListedAt: {
            $gte: startOfLast30Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last 6 Month"){
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate).subtract(180, 'days').format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfLast180Days);
        console.log(endOfToday);

        const items = await Item.find({
          ListedAt: {
            $gte: startOfLast180Days,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "This Year"){
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format('YYYY-MM-DD');
        const endOfToday = moment().endOf('day').format('YYYY-MM-DD');

        console.log(startOfCurrentYear);
        console.log(endOfToday);

        const items = await Item.find({
          ListedAt: {
            $gte: startOfCurrentYear,
            $lte: endOfToday
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Last Year"){
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format('YYYY-MM-DD');
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format('YYYY-MM-DD')

        console.log(startOfLastYear);
        console.log(endOfLastYear);

        const items = await Item.find({
          ListedAt: {
            $gte: startOfLastYear,
            $lte: endOfLastYear
          }
        })

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }
      if(duration === "Manually"){

        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        console.log(sd);
        console.log(ed);

        const items = await Item.find({
          ListedAt : {
            $gte : sd,
            $lte : ed
          }
        })

        res.status(200).json({
          items: items,
        });

      }
    } 
  }
  catch(error){
    console.log(error);
  }
}


module.exports = {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  getCounts,
  addDepartment,
  delDept,
  getdept,
  exportfile,
  getItemsByFilter,
};
