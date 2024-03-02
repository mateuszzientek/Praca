import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
const validateWithReq = require('../resources/validation'); 
import OrderCustomProject from "../schemas/orderCustomProjects";
import { generateOrderNumberV2 } from "../resources/orderUtils";
import CustomShoeTemporary from "../schemas/customShoeTemporary";

const saveOrderCustomShoeHandler = [
  validateWithReq([
    body("email")
      .notEmpty()
      .withMessage("loginError.emailReq")
      .isEmail()
      .withMessage("loginError.email"),
    body("name")
      .notEmpty()
      .withMessage("Imię jest wymagane")
      .isAlpha()
      .withMessage("Nieprawidłowe imię"),
    body("surname")
      .notEmpty()
      .withMessage("Nazwisko jest wymagane")
      .isAlpha()
      .withMessage("Nieprawidłowe nazwisko"),
    body("street")
      .notEmpty()
      .withMessage("Ulica jest wymagana")
      .matches(/^(?=.*[a-zA-Z]{3,})(?=.*\d).*$/)
      .withMessage(
        "Ulica musi zawierać przynajmniej 3 litery i 1 cyfrę, bez znaków specjalnych."
      ),
    body("city")
      .notEmpty()
      .withMessage("Miasto jest wymagane")
      .matches(/^[a-zA-Z\s]*$/)
      .withMessage("Miasto nie może zawierać znaków specjalnych ani cyfr."),
    body("postalCode")
      .notEmpty()
      .withMessage("Kod pocztowy jest wymagany")
      .matches(/^\d{2}-\d{3}$/)
      .withMessage(
        "Kod pocztowy musi być w formacie XX-XXX, gdzie X to cyfry."
      ),
    body("telephone")
      .notEmpty()
      .withMessage("Numer telefonu jest wymagany")
      .matches(/^[1-9]\d{8}$/)
      .withMessage(
        "Numer telefonu musi składać się z 9 cyfr, nie może zaczynać się od 0."
      ),
  ]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
    const {
        userId,
        paymentMethod,
        deliveryMethod,
        project,
        price,
        email,
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        extra,
        country,
        isTemporaryCustom
      } = req.body;
  
      const address = {
        email,
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        extra,
        country,
      };


      const order = new OrderCustomProject({
        orderNumber: generateOrderNumberV2(),
        userId,
        project,
        address,
        price,
        paymentMethod,
        deliveryMethod,
        orderDate: new Date(),
        status: "submitted",
      });

      await order.save();
   
      if(isTemporaryCustom){
        await CustomShoeTemporary.findOneAndRemove({ userId });
      }
  
      res.status(200).json({ orderNumber: order.orderNumber });
   
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
];

export default saveOrderCustomShoeHandler 

