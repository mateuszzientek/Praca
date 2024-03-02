import { Request, Response } from "express";
import CustomShoeTemporary from "../schemas/customShoeTemporary";

const saveCustomShoeTemporaryHandler = [
    async (req: Request, res: Response) => {
        const { customContextData, userId } = req.body;
      
        try {
          if (userId) {
            const existingUser = await CustomShoeTemporary.findOne({
              userId: userId,
            });
            if (existingUser) {
              await CustomShoeTemporary.updateOne(
                { userId: userId },
                customContextData
              );
            } else {
              customContextData.userId = userId;
              const customShoeTemporary = new CustomShoeTemporary(customContextData);
              customShoeTemporary.expireDate = new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000
              );
              await customShoeTemporary.save();
            }
          } else {
            res.status(400).send("Wystąpił błąd podczas zapisywania danych w bazie");
          }
      
          const id = userId;
          console.log("Dane zostały zapisane w bazie danych.");
          res.status(200).json({ id: id });
        } catch (error) {
          console.error("Błąd podczas zapisywania danych w bazie", error);
          res.status(500).send("Wystąpił błąd podczas zapisywania danych w bazie");
        }
      }
];

export default saveCustomShoeTemporaryHandler