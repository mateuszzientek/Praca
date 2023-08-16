import { Request, Response } from "express";
import Cart from "../schemas/cart";
const { v4: uuidv4 } = require("uuid");

const changeCartHandler = [
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      console.log("user" + userId);
      let sessionId = req.cookies.sessionId;

      if (!sessionId) {
        sessionId = uuidv4();
        res.cookie("sessionId", sessionId, { httpOnly: true });
      }

      // Step 1: Find and delete all cart documents for the given userId
      await Cart.deleteMany({ userId: userId });

      // Step 2: Find all documents with matching sessionId
      const carts = await Cart.find({ sessionId: sessionId });

      // Step 3: Update and save each document with userId and nullify sessionId and expiredate
      const updatePromises = carts.map(async (cart) => {
        cart.userId = userId;
        cart.sessionId = null;
        cart.expireDate = null;
        await cart.save();
      });

      await Promise.all(updatePromises);

      res.status(200).json({ message: "Cart updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
];

export default changeCartHandler;
