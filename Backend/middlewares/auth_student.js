const jwt = require("jsonwebtoken");
const Student = require("../model/studentModel");

const protectStudent = async (req, res, next) => {
  try {
    const token = req.cookies.jwtokenStudent;

    console.log("Token is from cookie" + token);

    const verify_token = jwt.verify(token, process.env.JWT_SECRET);
    /*     console.log(verify_token._id); */
    root_user = await Student.findOne({
      _id: verify_token._id,
      token: token,
    });
    req.user = root_user;
    next();
  } catch (error) {
    res.status(401).send("unauthorized....");
    console.log(error);
  }
};

module.exports = { protectStudent };
