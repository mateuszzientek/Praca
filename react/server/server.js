const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const exceljs = require("exceljs");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const ejs = require("ejs");
const User = require("./user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-node-fs-backend");

const link_database = process.env.DATABASE_LINK;
const email_user = process.env.EMAIL_USER;
const email_pass = process.env.EMAIL_PASS;

const emailTemplate = fs.readFileSync("resetEmailTemplate.html", "utf8");

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
          newslatter: false,
          resetToken: null,
          resetTokenExpiration: null,
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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("Błąd uwierzytelniania:", err);
      return next(err);
    }

    if (!user) {
      console.log("Uwierzytelnienie nie powiodło się");
      return res.redirect("http://localhost:3000/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Błąd logowania:", err);
        return next(err);
      }

      console.log("Logowanie powiodło się");
      return res.redirect("http://localhost:3000/");
    });
  })(req, res, next);
});

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

app.post(
  "/resetPassword",
  validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
  ]),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    User.findOne({ email: email }).then((existingUser) => {
      if (existingUser) {
        const token = crypto.randomBytes(20).toString("hex");

        existingUser.resetToken = token;
        existingUser.resetTokenExpiration = Date.now() + 5 * 60 * 1000; // Token ważny przez 5 min
        existingUser
          .save()
          .then(() => {
            console.log("Token został zapisany");

            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: email_user,
                pass: email_pass,
              },
            });

            const renderedHTML = ejs.render(emailTemplate, { TOKEN: token });

            const mailOptions = {
              from: email_user,
              to: email,
              subject: req.t("passwordReset.text3"),
              html: renderedHTML,
            };

            transporter.sendMail(mailOptions, (error) => {
              if (error) {
                console.error("Błąd podczas wysyłania e-maila:", error);
                res
                  .status(500)
                  .json({ error: "Wystąpił błąd podczas wysylania emaila." });
              } else {
                console.error("Wyslano email");
                res.status(200).json({ message: "wyslano email" });
              }
            });
          })
          .catch((error) => {
            console.error("Błąd podczas zapisywania tokenu:", error);
            res.status(500).json({ error: "blad" });
          });
      } else {
        console.log("Nie ma takiego emaila");
        res.status(500).json({ error: req.t("loginError.error5") });
      }
    });
  }
);

app.post(
  "/resetPasswordChange",
  validateWithReq([
    body("password")
      .notEmpty()
      .withMessage("Hasło wymagane")
      .isLength({ min: 8 })
      .withMessage("Hasło musi mieć co najmniej 8 znaków")
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Hasło musi być silne"),
    body("secPassword")
      .notEmpty()
      .withMessage("Hasło wymagane")
      .isLength({ min: 8 })
      .withMessage("Hasło musi mieć co najmniej 8 znaków")
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Hasło musi być silne"),
  ]),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, secPassword } = req.body;

    User.findOne({ resetToken: token })
      .then((existingUser) => {
        if (!existingUser) {
          console.log("Błąd: Nie znaleziono użytkownika");
          return res.status(404).json({ error: "Nie znaleziono użytkownika" });
        }

        if (
          existingUser.resetTokenExpiration &&
          existingUser.resetTokenExpiration < Date.now()
        ) {
          console.log("Błąd: Token wygasł");
          return res.status(400).json({ error: "Token wygasł" });
        }

        bcrypt.hash(secPassword, 10, (err, hash) => {
          if (err) {
            console.log("Błąd: Haszowanie hasła nie powiodło się");
            return res.status(500).json({ error: "Wystąpił błąd serwera" });
          }

          existingUser.password = hash;

          existingUser.resetToken = null;
          existingUser.resetTokenExpiration = null;

          existingUser
            .save()
            .then(() => {
              console.log("Zmieniono hasło");
              return res
                .status(200)
                .json({ message: "Hasło zostało zmienione" });
            })
            .catch((error) => {
              console.log("Wystąpił błąd");
              return res.status(500).json({ error: "Wystąpił błąd serwera" });
            });
        });
      })
      .catch((error) => {
        console.log("Wystąpił błąd");
        return res.status(500).json({ error: "Wystąpił błąd serwera" });
      });
  }
);

app.post("/checkExpireToken", (req, res) => {
  const { token } = req.body;

  User.findOne({ resetToken: token }).then((existingUser) => {
    if (!existingUser) {
      console.log("Błąd: Nie znaleziono użytkownika");
      return res.status(404).json({ error: "Nie znaleziono użytkownika" });
    }

    if (
      existingUser.resetTokenExpiration &&
      existingUser.resetTokenExpiration < Date.now()
    ) {
      console.log("Błąd: Token wygasł");
      return res.status(400).json({ error: "Token wygasł" });
    } else {
      console.log("Token aktywny");
      return res.status(200).json({ message: "Token aktywny" });
    }
  });
});

app.post(
  "/newslatter",
  validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
  ]),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    User.findOne({ email })
      .then((existingUser) => {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Newslatter");

        worksheet.addRow([email]);

        const filePath = "C:/Users/mateu/Desktop/Praca/newslatter.xlsx";

        // Sprawdź, czy plik Excel istnieje
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            // Jeśli plik nie istnieje, utwórz nowy plik i zapisz go
            workbook.xlsx
              .writeFile(filePath)
              .then(() => {
                console.log("Plik Excel został zapisany");
                return res.status(200).json({
                  message:
                    "Zmieniono newslatter i zapisano e-mail w pliku Excel",
                });
              })
              .catch((error) => {
                console.log("Błąd podczas zapisywania pliku Excel:", error);
                return res.status(500).json({ error: "Wystąpił błąd serwera" });
              });
          } else {
            // Jeśli plik istnieje, wczytaj go i dodaj nowy wiersz z e-mailem
            workbook.xlsx
              .readFile(filePath)
              .then(() => {
                const worksheet = workbook.getWorksheet("Newslatter");
                worksheet.addRow([email]);

                return workbook.xlsx.writeFile(filePath);
              })
              .then(() => {
                console.log("E-mail został dodany do istniejącego pliku Excel");
                return res.status(200).json({
                  message:
                    "Zmieniono newslatter i dodano e-mail do istniejącego pliku Excel",
                });
              })
              .catch((error) => {
                console.log("Błąd podczas zapisywania pliku Excel:", error);
                return res.status(500).json({ error: "Wystąpił błąd serwera" });
              });
          }
        });

        if (existingUser) {
          existingUser.newslatter = true;

          existingUser
            .save()
            .then(() => {
              console.log("Zmieniono newslatter");
            })
            .catch((error) => {
              console.log("Wystąpił błąd");
            });
        }
      })
      .catch((err) => {
        console.error("Błąd podczas wyszukiwania użytkownika:", err);
        return res.status(500).json({ error: "Wystąpił błąd" });
      });
  }
);

app.post("/emailQuestion", (req, res) => {
  const { name, surname, email, text } = req.body;

  // Konfiguracja transportera poczty
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email_user,
      pass: email_pass,
    },
  });

  // Utworzenie opcji wiadomości
  const mailOptions = {
    from: email,
    to: email_user,
    replyTo: email,
    subject: "Widomośc ze strony SneakersZone",
    text: `Imię: ${name}\nNazwisko: ${surname}\nE-mail: ${email}\nWiadomość: ${text}`,
  };

  // Wysłanie wiadomości
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Wystąpił błąd podczas wysyłąnai emaila" });
    } else {
      console.log("Wiadomość wysłana");
      res.status(200).json({ message: "Wiadomość została wysłana" });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
