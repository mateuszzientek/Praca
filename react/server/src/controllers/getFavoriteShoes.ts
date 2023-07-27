import { Request, Response } from "express";
import FavoriteShoes from "../schemas/favoriteShoes";
import Shoes from "../schemas/shoes";

const getFavoriteShoesHandler = [
  async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
      const favoriteShoes = await FavoriteShoes.find({ userId });
      const favoriteShoeIds = favoriteShoes.map(
        (favoriteShoe) => favoriteShoe.shoeId
      );

      const shoes = await Shoes.find({ _id: { $in: favoriteShoeIds } });

      res.status(200).json({ favoriteShoes: shoes });
    } catch (error) {
      console.error("Błąd podczas pobierania ulubionych butów", error);
      res
        .status(500)
        .json({ message: "Wystąpił błąd podczas pobierania ulubionych butów" });
    }
  },
];

export default getFavoriteShoesHandler;
