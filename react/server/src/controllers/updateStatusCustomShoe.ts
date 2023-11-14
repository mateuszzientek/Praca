import { Request, Response } from "express";
import OrderCustomProject from "../schemas/orderCustomProjects";

const  updateStatusCustomShoeHandler = [
    async (req:Request, res:Response) => {
      
        const {status, orderNumber} =req.body
          
        try {
             const order= await OrderCustomProject.findOne({ orderNumber: orderNumber});
      
             if(!order){
              res.status(500).json({ error: "Błąd podczas wyszukiwania zamówienia" })
             }else{
                order.status = status
                await order.save();
                res.status(200).json({ message: "Status zapisany" });
             }
            } catch (error) {
              console.error("Błąd podczas updatowania statusu", error);
              res.status(500).json({ error: "Błąd podczas updatowania statusu" })
            }
      }
];

export default updateStatusCustomShoeHandler
