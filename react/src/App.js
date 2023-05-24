import React, { lazy, Suspense } from "react";
import Home from "./components/pages/Home";
import { Route, Routes } from "react-router-dom";
import { ThemeContextProvider } from "./components/elements/ThemeContext";
import LoadingAnimation from "./components/elements/LoadingAnimation";
const Contact = lazy(() => import("./components/pages/Contact"));

function App() {
  return (
    <ThemeContextProvider>
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
            <Suspense fallback="Loading...">
              <Home />
            </Suspense>
          }
        />
      </Routes>
    </ThemeContextProvider>
  );
}

export default App;
