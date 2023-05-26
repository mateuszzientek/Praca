import React, { lazy, Suspense } from "react";
import Home from "./components/pages/Home";
import { Route, Routes } from "react-router-dom";
import ButtonToUp from "./components/elements/ButtonToUp";
import { ThemeContextProvider } from "./components/elements/ThemeContext";
import LoadingAnimation from "./components/elements/LoadingAnimation";
const PageNotFound = lazy(() => import("./components/pages/PageNotFound"));
const Contact = lazy(() => import("./components/pages/Contact"));

function App() {
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
            <Suspense>
              <PageNotFound />
            </Suspense>
          }
        />
      </Routes>
    </ThemeContextProvider>
  );
}

export default App;
