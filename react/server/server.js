const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { body, validationResult } = require("express-validator");
const User = require("./user");

const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-node-fs-backend");

const link_database = process.env.DATABASE_LINK;

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    supportedLngs: ["en", "pl"],
    fallbackLng: "en",
    detection: {
      order: [
        "localStorage",
        "navigator",
        "querystring",
        "sessionStorage",
        "cookie",
        "path",
        "subdomain",
        "htmlTag",
      ],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "../client/public/assets/locales/{{lng}}/translation.json",
    },
  });

app.use(i18nextMiddleware.handle(i18next));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(cookieParser("secret_key"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

mongoose
  .connect(link_database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

const validateWithReq = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const translatedErrors = errors.array().map((error) => {
      // Tłumaczenie wiadomości błędu przy użyciu req.t
      return {
        ...error,
        msg: req.t(error.msg),
      };
    });

    res.status(400).json({ errors: translatedErrors });
  };
};

app.get(
  "/locales/:lng/translation.json",
  i18nextMiddleware.getResourcesHandler(i18next)
);

app.post(
  "/register",
  validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
    body("password")
      .notEmpty()
      .withMessage("loginError.passReq")
      .isLength({ min: 8 })
      .withMessage("loginError.pass")
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage("loginError.pass"),
    body("name")
      .notEmpty()
      .withMessage("loginError.nameReq")
      .isAlpha()
      .withMessage("loginError.name"),
    body("surname")
      .notEmpty()
      .withMessage("loginError.surnameReq")
      .isAlpha()
      .withMessage("loginError.surname"),
  ]),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, password, email, role, email_offert } = req.body;

    // Haszowanie hasła
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        const user = new User({
          name: name,
          surname: surname,
          password: hashedPassword,
          email: email,
          role: role,
          email_offert: email_offert,
        });

        User.findOne({ email: email })
          .then((existingUser) => {
            if (existingUser) {
              console.log("Podany email jest już przypisany do innego konta");
              return res.status(400).json({
                error: req.t("loginError.emailError"),
              });
            } else {
              // Kontynuuj zapisywanie użytkownika
              user
                .save()
                .then(() => {
                  console.log("Użytkownik został zapisany w bazie danych");
                  res
                    .status(200)
                    .json({ message: "Użytkownik został zarejestrowany" });
                })
                .catch((error) => {
                  console.error("Błąd podczas zapisywania użytkownika:", error);
                  res.status(500).json({ error: req.t("loginError.error1") });
                });
            }
          })
          .catch((error) => {
            console.error("Błąd podczas wyszukiwania użytkownika:", error);
          });
      })
      .catch((error) => {
        console.error("Błąd podczas haszowania hasła:", error);
        res.status(500).json({ error: req.t("loginError.error1") });
      });
  }
);

app.post(
  "/login",
  validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
    body("password")
      .notEmpty()
      .withMessage("loginError.passReq")
      .isLength({ min: 8 })
      .withMessage("loginError.pass")
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage("loginError.pass"),
  ]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) {
        res.status(400).json({
          error: req.t("loginError.error2"),
        });
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.status(200).json({
            message: "Użytkownik zalogowany pomyślnie",
            user: user,
          });
          console.log(req.user);
          console.log("Użytkownik zalogowany pomyślnie");
        });
      }
    })(req, res, next);
  }
);

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error("Błąd podczas wylogowywania użytkownika:", err);
      res.status(500).json({ error: req.t("loginError.error4") });
    } else {
      console.log("wylogowano");
      res.status(200).json({ message: "Użytkownik został wylogowany" });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
