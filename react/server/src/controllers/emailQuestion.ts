import { Request, Response } from 'express';
const validateWithReq = require('../validation'); 
import nodemailer from "nodemailer";
import fs from "fs";
import ejs from "ejs";
import {body, validationResult, ValidationChain } from "express-validator";
require('dotenv').config();

const email_user = process.env.EMAIL_USER;
const email_pass = process.env.EMAIL_PASS;


const emailQuestionTemplate = fs.readFileSync(
    "./templateHTML/emailQuestionTemplate.html",
    "utf8"
  );

const emailQuestionHandler = [
    validateWithReq([
      body("email")
        .notEmpty()
        .withMessage("loginError.emailReq") //zmienic zeby bylo inter
        .isEmail()
        .withMessage("loginError.email"), //zmienic zeby bylo inter
      body("name")
        .notEmpty()
        .withMessage("loginError.nameReq") //zmienic zeby bylo inter
        .isAlpha()
        .withMessage("loginError.name"), //zmienic zeby bylo inter
      body("surname")
        .notEmpty()
        .withMessage("loginError.surnameReq") //zmienic zeby bylo inter
        .isAlpha()
        .withMessage("loginError.surname"), //zmienic zeby bylo inter
      body("text").notEmpty().withMessage("Brak textu"), //zmienic zeby bylo inter
    ]),
    (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, surname, email, text } = req.body;
  
      // Konfiguracja transportera poczty
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: email_user,
          pass: email_pass,
        },
      });
  
      const renderedEmailQuestionHTML = ejs.render(emailQuestionTemplate, {
        NAME: name,
        SURNAME: surname,
        EMAIL: email,
        TEXT: text,
      });
  
      // Utworzenie opcji wiadomości
      const mailOptions = {
        from: email,
        to: email_user,
        replyTo: email,
        subject: "Widomośc ze strony SneakersZone",
        html: renderedEmailQuestionHTML,
      };
  
      // Wysłanie wiadomości
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res
            .status(500)
            .json({ error: "Wystąpił błąd podczas wysyłania emaila" });
        } else {
          console.log("Wiadomość wysłana");
          res.status(200).json({ message: "Wiadomość została wysłana" });
        }
      });
    }
  ];
  
  export default emailQuestionHandler;