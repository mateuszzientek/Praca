import { Request, Response } from "express";
import User from "../schemas/user";

const getUsersHandler = [
    async (req:Request, res:Response) => {
        const page = parseInt(req.query.page as string);
        const pageSize = parseInt(req.query.limit as string || '11');
        
        try {
          const query = User.find().lean();
      
          const total = await User.countDocuments(query);
      
          if (total === 0) { // Sprawdź, czy jest równa 0, aby poprawnie obsłużyć brak użytkowników
            res.status(404).json({ error: "Nie znaleziono użytkowników" });
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
              users: result,
            });
          }
        } catch (error) {
          console.error("Błąd podczas pobierania użytkowników", error);
          res.status(500).json({ error: "Wystąpił błąd podczas pobierania użytkowników" });
        }
      }
];

export default getUsersHandler
