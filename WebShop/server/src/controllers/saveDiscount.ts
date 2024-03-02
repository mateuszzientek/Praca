import { Request, Response } from "express";
import DiscountUser from "../schemas/discountUser";
const { v4: uuidv4 } = require('uuid');
import Discount from "../schemas/discount";

const saveDiscountHandler = [
    async (req:Request, res:Response) => {
  
        const {userId, discountName} = req.body
      
        let sessionId = req.cookies.sessionId;
      
        if (!sessionId) {
          sessionId = uuidv4();
      
          res.cookie("sessionId", sessionId, { httpOnly: true });
         }
      
         try {
          const discount = await Discount.findOne({ discountName });
      
          // Jeżeli znaleziono discount, to zwracamy jego discountAmount
          if (discount) {
            
            let discountUser = userId
            ? await DiscountUser.findOne({ userId: userId })
            : await DiscountUser.findOne({ sessionId: sessionId})
      
            if (discountUser) {
              discountUser.discountId = discount._id;
              discountUser.expireDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            } else {
              // Jeżeli nie istnieje, to tworzymy nowy dokument
              discountUser = new DiscountUser({
                discountId: discount._id,
                sessionId: userId ? null : sessionId,
                userId: userId ? userId : null,
                expireDate: userId ? null : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
              });
            }
        
            // Zapisujemy lub aktualizujemy dokument DiscountUser
            await discountUser.save();
            res.status(200).json({ discountAmount: discount.discountAmount, discountName: discount.discountName });
          } else {
            // Jeżeli nie znaleziono discount, to zwracamy odpowiedź "Nie znaleziono"
            res.status(200).json({ message: "Nie znaleziono" });
          }
        } catch (error) {
          console.error("Błąd podczas szukania kodu rabatowego", error);
          res.status(500).json({ error: "Wystąpił błąd podczas szukania kodu rabatowego" });
        }
      
      } 
];

export default saveDiscountHandler
