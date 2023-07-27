import { Request, Response } from "express";
import FavoriteShoes from "../schemas/favoriteShoes";
import User from "../schemas/user";

const uploadImageHandler = [
  async (req: Request, res: Response) => {
    const userId = req.body.id;

    if (req.file) {
      console.log(req.file);
      try {
        const user = await User.findById(userId);

        if (!user) {
          console.log("Użytkownik o podanym id nie został znaleziony");
          return res
            .status(404)
            .json({ error: "Użytkownik nie został znaleziony" });
        }

        user.avatar = req.file.filename;
        await user.save();

        console.log('Pole "avatar" zostało zaktualizowane');

        return res.status(200).json({
          message: "Plik został przesłany i zapisany",
          filename: req.file.filename,
        });
      } catch (error) {
        console.log('Błąd podczas aktualizacji pola "avatar":', error);
        return res
          .status(500)
          .json({ error: 'Wystąpił błąd podczas aktualizacji pola "avatar"' });
      }
    } else {
      console.log("Nie znaleziono przesłanego pliku");
      return res
        .status(400)
        .json({ error: "Nie znaleziono przesłanego pliku" });
    }
  },
];

export default uploadImageHandler;
