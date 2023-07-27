import { Request, Response } from "express";
const validateWithReq = require("../validation");
import FavoriteShoes from "../schemas/favoriteShoes";

const getFavoriteShoesByIdHandler = [
  (req: Request, res: Response) => {
    const userId = req.query.userId;

    FavoriteShoes.find({ userId })
      .then((favoriteShoes) => {
        const shoeIds = favoriteShoes.map(
          (favoriteShoe) => favoriteShoe.shoeId
        );

        console.log(shoeIds);
        res.json(shoeIds);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania ulubionych butów", error);
        res
          .status(500)
          .json({ error: "Wystąpił błąd podczas pobierania ulubionych butów" });
      });
  },
];

export default getFavoriteShoesByIdHandler;
