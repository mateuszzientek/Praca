import React, { useState } from 'react';
import axios from "axios";
import { useTranslation } from "react-i18next";

interface UserTemplateProps {
    id: string
    email: string
    name: string
    surname: string
    role: string
    handleDelete: (userId: string) => void;
    handleError: (error: string) => void;
}

function UserTemplate(props: UserTemplateProps) {

    const { t } = useTranslation();
    const [showMessageDelete, setShowMessageDelete] = useState(false);

    const handleDeleteUser = () => {
        const userId = props.id
        axios.delete(`/deleteUser/${userId}`)
            .then((response) => {
                setShowMessageDelete(true);

                setTimeout(() => {
                    props.handleDelete(props.id);
                    setShowMessageDelete(false);
                }, 1000);
            }).catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.error
                ) {
                    props.handleError(error)
                }
                else {
                    console.log(error);
                }
            })
    }

    return (
        <div className='w-full py-4  border-b-2 border-black/50 dark:border-white/50'>
            {showMessageDelete ? (
                <p className='text-black/80 dark:text-white/80'>{t("adminPanel.text4")}</p>
            ) : (
                <div className={`flex justify-between items-center`}>
                    <div className='flex flex-col md:flex-row  flex-wrap justify-start text-start ml-4 text-black/80 dark:text-white/80 w-[85%]'>
                        <p className='pr-4'>{props.id}</p>
                        <p className='pr-4'>{props.name} {props.surname} </p>
                        <p className='pr-4 font-medium'>{props.email}</p>
                        <p>{props.role}</p>
                    </div>
                    <button onClick={handleDeleteUser} className='px-3 py-1 bg-[#97DEFF] rounded-lg'>
                        <p className='text-lg text-black/80'>{t("adminPanel.text3")}</p>
                    </button>
                </div>

            )}
        </div>
    );
}

export default UserTemplate;