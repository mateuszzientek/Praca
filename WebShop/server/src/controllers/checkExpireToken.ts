import { Request, Response } from 'express';
import User from "../schemas/user"

const checkExpireTokenHandler= [ 
    (req:Request, res: Response) => {
    const { token } = req.body;
  
    User.findOne({ resetToken: token }).then((existingUser) => {
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
      } else {
        console.log("Token aktywny");
        return res.status(200).json({ message: "Token aktywny" });
      }
    });
  }
]

export default checkExpireTokenHandler;