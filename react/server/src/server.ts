import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import session, {SessionData} from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
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
      maxAge: 48 * 60 * 60 * 1000, // 2 dni (48 godzin * 60 minut * 60 sekund * 1000 milisekund)
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
app.get("/getProjects", async (req, res) => {
  const userId = req.query.userId;

  try{
     if(!userId){
      res.status(400).json({error: "User ID is missing"})
     }

     const projects = await DesignProject.findOne({ userId: userId })

     res.status(200).json({ projects: projects });

  }catch (error){
    console.error("Error while saving project", error);
    return res.status(500).json({ error: "An error occurred while saving the project" });
  }

});


app.post("/saveDesignProject", async (req, res) => {
  const { customContextData, userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Tworzymy nowy projekt na podstawie danych z żądania
    const newProject = {
      designName: customContextData.designName,
      selectedColors: customContextData.selectedColors,
      selectedColorsText: customContextData.selectedColorsText,
      selectedPatches: customContextData.selectedPatches,
      swooshVisibility: customContextData.swooshVisibility,
      sideText: customContextData.sideText,
    };

    // Wyszukujemy dokument `DesignProject` dla danego użytkownika
    const existingProject = await DesignProject.findOne({ userId });

    if (existingProject) {
      // Dodaj nowy projekt do tablicy projektów użytkownika
      existingProject.projects.push(newProject);
      await existingProject.save();
    } else {
      // Jeśli użytkownik nie ma jeszcze żadnych projektów, utwórz nowy dokument `DesignProject`
      const newDesignProject = new DesignProject({
        userId,
        projects: [newProject],
      });
      await newDesignProject.save();
    }

    await CustomShoeTemporary.findOneAndRemove({ userId });

    return res.status(200).json({ message: "Project saved successfully" });
  } catch (error) {
    console.error("Error while saving project", error);
    return res.status(500).json({ error: "An error occurred while saving the project" });
  }
});


app.delete("/deleteExpiredCustomDesign", async (req,res) =>{
  
  const currentTime = new Date();
  currentTime.setDate(currentTime.getDate() - 2); 

  try {
    await CustomShoeTemporary.deleteMany({ expireDate: { $lte: currentTime } });
  } catch (error) {
    console.error('Błąd podczas usuwania dokumentów:', error);
  }
})

app.post("/saveCustomShoeTemporary", async (req, res) => {
  const { customContextData, userId } = req.body

  try {
    if (userId) {
      const existingUser = await CustomShoeTemporary.findOne({ userId: userId });
      if (existingUser) {
        await CustomShoeTemporary.updateOne({ userId: userId }, customContextData);
      } else{
        customContextData.userId = userId;
        const customShoeTemporary = new CustomShoeTemporary(customContextData);
        customShoeTemporary.expireDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); 
     await customShoeTemporary.save();
      }
    } else{
      res.status(400).send("Wystąpił błąd podczas zapisywania danych w bazie");
    }

    const id = userId 
    console.log("Dane zostały zapisane w bazie danych.");
    res.status(200).json({ id: id });
  } catch (error) {
    console.error("Błąd podczas zapisywania danych w bazie", error);
    res.status(500).send("Wystąpił błąd podczas zapisywania danych w bazie");
  }
});


app.get("/getCustomShoeTemporary", async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (userId) {
      // Sprawdź, czy istnieje dokument o danym userId
      const userDocument = await CustomShoeTemporary.findOne({ userId });

      if (userDocument) {
        // Jeśli dokument istnieje po userId, zwróć go
        return res.status(200).json({ userDocument: userDocument })
      }
    }
  } catch (error) {
    console.error("Błąd podczas pobierania danych z bazy", error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych z bazy");
  }
});

app.delete("/deleteUser/:userId", deleteUserHandler);
app.delete("/deleteAddress/:addressId", deleteAddressHandler);
app.delete("/removeFavoriteShoe/:userId/:shoeId", removeFavoriteShoeHandler);

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
