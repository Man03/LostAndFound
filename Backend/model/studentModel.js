const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");

const StudentSchema = mongoose.Schema(
  {
    google: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      token: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// StudentSchema.methods.generateAuthToken = async function () {
//   try {
//     const token_final = jwt.sign(
//       { _id: this._id.toString() },
//       process.env.JWT_SECRET
//     );
//     this.tokens = token_final;
//     await this.save();
//     return token_final;
//   } catch (error) {
//     console.log(error);
//   }
// };


StudentSchema.plugin(passportLocalMongoose);
StudentSchema.plugin(findOrCreate);

module.exports = mongoose.model("Student", StudentSchema);
