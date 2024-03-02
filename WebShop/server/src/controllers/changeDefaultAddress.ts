import { Request, Response } from "express";
import Address from "../schemas/address";

const changeDefaultAddressHandler = [
    async (req:Request, res:Response) => {
        const addressId = req.body.addressId;
        const userId = req.body.userId;
      
        try {
         
          await Address.updateMany({ userId }, { $set: { isDefault: false } });
      
          await Address.findOneAndUpdate({ _id: addressId}, { $set: { isDefault: true } });
      
          res.status(200).json({ success: true, message: "Default address changed successfully." });
        } catch (err) {
          res.status(500).json({ success: false, error: "An error occurred while changing the default address." });
        }
      }
];

export default changeDefaultAddressHandler
