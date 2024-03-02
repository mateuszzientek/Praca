import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingAnimation from "../components/elements/LoadingAnimation";

const SubmitOrderRoute = () => {
  const lastVisitedPath = localStorage.getItem("lastVisitedPath");

  if (lastVisitedPath !== "/checkout") {
    window.location.replace("/");
    return <LoadingAnimation />;
  }

  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Outlet />
    </Suspense>
  );
};

export default SubmitOrderRoute;
