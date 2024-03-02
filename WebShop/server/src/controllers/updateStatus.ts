import { Request, Response } from "express";
import Order from "../schemas/order";

const updateStatusHandler = [
    async (req:Request, res:Response) => {
      
        const {status, orderId} =req.body
          
        try {
             const order= await Order.findOne({ _id: orderId});
      
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

export default updateStatusHandler
