import { Request, Response} from 'express';
import Shoes from "../schemas/shoes";

const getShoeByIdHandler = [
    (req: Request, res:Response) => {
        const id = req.query.id as string;

        Shoes.findOne({ _id: id })
          .then((shoe) => {
            if (shoe) {
              console.log("Znaleziono but");
              res.send(shoe); 
            } else {
              console.log("Nie znaleziono buta");
              return res.status(400).json({
                error: "Nie znaleziono buta",
              });
            }
          })
          .catch((error: Error) => {
            console.error("Błąd:", error);
            return res.status(500).json({
              error: "Wystąpił błąd",
            });
          });
  }
]

export default getShoeByIdHandler