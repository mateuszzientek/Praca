import { Request, Response } from "express";
import Address from "../schemas/address";

const getAddressesHandler = [
  async (req: Request, res: Response) => {
    const userId = req.query.userId;

    try {
      const addresses = await Address.find({ userId: userId });

      res.status(200).json({ addresses: addresses });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to get addresses" });
    }
  },
];

export default getAddressesHandler;
