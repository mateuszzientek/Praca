import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import { useTranslation } from "react-i18next";
import LoginCompleted from "../elements/LoginCompleted";
import { CartContext } from "../elements/CartProvider";
import InfoDivBottom from "../elements/InfoDivBottom";

const RedirectAfterGoogleLogin = () => {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { setQuantityCart } = useContext(CartContext);

    const changeCart = localStorage.getItem("changeCart")
    const lastVisitedPath = localStorage.getItem('lastVisitedPath') || "";
    const [errorServer, setErrorServer] = useState("");

    useEffect(() => {
        window.history.replaceState(null, "", "/");
    }, []);

    const handleClick = () => {
        const userIdParam = user?._id || "";

        if (changeCart === "true") {
            axios.post("/changeCart", { userId: user?._id })
                .then(() => {
                    localStorage.removeItem("changeCart");

                    axios
                        .get(`/getQuantityCart?userId=${userIdParam}`)
                        .then((response) => {
                            setQuantityCart(response.data.itemCount);
                            navigate(lastVisitedPath);
                        })
                        .catch((error) => {
                            if (
                                error.response &&
                                error.response.data &&
                                error.response.data.error
                            ) {
                                setErrorServer(error.response.data.error);
                            } else {
                                console.log(error);
                            }
                        })
                }).catch((error) => {
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.error
                    ) {
                        setErrorServer(error.response.data.error);
                    } else {
                        console.log(error);
                    }
                });
        } else {
            navigate(lastVisitedPath);
        }
    }


    return (
        <>
            <div className="flex justify-center">
                {errorServer && (
                    <InfoDivBottom color="bg-red-500" text={errorServer} />
                )}
            </div>
            <div className='flex flex-col justify-center items-center w-screen h-screen bg-white dark:bg-black/80'>
                <p className='text-3xl text-black dark:text-white'>{t("redirect")}</p>
                <LoginCompleted main={t("login.text10")} text={t("login.text11")} textButton={t("login.text12") as string} googleLogin={true} handleClick={handleClick} />
            </div>
        </>
    )
};

export default RedirectAfterGoogleLogin;