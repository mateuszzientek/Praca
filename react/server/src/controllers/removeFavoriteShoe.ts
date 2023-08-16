import { Request, Response } from "express";
import FavoriteShoes from "../schemas/favoriteShoes";

const removeFavoriteShoeHandler = [
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const shoeId = req.params.shoeId;

    try {
      // Find the favorite shoe entry for the user that has the specified shoeId in the shoes array
      const favoriteShoe = await FavoriteShoes.findOne({
        userId,
        shoes: { $elemMatch: { $eq: shoeId } },
      });

      if (!favoriteShoe) {
        // If the favorite shoe entry is not found, return a 404 response
        return res.status(404).json({ message: "Nie znaleziono buta w ulubionych" });
      }

      if (favoriteShoe.shoes.length === 1 && favoriteShoe.shoes[0].toString() === shoeId) {
        // If the favorite shoe entry contains only one element and it matches the specified shoeId,
        // then remove the entire favoriteShoe entry
        await FavoriteShoes.findOneAndRemove({
          userId,
          shoes: { $elemMatch: { $eq: shoeId } },
        });
      } else {
        // Otherwise, remove the specified shoeId from the favoriteShoes array
        await FavoriteShoes.updateOne(
          { userId },
          { $pull: { shoes: shoeId } }
        );
      }

      res.status(200).json({ message: "But został usunięty z ulubionych" });
    } catch (error) {
      console.error("Błąd podczas usuwania buta z ulubionych", error);
      res
        .status(500)
        .json({ message: "Wystąpił błąd podczas usuwania buta z ulubionych" });
    }
  },
];

export default removeFavoriteShoeHandler;
