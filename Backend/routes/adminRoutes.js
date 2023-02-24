const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/auth_admin");

const {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/adminController");

router.post("/signup", signupAdmin);

router.post("/login", loginAdmin);

router.get("/logout", logoutAdmin);

router.get("/dashboard", protectAdmin, (req, res) => {
  res.json({ message: "Authorized" });
});

module.exports = router;
