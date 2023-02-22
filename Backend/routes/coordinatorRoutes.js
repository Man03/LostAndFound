const express = require("express");
const router = express.Router();
// const { check, validationResult } = require("express-validator");
const { protectCoordinator } = require("../middlewares/auth_coordinator");

const {
  loginCoordinator,
  signupCoordinator,
} = require("../controllers/coordinatorController");

router.post("/login", loginCoordinator);

router.post("/signup", signupCoordinator);

router.get("/founditems", protectCoordinator, (req, res) => {
  res.json({ message: "Authorized" });
});

module.exports = router;
