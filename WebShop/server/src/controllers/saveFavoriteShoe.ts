import { Request, Response } from "express";
import FavoriteShoes from "../schemas/favoriteShoes";

const saveFavoriteShoeHandler = [
  async (req: Request, res: Response) => {
    try {
      const { userId, shoeId } = req.body;

      // Find the existing favorite shoe entry for the user
      const favoriteShoeEntry = await FavoriteShoes.findOne({ userId });

      if (favoriteShoeEntry) {
        // If the entry exists, add the new shoeId to the 'shoes' array
        favoriteShoeEntry.shoes.push(shoeId);
        await favoriteShoeEntry.save();
      } else {
        // If the entry does not exist, create a new entry with the 'shoes' array containing the new shoeId
        const favoriteShoe = new FavoriteShoes({
          userId,
          shoes: [shoeId],
        });

        await favoriteShoe.save();
      }

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
