const mongoose = require("mongoose");

const CoordinatorSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Please add a email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    conPassword: {
      type: String,
      required: [true, "Please add a confirm password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coordinator", CoordinatorSchema);
