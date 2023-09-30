import { Request, Response } from "express";
import Order from "../schemas/order";
import Shoes from "../schemas/shoes";

const getOrdersAdminHandler = [
    async (req:Request, res:Response) => {
        const page = parseInt(req.query.page as string);
        const pageSize = parseInt(req.query.limit as string || '3');
        const sort= req.query.sort as string
      
        try {
          
          let query = Order.find().lean()
      
          if (sort && sort !== "all") {
            query = query.where('status').equals(sort);
          }
      
          const total = await Order.countDocuments(query);
      
          if (total === 0) { // Sprawdź, czy jest równa 0, aby poprawnie obsłużyć brak użytkowników
            res.status(200).json({ orders: [] });
          } else {
            
            const pages = Math.ceil(total / pageSize);
      
            let correctedPage = page;
            if (page > pages) {
              correctedPage = pages;
            }
        
            const result = await query
              .skip((correctedPage - 1) * pageSize)
              .limit(pageSize)
              .exec(); // Dodaj .exec() aby wykonać zapytanie
      
      
            const shoeIds = result.flatMap((order) =>
            order.products.map((product) => product.shoeId)
          );
      
          // Retrieve shoe objects based on shoeIds
          const shoes = await Shoes.find({ _id: shoeIds });
      
          res.status(200).json({
            status: 'success',
            count: result.length,
            page: correctedPage,
            pages,
            orders: result,
            shoes:shoes
          });
          }
          
        } catch (error) {
          console.error("Błąd podczas pobierania zamówien", error);
          res.status(500).json({ error: "Wystąpił błąd podczas pobierania zamówien" });
        }
      }
];

export default getOrdersAdminHandler
