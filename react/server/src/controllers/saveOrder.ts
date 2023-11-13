import { Request, Response } from "express";
import Shoes from "../schemas/shoes";
import DiscountUser from "../schemas/discountUser";
import { body, validationResult } from "express-validator";
const validateWithReq = require('../resources/validation'); 
const { v4: uuidv4 } = require("uuid");
import Order from "../schemas/order";
import Cart from "../schemas/cart";
import { generateOrderNumber } from "../resources/orderUtils";

const saveOrderHandler = [
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
        shoes,
        email,
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        extra,
        country,
        paymentMethod,
        deliveryMethod,
        price,
        discount
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

      let sessionId = req.cookies.sessionId;

      if (!sessionId) {
        sessionId = uuidv4();

        res.cookie("sessionId", sessionId, { httpOnly: true });
      }

      for (const shoe of shoes) {
        // Znajdź buta w kolekcji 'shoes' o pasującym ID
        const foundShoe = await Shoes.findOne({ _id: shoe.shoeId });

        if (!foundShoe) {
          return res
            .status(400)
            .json({ error: `Nie znaleziono buta o ID ${shoe.id}` });
        }

        // Znajdź odpowiedni rozmiar buta w kolekcji 'sizes' dla danego buta
        const foundSize = foundShoe.sizes.find(
          (size) => size.size === shoe.size
        );

        if (!foundSize) {
          return res.status(400).json({ error: `Nie znaleziono rozmiaru` });
        }

        // Sprawdź, czy ilość zamawianych butów nie przekracza dostępnej ilości
        if (shoe.quantity > foundSize.quantity) {
          return res.status(200).json({
            outOfStack: `Ilość zamawianych butów przekracza dostępną ilość, lub wybrany przez ciebie but został wyprzedany`,
          });
        }
      }

      const order = new Order({
        orderNumber: generateOrderNumber(),
        userId: userId ? userId : null,
        address,
        products: shoes,
        price,
        paymentMethod,
        deliveryMethod,
        orderDate: new Date(),
        status: "submitted",
        discount: discount ? discount : null
      });

      await order.save();

      for (const shoe of shoes) {
        const foundShoe = await Shoes.findOne({ _id: shoe.shoeId });

        if (!foundShoe) {
          return res.status(400).json({ error: `Nie znaleziono buta ` });
        }

        // Znajdź odpowiedni rozmiar buta w kolekcji 'sizes' dla danego buta
        const foundSize = foundShoe.sizes.find(
          (size) => size.size === shoe.size
        );

        if (!foundSize) {
          return res.status(400).json({ error: `Nie znaleziono rozmiaru` });
        }

        foundSize.quantity -= shoe.quantity;

        await foundShoe.save();
      }

      let discountUser = userId
        ? await DiscountUser.findOneAndRemove({ userId: userId })
        : await DiscountUser.findOneAndRemove({ sessionId: sessionId });

      const removedCart = userId
        ? await Cart.deleteMany({ userId: userId })
        : await Cart.deleteMany({ sessionId: sessionId });

      res.status(200).json({ order: order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
];

export default saveOrderHandler;
