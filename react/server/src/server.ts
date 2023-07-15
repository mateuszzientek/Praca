import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import i18next from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-node-fs-backend";
import Shoes from "./schemas/shoes";
import FavoriteShoes from "./schemas/favoriteShoes";
dotenv.config();

const app = express();
const port = 5000;

const link_database = process.env.DATABASE_LINK;
const secret_key: string | undefined = process.env.SECRET_KEY;
const secret: string | string[] = secret_key || '';


//------------Controllers Imports-----------------------

import emailQuestionHandler from './controllers/emailQuestion';
import newsletterHandler from './controllers/newsletter';
import checkExpireTokenHandler from './controllers/checkExpireToken';
import resetPasswordChangeHandler from './controllers/resetPasswordChange';
import resetPasswordHandler from './controllers/resetPassword';
import logoutHandler from './controllers/logout';
import loginHandler from './controllers/login';
import registerHandler from './controllers/register';
import authGoogleCallbackHandler from './controllers/authGoogleCallback';
import shoesHandler from "./controllers/shoes";
import getShoeByIdHandler from "./controllers/getShoeById";

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

app.use(cookieParser("secret_key"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

//------------database----------------

mongoose.connect(link_database!)
  .then(() => {
    console.log("Połączono z bazą danych");
  })
  .catch((error: Error) => {
    console.error("Błąd połączenia z bazą danych:", error);
});




//---------------------routes----------------------------

app.get('/getFavoriteShoesById',(req, res) => {
  
  const userId = req.query.userId;

  FavoriteShoes.find({ userId })
  .then((favoriteShoes) => {
    const shoeIds = favoriteShoes.map((favoriteShoe) => favoriteShoe.shoeId);

    console.log(shoeIds);
    res.json(shoeIds);
  })
  .catch((error) => {
    console.error('Błąd podczas pobierania ulubionych butów', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania ulubionych butów' });
  });
});

app.get('/getShoeById', getShoeByIdHandler);
app.get('/shoes',shoesHandler)
app.get("/locales/:lng/translation.json",i18nextMiddleware.getResourcesHandler(i18next));
app.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback",authGoogleCallbackHandler);
app.get("/user", (req, res) => { res.send(req.user);});
app.post( "/register",registerHandler);
app.post("/login",loginHandler);
app.post("/logout", logoutHandler);
app.post( "/resetPassword",resetPasswordHandler);
app.post( "/resetPasswordChange",resetPasswordChangeHandler);
app.post("/checkExpireToken", checkExpireTokenHandler);
app.post( "/newsletter",newsletterHandler);
app.post("/emailQuestion", emailQuestionHandler);

app.post('/saveFavoriteShoe', async (req, res) => {
  try {
    const { userId, shoeId } = req.body;

    const favoriteShoe = new FavoriteShoes({
      userId,
      shoeId,
    });

    await favoriteShoe.save();

    return res.status(200).json({ message: 'But został pomyślnie dodany do ulubionych' });
  } catch (error) {
    console.error('Błąd podczas zapisywania ulubionego buta', error);
    return res.status(500).json({ error: 'Wystąpił błąd podczas zapisywania ulubionego buta' });
  }
});

app.post('/removeFavoriteShoe', async (req, res) => {
  const { userId, shoeId } = req.body;

  try {
    const removedShoe = await FavoriteShoes.findOneAndRemove({ userId, shoeId });
    if (removedShoe) {
      res.status(200).json({ message: 'But został usunięty z ulubionych' });
    } else {
      res.status(404).json({ message: 'Nie znaleziono buta w ulubionych' });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania buta z ulubionych', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas usuwania buta z ulubionych' });
  }
});


app.get('/getFavoriteShoes', async (req, res) => {
  const { userId } = req.query;

  try {
    const favoriteShoes = await FavoriteShoes.find({ userId });
    const favoriteShoeIds = favoriteShoes.map(favoriteShoe => favoriteShoe.shoeId);

    const shoes = await Shoes.find({ _id: { $in: favoriteShoeIds } });
    
    res.status(200).json({ favoriteShoes: shoes });
  } catch (error) {
    console.error('Błąd podczas pobierania ulubionych butów', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania ulubionych butów' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
