import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import session, { SessionData } from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-node-fs-backend";

import Order from "./schemas/order";
import Shoes from "./schemas/shoes";
import FavoriteShoes from "./schemas/favoriteShoes";
import User, { IUser } from "./schemas/user";
import Address from "./schemas/address";
import Cart from "./schemas/cart";
import Discount from "./schemas/discount";
import DiscountUser from "./schemas/discountUser";
import CustomShoeTemporary from "./schemas/customShoeTemporary";
import DesignProject from "./schemas/designProject";
const path = require("path");

const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

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
import deleteDiscountHandler from "./controllers/deleteDiscount";
import getDiscountHandler from "./controllers/getDiscount";
import saveDiscountHandler from "./controllers/saveDiscount";
import deleteCartHandler from "./controllers/deleteCart";
import updateQuantityCartHandler from "./controllers/updateQuantityCart";
import getShoesCartHandler from "./controllers/getShoesCart";
import getQuantityCartHandler from "./controllers/getQuantityCart";
import addToCartHandler from "./controllers/addToCart";
import changeCartHandler from "./controllers/changeCart";
import saveOrderHandler from "./controllers/saveOrder";
import getOrdersHandler from "./controllers/getOrders";
import getUsersHandler from "./controllers/getUsers";
import deleteUserHandler from "./controllers/deleteUser";
import getOrdersAdminHandler from "./controllers/getOrderAdmin";
import updateStatusHandler from "./controllers/updateStatus";
import saveSpecificProjectHandler from "./controllers/saveSpecificProject";
import deleteProjectHandler from "./controllers/deleteProject";
import getSpecificProjectHandler from "./controllers/getSpecificProject";
import saveDesignProjectHandler from "./controllers/saveDesignProject";
import getProjectsHandler from "./controllers/getProjects";
import deleteExpiredCustomDesignHandler from "./controllers/deleteExpiredCustomDesign";
import saveCustomShoeTemporaryHandler from "./controllers/saveCustomShoeTemporary";
import getCustomShoeTemporaryHandler from "./controllers/getCustomShoeTemporary";
import saveOrderCustomShoeHandler from "./controllers/saveOrderCustomShoe";
import getOrdersCustomShoeHandler from "./controllers/getOrderCustomShoe";

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

app.use(express.static(path.join(__dirname, "client", "build")));
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
    saveUninitialized: true,
    cookie: {
      maxAge: 48 * 60 * 60 * 1000, // 2 dni (48 godzin * 60 minut * 60 sekund * 1000 milisekund)
    },
  })
);

app.use(cookieParser("secret_key"));
app.use(passport.initialize());
app.use(passport.session());
require("./resources/passportConfig")(passport);

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


app.delete("/deleteExpiredCustomDesign", deleteExpiredCustomDesignHandler);
app.delete("/deleteProject/:userId/:projectId",deleteProjectHandler);
app.delete("/deleteUser/:userId", deleteUserHandler);
app.delete("/deleteAddress/:addressId", deleteAddressHandler);
app.delete("/removeFavoriteShoe/:userId/:shoeId", removeFavoriteShoeHandler);

app.get("/getOrderCustomShoe", getOrdersCustomShoeHandler );
app.get("/getCustomShoeTemporary", getCustomShoeTemporaryHandler);
app.get("/getProjects", getProjectsHandler );
app.get("/getSpecificProject", getSpecificProjectHandler );
app.get("/getOrdersAdmin", getOrdersAdminHandler);
app.get("/getOrders", getOrdersHandler);
app.get("/getUsers", getUsersHandler);
app.get("/getQuantityCart", getQuantityCartHandler);
app.get("/getShoesCart", getShoesCartHandler);
app.get("/getDiscount", getDiscountHandler);
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

app.post("/saveOrderCustomShoe", saveOrderCustomShoeHandler);
app.post("/saveCustomShoeTemporary", saveCustomShoeTemporaryHandler);
app.post("/saveDesignProject", saveDesignProjectHandler);
app.post("/saveSpecificProject", saveSpecificProjectHandler);
app.post("/updateStatus", updateStatusHandler);
app.post("/saveOrder", saveOrderHandler);
app.post("/changeCart", changeCartHandler);
app.post("/addToCart", addToCartHandler);
app.post("/updateQuantityCart", updateQuantityCartHandler);
app.post("/deleteCart", deleteCartHandler);
app.post("/saveDiscount", saveDiscountHandler);
app.post("/deleteDiscount", deleteDiscountHandler);
app.post("/changeDefaultAddress", changeDefaultAddressHandler);
app.post("/editAddress", editAddressHandler);
app.post("/saveAddress", saveAddressHandler);
app.post("/uploadImage", uploadImageHandler);
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

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

server.timeout = 60000;
