import { Request, Response } from "express";
import Cart from "../schemas/cart";
import Shoes from "../schemas/shoes";
const { v4: uuidv4 } = require("uuid");

const addToCartHandler = [
  async (req: Request, res: Response) => {
    try {
      const { shoeId, selectedSize, quantity, userId } = req.body;

      let sessionId = req.cookies.sessionId;

      if (!sessionId) {
        sessionId = uuidv4();

        res.cookie("sessionId", sessionId, { httpOnly: true });
      }

      const existingCart = userId
        ? await Cart.findOne({
            userId: userId,
            productId: shoeId,
            size: selectedSize,
          }).exec()
        : await Cart.findOne({
            sessionId: sessionId,
            productId: shoeId,
            size: selectedSize,
          }).exec();

      if (existingCart) {
        const shoe = await Shoes.findOne({ _id: shoeId }).exec();

        if (shoe) {
          const selectedSizeInfo = shoe.sizes.find(
            (sizeInfo) => sizeInfo.size === selectedSize
          );

          if (!selectedSizeInfo) {
            return res
              .status(400)
              .json({
                message: "Wybrany rozmiar nie jest dostępny dla tego produktu.",
              });
          }

          if (selectedSizeInfo.quantity <= existingCart.quantity) {
            return res
              .status(200)
              .json({
                limit:
                  "Maksymalna ilość dla tego rozmiaru w koszyku została osiągnięta.",
              });
          }

          existingCart.quantity += quantity;
          await existingCart.save();
        }
      } else {
        const cartData = {
          sessionId: userId ? null : sessionId,
          userId: userId ? userId : null,
          expireDate: userId
            ? null
            : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          productId: shoeId,
          size: selectedSize,
          quantity: quantity,
        };

        const cart = new Cart(cartData);
        await cart.save();
      }

      return res.status(200).json({ message: "Zapisano koszyk" });
    } catch (error) {
      console.error("Błąd podczas zapisywania koszyka", error);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd podczas zapisywania koszyka" });
    }
  },
];

export default addToCartHandler;
