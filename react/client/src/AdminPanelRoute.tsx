import React, { useContext, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { UserContext } from './components/elements/UserProvider';
import LoadingAnimation from './components/elements/LoadingAnimation';

const AdminPanelRoute = () => {

    const { user, isUserLoggedIn } = useContext(UserContext);


    if (!isUserLoggedIn || user?.role === "admin") {
        window.location.replace("/");
        return <LoadingAnimation />;
    }

    return (
        <Suspense fallback={<LoadingAnimation />}>
            <Outlet />
        </Suspense>
    );
};

export default AdminPanelRoute