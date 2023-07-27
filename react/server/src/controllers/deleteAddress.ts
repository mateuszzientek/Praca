import { Request, Response } from "express";
import Address from "../schemas/address";

const deleteAddressHandler = [
  async (req: Request, res: Response) => {
    const addressId = req.params.addressId;

    try {
      // Use Mongoose to find and delete the address by its ID
      const deletedAddress = await Address.findByIdAndRemove(addressId);

      if (!deletedAddress) {
        // Address with the provided ID not found
        return res.status(404).json({ error: "Address not found" });
      }

      res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to delete address" });
    }
  },
];

export default deleteAddressHandler;
