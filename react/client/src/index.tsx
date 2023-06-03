import React from "react";
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

import App from "./App";
import "./index.css";

(i18n as any)
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
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
      loadPath: "/assets/locales/{{lng}}/translation.json",
    },
  });

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);