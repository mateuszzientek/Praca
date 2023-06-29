const User = require("./user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
      },
      (username, password, done) => {
        User.findOne({ email: username })
          .then((user) => {
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) throw err;
              if (result === true) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          })
          .catch((err) => {
            throw err;
          });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: client_id,
        clientSecret: client_secret,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ email: profile.emails[0].value })
          .then((existingUser) => {
            if (existingUser) {
              return done(null, existingUser);
            } else {
              const newUser = new User({
                name: profile.displayName.split(" ")[0],
                surname: profile.name.familyName || "",
                email: profile.emails[0].value,
                password: "",
                role: "user",
                newslatter: false,
                email_offert: false,
                resetToken: null,
                resetTokenExpiration: null,
              });
              return newUser
                .save()
                .then((savedUser) => {
                  return done(null, savedUser);
                })
                .catch((error) => {
                  throw error;
                });
            }
          })
          .catch((error) => {
            throw error;
          });
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id })
      .then((user) => {
        cb(null, user);
      })
      .catch((err) => {
        throw err;
      });
  });
};
