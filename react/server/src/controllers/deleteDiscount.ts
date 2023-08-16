import { Request, Response } from "express";
import DiscountUser from "../schemas/discountUser";
const { v4: uuidv4 } = require('uuid');

const deleteDiscountHandler = [
    async (req: Request, res:Response) => {
  
        const {userId} = req.body
      
        let sessionId = req.cookies.sessionId;
      
        if (!sessionId) {
          sessionId = uuidv4();
      
          res.cookie("sessionId", sessionId, { httpOnly: true });
         }
      
         try {
          const removedDiscount = userId
          ? await DiscountUser.findOneAndRemove({ userId: userId })
          : await DiscountUser.findOneAndRemove({ sessionId: sessionId})
        
              if (removedDiscount) {
                res.status(200).json({ message: "Rabat został usunięty" });
              } else {
                res.status(404).json({ error: "Nie znaleziono rabatu" });
              }
            } catch (error) {
              console.error("Błąd podczas usuwania rabatu", error);
              res
                .status(500)
                .json({ error: "Wystąpił błąd podczas usuwania rabatu" });
            }
        
      
      } 
];

export default deleteDiscountHandler 
