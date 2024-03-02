import { Request, Response } from "express";
import OrderCustomProject from "../schemas/orderCustomProjects";

const getOrdersCustomShoeAdminHandler = [
    async (req:Request, res:Response) => {
        const page = parseInt(req.query.page as string);
        const pageSize = parseInt(req.query.limit as string || '3');
        const sort= req.query.sort as string
      
        try {
          
          let query = OrderCustomProject.find().lean()
          query = query.sort({ _id: -1 });
      
          if (sort && sort !== "all") {
            query = query.where('status').equals(sort);
          }
      
          const total = await OrderCustomProject.countDocuments(query);
      
          if (total === 0) { 
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
      
    
          res.status(200).json({
            status: 'success',
            count: result.length,
            page: correctedPage,
            pages,
            orders: result,
          });
          }
          
        } catch (error) {
          console.error("Błąd podczas pobierania zamówien", error);
          res.status(500).json({ error: "Wystąpił błąd podczas pobierania zamówien" });
        }
      }
];

export default getOrdersCustomShoeAdminHandler
