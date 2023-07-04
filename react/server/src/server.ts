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
import Shoes from './schemas/shoes';
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
app.get('/shoes', async (req, res) => {
  Shoes.find({})
  .then((shoes) => {
    console.log(shoes); 
    res.send(shoes);
  })
  .catch((error) => {
    console.error("Błąd podczas pobierania danych z kolekcji 'shoes':", error);
    res.status(400).json({ error: 'Wystąpił błąd' });
  });
})

app.get("/locales/:lng/translation.json",i18nextMiddleware.getResourcesHandler(i18next));
app.post( "/register",registerHandler);
app.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback",authGoogleCallbackHandler);
app.post("/login",loginHandler);
app.get("/user", (req, res) => { res.send(req.user);});
app.post("/logout", logoutHandler);
app.post( "/resetPassword",resetPasswordHandler);
app.post( "/resetPasswordChange",resetPasswordChangeHandler);
app.post("/checkExpireToken", checkExpireTokenHandler);
app.post( "/newsletter",newsletterHandler);
app.post("/emailQuestion", emailQuestionHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
