import { Request, Response } from "express";
import Address from "../schemas/address";
import { body, validationResult } from "express-validator";
const validateWithReq = require('../resources/validation'); 

const saveAddressHandler = [
  validateWithReq([
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
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        country,
        extra,
      } = req.body;

      await Address.updateMany({ userId }, { $set: { isDefault: false } });

      const isAddressExist = await Address.exists({
        userId,
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        country
     });
          
        if (isAddressExist) {
              return res.status(200).json({ exist: "Address already exists" });
        }
        

      const address = new Address({
        userId,
        name,
        surname,
        street,
        city,
        postalCode,
        telephone,
        country,
        isDefault: true,
      });

      // If 'extra' is provided in the request, set it in the address document
      if (extra) {
        address.extra = extra;
      }

      // Save the address to the database
      const savedAddress = await address.save();

      // Respond with a success message or relevant data if needed
      res
        .status(200)
        .json({ message: "Address saved successfully", address: savedAddress });
    } catch (err) {
      // Handle errors
      res.status(500).json({ error: "Failed to save address" });
    }
  },
];

export default saveAddressHandler;
