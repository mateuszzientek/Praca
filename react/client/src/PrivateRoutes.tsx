import React, { useContext, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { UserContext } from './components/elements/UserProvider';
import LoadingAnimation from './components/elements/LoadingAnimation';

const PrivateRoutes = () => {
    const { isUserLoggedIn } = useContext(UserContext);

    if (!isUserLoggedIn) {
        window.location.replace("/login");
        return <LoadingAnimation />;
    }

    return (
        <Suspense fallback={<LoadingAnimation />}>
            <Outlet />
        </Suspense>
    );
};

export default PrivateRoutes;
