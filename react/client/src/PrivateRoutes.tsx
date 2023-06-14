import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { UserContext } from './components/elements/UserProvider';
import LoadingAnimation from './components/elements/LoadingAnimation';

const PrivateRoutes = () => {
    const { isUserLoggedIn } = useContext(UserContext);

    if (!isUserLoggedIn) {
        window.location.replace("/login");
        return <LoadingAnimation />; // Możesz zwrócić null lub inny komponent ładowania, jeśli chcesz
    }

    return <Outlet />;
};

export default PrivateRoutes;

