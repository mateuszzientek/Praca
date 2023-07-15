import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ButtonToUp from "./components/elements/ButtonToUp";
import Footer from "./components/sections/Footer";
import Home from "./components/pages/Home";
import { ThemeContextProvider } from "./components/elements/ThemeContext";
import { UserProvider } from "./components/elements/UserProvider";
import { FilterProvider } from "./components/elements/FilterProvider";
import { LoginProvider } from "./components/elements/LoginProvider";
import LoadingAnimation from "./components/elements/LoadingAnimation";
import PrivateRoutes from "./PrivateRoutes";
import Profile from "./components/pages/Profile";
const Login = lazy(() => import("./components/pages/Login"))
const PageNotFound = lazy(() => import("./components/pages/PageNotFound"));
const Contact = lazy(() => import("./components/pages/Contact"));
const ResetPassword = lazy(() => import('./components/pages/ResetPassword'))
const Shop = lazy(() => import('./components/pages/Shop'))
const ShoeView = lazy(() => import('./components/pages/ShoeView'))
const Favorite = lazy(() => import('./components/pages/Favorite'))


const App: React.FC = () => {
  const location = useLocation();

  return (
    <FilterProvider >
      <UserProvider>
        <ThemeContextProvider>
          <LoginProvider>
            <ButtonToUp />
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route element={<Profile />} path="/profile" />
              </Route>
              <Route path="/" element={<Home />} />
              <Route
                path="/favorite"
                element={
                  <Suspense fallback={<LoadingAnimation />}>
                    <Favorite />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<LoadingAnimation />}>
                    <Contact />
                  </Suspense>
                }
              />
              <Route
                path="/shop"
                element={
                  <Suspense fallback={<LoadingAnimation />}>
                    <Shop />
                  </Suspense>
                }
              />
              <Route
                path="/shop/:pageNumber/:brand?/:category?/:price?/:min?/:max?/:sizes?/:sort?"
                element={
                  <Suspense fallback={<LoadingAnimation />}>
                    <Shop />
                  </Suspense>
                }
              />
              <Route
                path="/shoeView/:id"
                element={
                  <Suspense fallback={<LoadingAnimation />}>
                    <ShoeView />
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
                path="/resetPassword/:token"
                element={
                  <Suspense fallback={<LoadingAnimation />}>
                    <ResetPassword />
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
            {location.pathname !== "/login" && location.pathname !== "*" && !location.pathname.startsWith("/resetPassword/") && <Footer />}
          </LoginProvider>
        </ThemeContextProvider>
      </UserProvider >
    </FilterProvider>
  );
};

export default App;