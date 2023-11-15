import passport from 'passport';
import User, { IUser } from "../schemas/user";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

module.exports = function (passport: passport.PassportStatic) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (username, password, done) => {
        User.findOne({ email: username })
          .then((user: IUser | null) => {
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password || "", (err, result) => {
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
        clientID: client_id || "",
        clientSecret: client_secret || "",
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ email: profile.emails && profile.emails[0].value })
          .then((existingUser: IUser | null) => {
            if (existingUser) {
              return done(null, existingUser);
            } else {
              const newUser = new User({
                name: profile.displayName.split(" ")[0],
                surname: profile.name && profile.name.familyName || "",
                email: profile.emails && profile.emails[0].value,
                password: "",
                role: "user",
                newsletter: false,
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

  passport.serializeUser((user: any, cb) => {
    cb(null, user._id);
  });

  passport.deserializeUser((id, cb) => {
    User.findById(id)
      .then((user: IUser | null) => {
        cb(null, user);
      })
      .catch((err) => {
        cb(err, null);
      });
  });
};