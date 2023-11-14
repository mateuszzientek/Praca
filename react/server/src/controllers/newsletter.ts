import { Request, Response } from 'express';
const validateWithReq = require('../resources/validation'); 
import fs from "fs";
import {body, validationResult} from "express-validator";
import User from "../schemas/user"
import path from 'path'; 
import exceljs from "exceljs";


const newsletterHandler = [
    validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
  ]),
  async (req:Request, res:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    try {
    const { email } = req.body;

    const filePath = path.join(__dirname, '../../newslatter.xlsx'); // File path in the server/src folder

    const workbook = new exceljs.Workbook();
    let worksheet;

    // Check if the file exists
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      // If the file exists, read it and add a new row
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet('Newslatter');
      if (worksheet) {
        worksheet.addRow([email]);
      }
    } else {
      // If the file does not exist, create it and add a new row
      worksheet = workbook.addWorksheet('Newslatter');
      worksheet.addRow([email]);
    }

    // Write the workbook to the file
    await workbook.xlsx.writeFile(filePath);

    // Find the user by email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.newsletter = true;

      // Save the user changes
      await existingUser.save();
      console.log('Zmieniono newslatter');
    }

    // Respond to the client
    return res.status(200).json({
      message: 'Zmieniono newslatter i dodano e-mail do pliku Excel',
    });
  } catch (error) {
    console.error('Błąd podczas obsługi zgłoszenia:', error);
    return res.status(500).json({ error: 'Wystąpił błąd serwera' });
  }
  }
];

export default newsletterHandler;