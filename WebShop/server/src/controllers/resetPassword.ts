import { Request, Response} from 'express';
import {body, validationResult } from "express-validator";
const validateWithReq = require('../resources/validation'); 
import User from "../schemas/user"
import crypto from "crypto";
import nodemailer from "nodemailer";
require('dotenv').config();
import ejs from "ejs";
import fs from "fs";

const emailTemplate = fs.readFileSync("./templateHTML/resetEmailTemplate.html", "utf8");

const email_user = process.env.EMAIL_USER;
const email_pass = process.env.EMAIL_PASS;

const resetPasswordHandler= [
    validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
  ]),
  (req:Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    User.findOne({ email: email }).then((existingUser) => {
      if (existingUser) {
        const token = crypto.randomBytes(20).toString("hex");

        existingUser.resetToken = token;
        existingUser.resetTokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // Token ważny przez 5 minut
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
          .catch((error: Error) => {
            console.error("Błąd podczas zapisywania tokenu:", error);
            res.status(500).json({ error: "blad" });
          });
      } else {
        console.log("Nie ma takiego emaila");
        res.status(500).json({ error: req.t("loginError.error5") });
      }
    });
  }
]

export default resetPasswordHandler;