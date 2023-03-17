const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/auth_admin");

const {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  getCounts,
  addDepartment,
  delDept,
  getdept,
  exportfile,
  getItemsByFilter,
} = require("../controllers/adminController");

router.post("/signup", signupAdmin);

router.post("/login", loginAdmin);

router.get("/logout", logoutAdmin);

router.get("/dashboard", protectAdmin, (req, res) => {
  res.json({ message: "Authorized" });
});

router.get("/dash", getCounts);

router.get("/getCounts", getCounts);

router.post("/adddept", protectAdmin, addDepartment);

router.post("/deletedept", delDept);

router.get("/getdept", getdept);

router.get("/exportFile",exportfile);

router.get("/getFilterItems",getItemsByFilter);

module.exports = router;
