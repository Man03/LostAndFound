const GoogleStrategy = require("passport-google-oauth2").Strategy;
const Student = require("../model/studentModel");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const config = require("../config/config");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          // image: profile.photos[0].value,
        };
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
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("authorization"),
        secretOrKey: "secretKey",
      },
      async (jwtPayload, done) => {
        try {
          // Extract user
          const user = jwtPayload.user;
          done(null, user);
        } catch (error) {
          done(error, false);
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
};
