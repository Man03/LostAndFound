const express = require("express");
const router = express.Router();
const { protectStudent } = require("../middlewares/auth_student");

const {
  deleteStudent,
  getAllUser,
  getStudentInfo,
} = require("../controllers/StudentControllers");

router.get("/dashboard", (req, res) => {
  res.json({ message: "Authorized" });
});

router.post("/delete", deleteStudent);

router.post("/req", getAllUser);

router.get("/getme", protectStudent, getStudentInfo);

module.exports = router;
