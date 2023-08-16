import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import { useTranslation } from "react-i18next";

const RedirectAfterGoogleLogin = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const changeCart = localStorage.getItem("changeCart")

    const lastVisitedPath = localStorage.getItem('lastVisitedPath');

    useEffect(() => {

        if (changeCart === "true") {
            axios.post("/changeCart", { userId: user?._id })
                .then(() => {
                    localStorage.removeItem("changeCart")
                }).catch((error) => {
                    console.log(error)
                })
        }
        if (lastVisitedPath) {
            navigate(lastVisitedPath);
        } else {
            navigate('/');
        }
    }, []);

    return <div className='flex justify-center items-center w-screen h-screen bg-white dark:bg-black/80'>
        <p className='text-3xl text-black dark:text-white'>{t("redirect")}</p>
    </div>;
};

export default RedirectAfterGoogleLogin;