import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
const validateWithReq = require("../validation");
import User from "../schemas/user";

const editEmailHandler = [
  validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
  ]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, id } = req.body; // Odczytaj wartości email i id z req.body

    try {
      const user = await User.findOne({ _id: id });

      if (!user) {
        return res.status(404).json({ error: "Użytkownik o podanym ID nie został znaleziony." });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ error: "Podany adres email już istnieje w bazie danych." });
      }

      user.email = email;
      await user.save();

      return res.json({ message: "Email użytkownika został zaktualizowany." });
    } catch (err) {
      return res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji emaila użytkownika." });
    }
  },
];

export default editEmailHandler;