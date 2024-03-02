import { Request, Response } from "express";
const { v4: uuidv4 } = require('uuid');
import Cart from "../schemas/cart";

const deleteCartHandler = [
    async (req:Request, res:Response) => {
  
        const {userId, cartId} = req.body
      
        let sessionId = req.cookies.sessionId;
      
        if (!sessionId) {
          sessionId = uuidv4();
      
          res.cookie("sessionId", sessionId, { httpOnly: true });
         }
      
        try {
        const removedCart = userId
        ? await Cart.findOneAndRemove({ userId: userId, _id: cartId })
        : await Cart.findOneAndRemove({ sessionId: sessionId, _id: cartId})
      
            if (removedCart) {
              res.status(200).json({ message: "Koszyk został usunięty" });
            } else {
              res.status(404).json({ error: "Nie znaleziono koszyka" });
            }
          } catch (error) {
            console.error("Błąd podczas usuwania buta z ulubionych", error);
            res
              .status(500)
              .json({ error: "Wystąpił błąd podczas usuwania buta z ulubionych" });
          }
      
      }
];

export default deleteCartHandler
