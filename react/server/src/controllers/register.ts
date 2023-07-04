import { Request, Response, NextFunction } from 'express';
import {body, validationResult } from "express-validator";
const validateWithReq = require('../validation'); 
import bcrypt from "bcryptjs";
import User from "../schemas/user"

const registerHandler= [
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
  (req: Request, res: Response) => {
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
                .catch((error: Error) => {
                  console.error("Błąd podczas zapisywania użytkownika:", error);
                  res.status(500).json({ error: req.t("loginError.error1") });
                });
            }
          })
          .catch((error: Error) => {
            console.error("Błąd podczas wyszukiwania użytkownika:", error);
          });
      })
      .catch((error) => {
        console.error("Błąd podczas haszowania hasła:", error);
        res.status(500).json({ error: req.t("loginError.error1") });
      });
  }
]

export default registerHandler