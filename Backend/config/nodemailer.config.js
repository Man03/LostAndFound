const nodemailer = require("nodemailer");

const user = process.env.USER;
const pass = process.env.USER_PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendPasswordMail = (
  firstName,
  lastName,
  password,
  email,
  token
) => {
  console.log("Inside PasswordMail");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Your Password",
      html: `<h4>Your are now Coordinator of Lost and Found Helper System of DDU</h4>
            <hr/>
            <h1>Your Name :</h1>
            <h3>${firstName} ${lastName}</h3>
            <hr/>
            <h1>Your Email :</h1>
            <h3>${email}</h3>
            <hr/>
            <h1>Your Password :</h1>
            <h3>${password}</h3>
            </div>`,
    })
    .catch((err) => console.log(err));
};
