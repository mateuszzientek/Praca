import { Request, Response } from 'express';
const validateWithReq = require('../validation'); 
import fs from "fs";
import {body, validationResult} from "express-validator";
import User from "../schemas/user"
import exceljs from "exceljs";


const newsletterHandler = [
    validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
  ]),
  (req:Request, res:Response) => {
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
          existingUser.newsletter = true;

          existingUser
            .save()
            .then(() => {
              console.log("Zmieniono newslatter");
            })
            .catch((error: Error) => {
              console.log("Wystąpił błąd");
            });
        }
      })
      .catch((error: Error) => {
        console.error("Błąd podczas wyszukiwania użytkownika:");
        return res.status(500).json({ error: "Wystąpił błąd" });
      });
  }
];

export default newsletterHandler;