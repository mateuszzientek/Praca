import { Request, Response } from "express";
import OrderCustomProject from "../schemas/orderCustomProjects";

const getOrdersCustomShoeHandler = [
  async (req: Request, res: Response) => {
    console.log("siema")
    const userId = req.query.userId;

    try {
      const orders = await OrderCustomProject.find({ userId: userId });

      res.status(200).json({ orders: orders });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to get shoes" });
    }
  },
];

export default getOrdersCustomShoeHandler
