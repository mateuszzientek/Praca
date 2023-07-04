import { Request, Response} from 'express';
import {body, validationResult } from "express-validator";
const validateWithReq = require('../validation'); 
import User from "../schemas/user"
import bcrypt from "bcryptjs";

const resetPasswordChangeHandler= [
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
  (req:Request, res:Response) => {
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
          existingUser.resetTokenExpiration.getTime() < Date.now()
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

          existingUser.resetToken = "";
          existingUser.resetTokenExpiration = new Date();

          existingUser
            .save()
            .then(() => {
              console.log("Zmieniono hasło");
              return res
                .status(200)
                .json({ message: "Hasło zostało zmienione" });
            })
            .catch((error: Error) => {
              console.log("Wystąpił błąd");
              return res.status(500).json({ error: "Wystąpił błąd serwera" });
            });
        });
      })
      .catch((error: Error) => {
        console.log("Wystąpił błąd");
        return res.status(500).json({ error: "Wystąpił błąd serwera" });
      });
  }
]

export default resetPasswordChangeHandler;