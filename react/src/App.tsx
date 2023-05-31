import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ButtonToUp from "./components/elements/ButtonToUp";
import Footer from "./components/sections/Footer";
import Home from "./components/pages/Home";
import { ThemeContextProvider } from "./components/elements/ThemeContext";
import LoadingAnimation from "./components/elements/LoadingAnimation";
const Login = lazy(() => import("./components/pages/Login"))
const PageNotFound = lazy(() => import("./components/pages/PageNotFound"));
const Contact = lazy(() => import("./components/pages/Contact"));

const App: React.FC = () => {
  const location = useLocation();

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
          path="/login"
          element={
            <Suspense fallback={<LoadingAnimation />}>
              <Login />
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
      {location.pathname !== "/login" && <Footer />}
    </ThemeContextProvider>
  );
};

export default App;