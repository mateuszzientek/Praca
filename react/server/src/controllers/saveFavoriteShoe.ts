import { Request, Response } from "express";
import FavoriteShoes from "../schemas/favoriteShoes";

const saveFavoriteShoeHandler = [
  async (req: Request, res: Response) => {
    try {
      const { userId, shoeId } = req.body;

      const favoriteShoe = new FavoriteShoes({
        userId,
        shoeId,
      });

      await favoriteShoe.save();

      return res
        .status(200)
        .json({ message: "But został pomyślnie dodany do ulubionych" });
    } catch (error) {
      console.error("Błąd podczas zapisywania ulubionego buta", error);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd podczas zapisywania ulubionego buta" });
    }
  },
];

export default saveFavoriteShoeHandler;
