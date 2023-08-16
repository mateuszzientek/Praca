import React, { useContext, Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CartContext } from './components/elements/CartProvider';
import LoadingAnimation from './components/elements/LoadingAnimation';

const CheckoutRoute = () => {

    const { quantityCart, isDataLoaded } = useContext(CartContext);


    if (quantityCart <= 0) {
        window.location.replace("/cart");
        return <LoadingAnimation />;
    }

    return (
        <Suspense fallback={<LoadingAnimation />}>
            <Outlet />
        </Suspense>
    );
};

export default CheckoutRoute;