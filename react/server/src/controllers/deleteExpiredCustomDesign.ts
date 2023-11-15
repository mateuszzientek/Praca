import { Request, Response } from "express";
import CustomShoeTemporary from "../schemas/customShoeTemporary";

const deleteExpiredCustomDesignHandler = [
    async (req: Request, res: Response) => {
        const currentTime = new Date();
      
        try {
          const documents =  await CustomShoeTemporary.find({ expireDate: { $lte: currentTime } });

          const userIds = documents.map(doc => doc.userId)

          await CustomShoeTemporary.deleteMany({ expireDate: { $lte: currentTime } });
          res.status(200).send({userIds: userIds});
        } catch (error) {
          res.status(400).send("Wystapil blad podczas usuwania projektu");
          console.error("Błąd podczas usuwania dokumentów:", error);
        }
      }
];

export default deleteExpiredCustomDesignHandler