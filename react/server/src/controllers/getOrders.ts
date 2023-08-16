import { Request, Response } from "express";
import Order from "../schemas/order";
import Shoes from "../schemas/shoes";

const getOrdersHandler = [
  async (req: Request, res: Response) => {
    console.log("siema")
    const userId = req.query.userId;

    try {
      const orders = await Order.find({ userId: userId });

      // Collect all unique shoeIds from products
      const shoeIds = orders.flatMap((order) =>
        order.products.map((product) => product.shoeId)
      );

      // Retrieve shoe objects based on shoeIds
      const shoes = await Shoes.find({ _id: shoeIds });

      console.log(userId)

      res.status(200).json({ orders: orders, shoes: shoes });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to get shoes" });
    }
  },
];

export default getOrdersHandler;
