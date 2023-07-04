import { Request, Response, NextFunction } from 'express';
import {body, validationResult } from "express-validator";
const validateWithReq = require('../validation'); 
import passport from "passport";

const loginHandler = [
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
  ]),
  (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate("local", (err: Error, user:any, info:any) => {
      if (err) throw err;
      if (!user) {
        res.status(400).json({
          error: req.t("loginError.error2"),
        });
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.status(200).json({
            message: "Użytkownik zalogowany pomyślnie",
            user: user,
          });
          console.log(req.user);
          console.log("Użytkownik zalogowany pomyślnie");
        });
      }
    })(req, res, next);
  }
]

export default loginHandler