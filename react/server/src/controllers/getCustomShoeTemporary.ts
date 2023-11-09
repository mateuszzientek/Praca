import { Request, Response } from "express";
import CustomShoeTemporary from "../schemas/customShoeTemporary";

const getCustomShoeTemporaryHandler = [
  async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId;

      if (!userId) {
        res.status(400).json({ error: "User ID is missing" });
      }

      const userDocument = await CustomShoeTemporary.findOne({ userId });

      if (userDocument) {
        // Jeśli dokument istnieje po userId, zwróć go
        return res.status(200).json({ userDocument: userDocument });
      }
    } catch (error) {
      console.error("Błąd podczas pobierania danych z bazy", error);
      res.status(500).send("Wystąpił błąd podczas pobierania danych z bazy");
    }
  },
];

export default getCustomShoeTemporaryHandler;
