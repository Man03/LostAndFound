const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { loginUser } = require("../controllers/coordinatorController");

router.post("/login", loginUser);

module.exports = router;
