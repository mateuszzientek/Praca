import { Request, Response } from "express";
import FavoriteShoes, { FavoriteShoesInterface } from "../schemas/favoriteShoes";
import Shoes from "../schemas/shoes";

const getFavoriteShoesHandler = async (req: Request, res: Response) => {
  const { userId } = req.query;

  try {
    const favoriteShoes: FavoriteShoesInterface | null = await FavoriteShoes.findOne({ userId }).lean();

    if (!favoriteShoes) {
      // If no favorite shoes found for the user, send an empty array in the response.
      res.status(200).json({ favoriteShoes: [] });
    } else {
      // If favorite shoes found, extract the shoe IDs.
      const favoriteShoeIds = favoriteShoes.shoes;

      // Find the corresponding shoe documents based on the extracted IDs.
      const shoes = await Shoes.find({ _id: { $in: favoriteShoeIds } }).lean();

      res.status(200).json({ favoriteShoes: shoes });
    }
  } catch (error) {
    console.error("Błąd podczas pobierania ulubionych butów", error);
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania ulubionych butów" });
  }
};

export default getFavoriteShoesHandler;