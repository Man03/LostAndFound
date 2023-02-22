const jwt = require("jsonwebtoken");
const Coordinator = require("../model/coordinatorModel");

const protectCoordinator = async (req, res, next) => {
  try {
    const token = req.cookies.jwtokenCoordinator;

    console.log("Token is from cookie" + token);

    const verify_token = jwt.verify(token, process.env.JWT_SECRET);
    /*     console.log(verify_token._id); */
    root_user = await Coordinator.findOne({
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

module.exports = { protectCoordinator };
