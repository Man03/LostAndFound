const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieSession = require("cookie-session");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Student = require("./model/studentModel");
const config = require("./config/config");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("./controllers/passportConfig")(passport);

dotenv.config();

const connectDB = require("./config/db");
const { use } = require("passport");
const port = process.env.PORT || 8000;
const app = express();
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", require("./routes/adminRoutes"));
app.use("/coordinator", require("./routes/coordinatorRoutes"));

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await Student.findOne({ "google.id": profile.id });
        // if user exists return the user
        if (existingUser) {
          return done(null, existingUser);
        }
        // if user does not exist create a new user
        console.log("Creating new user...");
        const newUser = new Student({
          method: "google",
          google: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          },
        });
        // const token = await newUser.generateAuthToken();
        // console.log(token);
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Student.findById(id);
    done(null, user);
  } catch (err) {
    console.error(err);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "http://localhost:3000",
//     failureMessage: true,
//   }),
//   async (req, res) => {
//     res.redirect("http://localhost:3000/student/foundItems");
//   }
// );

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    jwt.sign(
      { user: req.user },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          });
        }
        res.json({
          token,
        });
      }
    );
    res.redirect("http://localhost:3000/student/foundItems");
  }
);

app.get(
  "/student/foundItems",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send("Welcome");
  }
);

app.listen(port, () => console.log(`Server started on port ${port}`));
