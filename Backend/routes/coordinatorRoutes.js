const express = require("express");
const router = express.Router();
// const { check, validationResult } = require("express-validator");
const { protectCoordinator } = require("../middlewares/auth_coordinator");

const {
  loginCoordinator,
  signupCoordinator,
  logoutCoordinator,
  getCoordinatorInfo,
  deleteCoordinator,
  getAllUser,
} = require("../controllers/coordinatorController");

router.post("/login", loginCoordinator);

router.post("/signup", signupCoordinator);

router.get("/logout", logoutCoordinator);

router.get("/dashboard", protectCoordinator, (req, res) => {
  res.json({ message: "Authorized" });
});

router.get("/getme", protectCoordinator, getCoordinatorInfo);

router.post("/delete", deleteCoordinator);

router.post("/req", getAllUser);

module.exports = router;
