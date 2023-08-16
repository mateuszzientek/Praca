import { Request, Response } from "express";
const { v4: uuidv4 } = require('uuid');
import Cart from "../schemas/cart";

const updateQuantityCartHandler = [
    async (req:Request, res:Response) => {
  
        try {
          const { shoeId, size, quantity, userId} = req.body
      
          let sessionId = req.cookies.sessionId;
      
         if (!sessionId) {
           sessionId = uuidv4();
      
           res.cookie("sessionId", sessionId, { httpOnly: true });
          }
      
          const existingCart = userId
            ? await Cart.findOne({ userId: userId, productId: shoeId, size:size }).exec()
            : await Cart.findOne({ sessionId: sessionId, productId: shoeId, size:size }).exec();
      
          if (existingCart) {
             
           existingCart.quantity = quantity
           await existingCart.save();
      
          }else{
            return res.status(400).json({ error: "Nie znaleziono produktu" });
          }
           
          return res.status(200).json({ message: "Zapisano quantity" });
        } catch (error) {
          console.error("Błąd podczas zapisywania koszyka", error);
          return res
            .status(500)
            .json({ error: "Wystąpił błąd podczas zapisywania koszyka" });
        }
      
      }
];

export default updateQuantityCartHandler
