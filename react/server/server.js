const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  email_offert: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

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
      .isLength({ min: 10 })
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, email } = req.body;

    User.findOne({ email: email })
      .then((existingUser) => {
        if (!existingUser) {
          console.log("Nieprawidłowy email lub hasło");
          return res.status(401).json({ error: req.t("loginError.error2") });
        }

        // Porównaj wprowadzone hasło z hasłem z bazy danych
        bcrypt.compare(password, existingUser.password, (err, isMatch) => {
          if (err) {
            console.error("Błąd podczas porównywania hasła:", err);
            return res.status(500).json({ error: req.t("loginError.error3") });
          }

          if (isMatch) {
            console.log("Użytkownik zalogowany pomyślnie");
            res
              .status(200)
              .json({ message: "Użytkownik zalogowany pomyślnie" });
          } else {
            console.log("Nieprawidłowy email lub hasło");
            res.status(401).json({ error: req.t("loginError.error2") });
          }
        });
      })
      .catch((error) => {
        console.error("Błąd podczas wyszukiwania użytkownika:", error);
        res.status(500).json({ error: req.t("loginError.error3") });
      });
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
