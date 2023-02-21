const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminController");



router.post("/createAdmin", registerAdmin);

router.post("/login", loginAdmin);

module.exports = router;
