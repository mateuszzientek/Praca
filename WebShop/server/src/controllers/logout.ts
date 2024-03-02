import { Request, Response} from 'express';

const logoutHandler = [
    (req: Request, res:Response) => {
    req.logout(function (err) {
      if (err) {
        console.error("Błąd podczas wylogowywania użytkownika:", err);
        res.status(500).json({ error: req.t("loginError.error4") });
      } else {
        console.log("wylogowano");
        res.status(200).json({ message: "Użytkownik został wylogowany" });
      }
    });
  }
]

export default logoutHandler