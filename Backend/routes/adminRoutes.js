const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { registerCoordinator } = require("../controllers/adminController");

router.post(
  "/",
  [
    check("firstName", "First Name is required").not().notEmpty(),
    check("lastName", "Last Name is required").not().notEmpty(),
    check("department", "department is required").not().notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with more than 6 characters"
    ).isLength({ min: 6 }),
  ],
  registerCoordinator
);

module.exports = router;
