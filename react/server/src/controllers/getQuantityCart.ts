import { Request, Response } from "express";
import Cart from "../schemas/cart";

const getQuantityCartHandler = [
    async (req: Request, res: Response) => {
        const userId = req.query.userId;
        const sessionId = req.cookies.sessionId;
      
        try {
          let filter = {};
          if (userId) {
            filter = { userId: userId };
          } else if (sessionId) {
            filter = { sessionId: sessionId };
          } else {
            // If neither userId nor sessionId is provided, return an empty array
            return res.json({ itemCount: 0 });
          }
      
          const currentTimestamp = new Date().getTime();
       
          await Cart.deleteMany({ expireDate: { $lte: currentTimestamp } });
      
          // Find all cart items matching the filter
           const cartItems = await Cart.find(filter).lean();
      
           //Count occurrences of productId in the products array
           let itemCount = cartItems.length
      
          // Send the response with the item count
          res.json({ itemCount });
        } catch (error) {
          console.error('Error fetching cart items:', error);
          res.status(500).json({ error: 'Something went wrong' });
        }
      }
];

export default getQuantityCartHandler