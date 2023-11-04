import { Request, Response } from "express";
import CustomShoeTemporary from "../schemas/customShoeTemporary";


const deleteExpiredCustomDesignHandler = [
    async (req: Request, res: Response) => {
        const currentTime = new Date();
        currentTime.setDate(currentTime.getDate() - 2);
      
        try {
          await CustomShoeTemporary.deleteMany({ expireDate: { $lte: currentTime } });
          res.status(200).send("Pomyślnie usunieto Tymczasowy projekt");
        } catch (error) {
          res.status(400).send("Wystapil blad podczas usuwania projektu");
          console.error("Błąd podczas usuwania dokumentów:", error);
        }
      }
];

export default deleteExpiredCustomDesignHandler