import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ButtonToUp from "./components/elements/ButtonToUp";
import Footer from "./components/sections/Footer";
import Home from "./components/pages/Home";
import { ThemeContextProvider } from "./components/elements/ThemeContext";
import LoadingAnimation from "./components/elements/LoadingAnimation";
const PageNotFound = lazy(() => import("./components/pages/PageNotFound"));
const Contact = lazy(() => import("./components/pages/Contact"));

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <ButtonToUp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<LoadingAnimation />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingAnimation />}>
              <PageNotFound />
            </Suspense>
          }
        />
      </Routes>
      <Footer />
    </ThemeContextProvider>
  );
};

export default App;