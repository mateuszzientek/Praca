import { Request, Response } from "express";
import User from "../schemas/user";

const deleteUserHandler = [
    async (req:Request, res:Response) => {
  
        const userId = req.params.userId;
        
        try {
          await User.findOneAndRemove({ _id: userId});
         
          res.status(200).json({ message: "Usuniete uzytkownika" });
        } catch (error) {
          console.error("Błąd podczas usuwania użytkowników", error);
          res.status(500).json({ error: "Błąd podczas usuwania użytkowników" });
        }
      }
];

export default deleteUserHandler
