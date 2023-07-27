import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-node-fs-backend";
import Shoes from "./schemas/shoes";
import FavoriteShoes from "./schemas/favoriteShoes";
import User, { IUser } from "./schemas/user";
import Address from "./schemas/address";
import Cart from "./schemas/cart";
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');


dotenv.config();

const app = express();
const port = 5000;

const link_database = process.env.DATABASE_LINK;
const secret_key: string | undefined = process.env.SECRET_KEY;
const secret: string | string[] = secret_key || "";

//------------Controllers Imports-----------------------

import emailQuestionHandler from "./controllers/emailQuestion";
import newsletterHandler from "./controllers/newsletter";
import checkExpireTokenHandler from "./controllers/checkExpireToken";
import resetPasswordChangeHandler from "./controllers/resetPasswordChange";
import resetPasswordHandler from "./controllers/resetPassword";
import logoutHandler from "./controllers/logout";
import loginHandler from "./controllers/login";
import registerHandler from "./controllers/register";
import authGoogleCallbackHandler from "./controllers/authGoogleCallback";
import shoesHandler from "./controllers/shoes";
import getShoeByIdHandler from "./controllers/getShoeById";
import saveEditDataHandler from "./controllers/saveEditData";
import getFavoriteShoesByIdHandler from "./controllers/getFavoriteShoesById";
import saveFavoriteShoeHandler from "./controllers/saveFavoriteShoe";
import removeFavoriteShoeHandler from "./controllers/removeFavoriteShoe";
import getFavoriteShoesHandler from "./controllers/getFavoriteShoes";
import editEmailHandler from "./controllers/editEmail";
import editPasswordHandler from "./controllers/editPassword";
import uploadImageHandler from "./controllers/uploadImage";
import saveAddressHandler from "./controllers/saveAddress";
import getAddressesHandler from "./controllers/getAddresses";
import deleteAddressHandler from "./controllers/deleteAddress";
import editAddressHandler from "./controllers/editAddress";
import changeDefaultAddressHandler from "./controllers/changeDefaultAddress";

//-------------i18next----------------------------------

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    supportedLngs: ["en", "pl"],
    fallbackLng: "en",
    detection: {
      order: [
        "localStorage",
        "navigator",
        "querystring",
        "sessionStorage",
        "cookie",
        "path",
        "subdomain",
        "htmlTag",
      ],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "../client/public/assets/locales/{{lng}}/translation.json",
    },
  });

//-------------app use------------------------

app.use(i18nextMiddleware.handle(i18next));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  })
);

const uploadsFolder = "./uploads";
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

// Ustawiamy middleware do obsługi przesyłania plików.
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

app.use(cookieParser("secret_key"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

//------------database----------------

mongoose
  .connect(link_database!)
  .then(() => {
    console.log("Połączono z bazą danych");
  })
  .catch((error: Error) => {
    console.error("Błąd połączenia z bazą danych:", error);
  });

//---------------------routes----------------------------

app.post("/addToCart", async (req, res) => {
  try {
    const { shoeId, selectedSize, quantity, userId } = req.body;

    // Sprawdzamy, czy użytkownik ma już zapisany identyfikator sesji w pliku cookie
    let sessionId = req.cookies.sessionId;

    console.log(sessionId)

    // Jeśli użytkownik nie ma zapisanego identyfikatora sesji, generujemy nowy
    if (!sessionId) {
      sessionId = uuidv4();
      // Zapisujemy identyfikator sesji w pliku cookie na stronie klienta
      res.cookie("sessionId", sessionId, { httpOnly: true });
    }

    const cartData = {
      productId: shoeId,
      sessionId: userId ? null : sessionId,
      quantity: quantity,
      size: selectedSize,
      userId: userId ? userId : null
    };

    const cart = new Cart(cartData);

    await cart.save();

    return res.status(200).json({ message: "Zapisano koszyk" });
  } catch (error) {
    console.error("Błąd podczas zapisywania koszyka", error);
    return res
      .status(500)
      .json({ error: "Wystąpił błąd podczas zapisywania koszyka" });
  }
});

app.delete("/deleteAddress/:addressId", deleteAddressHandler);
app.delete("/removeFavoriteShoe/:userId/:shoeId", removeFavoriteShoeHandler);

app.get("/getAddresses", getAddressesHandler);
app.get("/getFavoriteShoes", getFavoriteShoesHandler);
app.get("/getFavoriteShoesById", getFavoriteShoesByIdHandler);
app.get("/getShoeById", getShoeByIdHandler);
app.get("/shoes", shoesHandler);
app.get(
  "/locales/:lng/translation.json",
  i18nextMiddleware.getResourcesHandler(i18next)
);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get("/auth/google/callback", authGoogleCallbackHandler);
app.get("/user", (req, res) => {
  res.send(req.user);
});

app.post("/changeDefaultAddress",changeDefaultAddressHandler );
app.post("/editAddress", editAddressHandler);
app.post("/saveAddress", saveAddressHandler);
app.post("/uploadImage", upload.single("avatar"), uploadImageHandler);
app.post("/register", registerHandler);
app.post("/login", loginHandler);
app.post("/logout", logoutHandler);
app.post("/resetPassword", resetPasswordHandler);
app.post("/resetPasswordChange", resetPasswordChangeHandler);
app.post("/checkExpireToken", checkExpireTokenHandler);
app.post("/newsletter", newsletterHandler);
app.post("/emailQuestion", emailQuestionHandler);
app.post("/saveEditData", saveEditDataHandler);
app.post("/saveFavoriteShoe", saveFavoriteShoeHandler);
app.post("/editEmail", editEmailHandler);
app.post("/editPassword", editPasswordHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
