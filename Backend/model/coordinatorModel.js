const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

CoordinatorSchema.methods.generateAuthToken = async function () {
  try {
    const token_final = jwt.sign(
      { username: this._id.toString() },
      process.env.JWT_SECRET
    );
    this.tokens = this.tokens.concat({ token: token_final });
    console.log(token_final);
    await this.save();
    return token_final;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("Coordinator", CoordinatorSchema);
