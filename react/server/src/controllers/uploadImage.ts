import { Request, Response } from "express";
import FavoriteShoes from "../schemas/favoriteShoes";
import User from "../schemas/user";

const uploadImageHandler = [
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

   
      try {
        const user = await User.findById(userId);

        if (!user) {
          console.log("Użytkownik o podanym id nie został znaleziony");
          return res
            .status(404)
            .json({ error: "Użytkownik nie został znaleziony" });
        }

        const currentDate = new Date().toISOString().replace(/[-T:.Z]/g, ""); // Format date as YYYYMMDDHHmmss
        const newAvatar = `${userId}_${currentDate}`;

        user.avatar = newAvatar;

        await user.save();

        console.log('Pole "avatar" zostało zaktualizowane');

        return res.status(200).json({
          message: "Plik został przesłany i zapisany",
          filename: newAvatar,
        });
      } catch (error) {
        console.log('Błąd podczas aktualizacji pola "avatar":', error);
        return res
          .status(500)
          .json({ error: 'Wystąpił błąd podczas aktualizacji pola "avatar"' });
      }
  },
];

export default uploadImageHandler;
