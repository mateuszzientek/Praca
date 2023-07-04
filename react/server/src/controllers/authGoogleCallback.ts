import { Request, Response, NextFunction } from 'express';
import passport from "passport";

const authGoogleCallbackHandler= [
    (req:Request, res:Response, next:NextFunction) => {
    passport.authenticate("google", (err: Error, user: any, info:any) => {
      if (err) {
        console.error("Błąd uwierzytelniania:", err);
        return next(err);
      }
  
      if (!user) {
        console.log("Uwierzytelnienie nie powiodło się");
        return res.redirect("http://localhost:3000/login");
      }
  
      req.logIn(user, (err) => {
        if (err) {
          console.error("Błąd logowania:", err);
          return next(err);
        }
  
        console.log("Logowanie powiodło się");
        return res.redirect("http://localhost:3000/");
      });
    })(req, res, next);
  }
]

export default authGoogleCallbackHandler