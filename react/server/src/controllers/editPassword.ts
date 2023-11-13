import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
const validateWithReq = require('../resources/validation'); 
import User from "../schemas/user";
import bcrypt from "bcryptjs";

const editPasswordHandler = [
validateWithReq([
    body("oldPassword")
    .notEmpty()
    .withMessage("loginError.passReq")
    .isLength({ min: 8 })
    .withMessage("loginError.pass")
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage("loginError.pass"),
    body("newPassword")
    .notEmpty()
    .withMessage("loginError.passReq")
    .isLength({ min: 8 })
    .withMessage("loginError.pass")
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage("loginError.pass"),
  ]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { newPassword, oldPassword, id } = req.body;
      
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: "Użytkownik o podanym ID nie został znaleziony." });
      }
  
      const isPasswordValid = await bcrypt.compare(oldPassword , user.password as string);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Podane stare hasło jest nieprawidłowe." });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      user.password = hashedPassword;
      await user.save();
  
      return res.json({ message: "Hasło użytkownika zostało zaktualizowane." });
    } catch (err) {
      return res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji hasła użytkownika." });
    }
  }
]

export default editPasswordHandler;