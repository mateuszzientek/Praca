import { Request, Response } from "express";
import Cart from "../schemas/cart";
import Shoes from "../schemas/shoes";

const getShoesCartHandler = [
    async (req:Request, res:Response) => {
        const userId = req.query.userId;
        const sessionId = req.cookies.sessionId;
      
        try {
          let cartItems
          if (userId) {
            cartItems = await Cart.find({ userId: userId });
          } else if (sessionId) {
            cartItems = await Cart.find({ sessionId: sessionId });
          } else {
            // Jeśli nie został podany ani userId, ani sessionId, zwróć pustą tablicę
            return res.json({ shoesWithCartSizes: [] });
          }
      
          // Znajdź wszystkie productIds z koszyka, aby później znaleźć buty z kolekcji 'Shoes'
          const productIds = cartItems.map(item => item.productId);
      
          console.log(productIds)
          // Znajdź buty z kolekcji 'Shoes', które mają pasujące productIds
          const shoes = await Shoes.find({ _id: { $in: productIds } });
      
          console.log(shoes)
      
          // Zestawienie butów z odpowiednimi rozmiarami i ilościami z koszyka
          const shoesWithCartSizes = cartItems.map(cartItem => {
            const matchingShoe = shoes.find(shoe => shoe._id.toString() === cartItem.productId.toString());
            return {
              _id: cartItem._id,
              shoe: matchingShoe, // Zawiera cały obiekt z 'shoes' na podstawie 'productId'
              size: cartItem.size,
              quantity: cartItem.quantity
            };
          });
      
          console.log(shoesWithCartSizes)
      
          res.status(200).json({ shoesWithCartSizes: shoesWithCartSizes });
        } catch (error) {
          console.error('Błąd podczas pobierania przedmiotów z koszyka:', error);
          res.status(500).json({ error: 'Coś poszło nie tak' });
        }
      }
];

export default getShoesCartHandler
