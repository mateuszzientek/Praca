import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
const validateWithReq = require('../resources/validation'); 
import User from "../schemas/user";

const saveEditDataHandler = [
  validateWithReq([
    body("name")
      .notEmpty()
      .withMessage("Imię jest wymagane")
      .isAlpha()
      .withMessage("Nieprawidłowe imię"),
    body("surname")
      .notEmpty()
      .withMessage("Nazwisko jest wymagane")
      .isAlpha()
      .withMessage("Nieprawidłowe nazwisko"),
    body("day")
      .optional()
      .if(body("day").not().isEmpty())
      .isInt({ min: 1, max: 31 })
      .withMessage("Nieprawidłowy dzień"),
    body("month")
      .optional()
      .if(body("month").not().isEmpty())
      .isInt({ min: 1, max: 12 })
      .withMessage("Nieprawidłowy miesiąc"),
    body("year")
      .optional()
      .if(body("year").not().isEmpty())
      .isInt({ min: 1900 })
      .withMessage("Nieprawidłowy rok"),
    body("gender").optional(),
  ]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id, name, surname, day, month, year, gender } = req.body;

      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ error: "Użytkownik nie został znaleziony" });
      }

      user.name = name;
      user.surname = surname;

      if (day && month && year) {
        user.dateOfBirth = new Date(year, month - 1, day);
      }

      if (gender) {
        user.gender = gender;
      }

      await user.save();

      res
        .status(200)
        .json({ message: "Dane użytkownika zostały zaktualizowane" });
    } catch (error) {
      console.error(
        "Błąd podczas zapisywania zaktualizowanych danych użytkownika:",
        error
      );
      res.status(500).json({
        error: "Wystąpił błąd podczas zapisywania danych użytkownika",
      });
    }
  },
];

export default saveEditDataHandler;
