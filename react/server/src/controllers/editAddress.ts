import { Request, Response } from "express";
import Address from "../schemas/address";


const editAddressHandler = [
    async (req:Request, res:Response) => {
        try {
      
          const { addressId, name, surname, street, city, postalCode, telephone, extra, isDefault } = req.body;
      
      
          const addressToUpdate = await Address.findById(addressId);
      
          if (!addressToUpdate) {
            return res.status(404).json({ error: "Address not found" });
          }
      
          addressToUpdate.name = name;
          addressToUpdate.surname = surname;
          addressToUpdate.street = street;
          addressToUpdate.city = city;
          addressToUpdate.postalCode = postalCode;
          addressToUpdate.telephone = telephone;
          addressToUpdate.extra = extra;
          addressToUpdate.isDefault = isDefault;
      
          await addressToUpdate.save();
      
          res.status(200).json({ message: "Address updated successfully" });
        } catch (error) {
          res.status(500).json({ error: "An error occurred while updating the address" });
        }
      }
];

export default editAddressHandler
