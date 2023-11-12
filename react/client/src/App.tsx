import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import ButtonToUp from "./components/elements/ButtonToUp";
import axios from "axios";
import Footer from "./components/sections/Footer";
import Home from "./components/pages/Home";
import {
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import storage from "../src/firebase";
import { ThemeContextProvider } from "./components/elements/ThemeContext";
import { UserProvider } from "./components/elements/UserProvider";
import { FilterProvider } from "./components/elements/FilterProvider";
import { LoginProvider } from "./components/elements/LoginProvider";
import { CustomProvider } from "./components/elements/CustomProvider";
import LoadingAnimation from "./components/elements/LoadingAnimation";
import PrivateRoutes from "./PrivateRoutes";
import { CartProvider } from "./components/elements/CartProvider";
import CheckoutRoute from "./CheckoutRoute";
import SubmitOrderRoute from "./SubmitOrderRoute";
import AdminPanelRoute from "./AdminPanelRoute";
const Login = lazy(() => import("./components/pages/Login"));
const PageNotFound = lazy(() => import("./components/pages/PageNotFound"));
const Contact = lazy(() => import("./components/pages/Contact"));
const ResetPassword = lazy(() => import("./components/pages/ResetPassword"));
const Shop = lazy(() => import("./components/pages/Shop"));
const ShoeView = lazy(() => import("./components/pages/ShoeView"));
const Favorite = lazy(() => import("./components/pages/Favorite"));
const Address = lazy(() => import("./components/pages/Address"));
const Cart = lazy(() => import("./components/pages/Cart"));
const Customization = lazy(() => import("./components/pages/Customization"));
const Checkout = lazy(() => import("./components/pages/Checkout"));
const Profile = lazy(() => import("./components/pages/Profile"));
const Design = lazy(() => import("./components/pages/Design"));
const RedirectAfterGoogleLogin = lazy(
  () => import("./components/pages/RedirectAfterGoogleLogin")
);
const SubmitOrder = lazy(() => import("./components/pages/SubmitOrder"));
const Order = lazy(() => import("./components/pages/Order"));
const AdminPanel = lazy(() => import("./components/pages/AdminPanel"));
const MyProjects = lazy(() => import("./components/pages/MyProjects"));


const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Przewiń do góry po zmianie ścieżki
  }, [location.pathname]);

  useEffect(() => {
    // Sprawdzamy, czy bieżąca ścieżka nie jest '/login' ani '/redirectAfterGoogleLogin'
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/redirectAfterGoogleLogin" &&
      !location.pathname.startsWith("/resetPassword/") &&
      location.pathname !== "/submitOrder"
    ) {
      localStorage.setItem("lastVisitedPath", location.pathname);
    }
  }, [location]);

  useEffect(() => {
    axios.delete("/deleteExpiredCustomDesign")
      .then(async (response) => {
        const userIds = response.data.userIds;

        if (userIds.length !== 0) {
          for (const id of userIds) {
            const customImagesFolderRef = ref(storage, `customImages/${id}`);

            if (customImagesFolderRef) {
              const avatarFilesList = await listAll(customImagesFolderRef);

              const deletePromises = avatarFilesList.items
                .filter((item) => {
                  return item.name.startsWith(`left`) || item.name.startsWith(`right`);
                })
                .map((item) => deleteObject(item));

              await Promise.all(deletePromises);
            }
          }
        }
      }).catch((error) => {
        console.log("Błąd podczas usuwania danych w App")
      })
  }, []);

  return (
    <FilterProvider>
      <UserProvider>
        <CustomProvider>
          <ThemeContextProvider>
            <CartProvider>
              <LoginProvider>
                <ButtonToUp />
                <Routes>
                  <Route element={<PrivateRoutes />}>
                    <Route element={<Profile />} path="/profile" />
                    <Route element={<Address />} path="/address" />
                    <Route element={<Order />} path="/order" />
                    <Route element={<MyProjects />} path="/myProjects" />
                    <Route
                      element={<Customization />}
                      path="/customization/:projectName?"
                    />
                  </Route>
                  <Route element={<CheckoutRoute />}>
                    <Route element={<Checkout />} path="/checkout" />
                  </Route>
                  <Route element={<AdminPanelRoute />}>
                    <Route element={<AdminPanel />} path="/adminPanel" />
                  </Route>
                  <Route element={<SubmitOrderRoute />}>
                    <Route element={<SubmitOrder />} path="/submitOrder" />
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
                    path="/redirectAfterGoogleLogin"
                    element={
                      <Suspense fallback={<LoadingAnimation />}>
                        <RedirectAfterGoogleLogin />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/design"
                    element={
                      <Suspense fallback={<LoadingAnimation />}>
                        <Design />
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
                    path="/cart"
                    element={
                      <Suspense fallback={<LoadingAnimation />}>
                        <Cart />
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
                    path="/shop/:pageNumber"
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
                {location.pathname !== "/login" &&
                  location.pathname !== "/redirectAfterGoogleLogin" &&
                  location.pathname !== "*" &&
                  !location.pathname.startsWith("/resetPassword/") && (
                    <Footer />
                  )}
              </LoginProvider>
            </CartProvider>
          </ThemeContextProvider>
        </CustomProvider>
      </UserProvider>
    </FilterProvider>
  );
};

export default App;
