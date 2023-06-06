const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const link_database = process.env.DATABASE_LINK;

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

app.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email jest wymagany")
      .isEmail()
      .withMessage("Nieprawidłowy format adresu email"),
    body("password")
      .notEmpty()
      .withMessage("Hasło jest wymagane")
      .isLength({ min: 8 })
      .withMessage("Hasło musi mieć co najmniej 8 znaków")
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Hasło musi zawierać przynajmniej 1 dużą literę i cyfrę"),
    body("name")
      .notEmpty()
      .withMessage("Imię jest wymagane")
      .isAlpha()
      .withMessage("Imię może zawierać tylko litery"),
    body("surname")
      .notEmpty()
      .withMessage("Nazwisko jest wymagane")
      .isAlpha()
      .withMessage("Nazwisko może zawierać tylko litery"),
  ],
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
                error: "Podany email jest już przypisany do innego konta",
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
                  res
                    .status(500)
                    .json({ error: "Błąd podczas zapisywania użytkownika" });
                });
            }
          })
          .catch((error) => {
            console.error("Błąd podczas wyszukiwania użytkownika:", error);
          });
      })
      .catch((error) => {
        console.error("Błąd podczas haszowania hasła:", error);
        res.status(500).json({ error: "Błąd podczas rejestracji użytkownika" });
      });
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
