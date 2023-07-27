import { Request, Response } from "express";
import FavoriteShoes from "../schemas/favoriteShoes";

const removeFavoriteShoeHandler = [
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const shoeId = req.params.shoeId;

    try {
      const removedShoe = await FavoriteShoes.findOneAndRemove({
        userId,
        shoeId,
      });
      if (removedShoe) {
        res.status(200).json({ message: "But został usunięty z ulubionych" });
      } else {
        res.status(404).json({ message: "Nie znaleziono buta w ulubionych" });
      }
    } catch (error) {
      console.error("Błąd podczas usuwania buta z ulubionych", error);
      res
        .status(500)
        .json({ message: "Wystąpił błąd podczas usuwania buta z ulubionych" });
    }
  },
];

export default removeFavoriteShoeHandler;
