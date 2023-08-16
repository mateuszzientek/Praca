import React, { useEffect, useState, useContext } from 'react';
import Navbar from "../sections/Navbar";
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import UserTemplate from '../elements/UserTemplate';
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useTranslation } from "react-i18next";
import Pagination from "../elements/Pagination";
import OrderTemplate from "../elements/OrderTemplate";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

interface User {
    _id: string
    email: string
    name: string
    surname: string
    role: string
}

interface Shoe {
    _id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    imageUrl?: string;
    discountPrice: number;
    image: string;
    size?: string;
    quantity?: number;
    _idProduct?: string;
}

interface Address {
    email: string;
    name: string;
    surname: string;
    street: string;
    city: string;
    postalCode: string;
    telephone: string;
    extra: string;
    country: string;
}

interface Products {
    _id: string;
    shoeId: string;
    size: string;
    quantity: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    userId: string;
    address: Address;
    products: Products[];
    price: number;
    paymentMethod: string;
    deliveryMethod: string;
    orderDate: Date;
    status: string;
    discount: number
}

function AdminPanel() {

    const { t } = useTranslation();
    const { user, isUserLoggedIn, isUserDataLoaded, fetchUserData } =
        useContext(UserContext);

    const [users, setUsers] = useState<User[] | null>(null);
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [shoes, setShoes] = useState<Shoe[]>([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [errorsServer, setErrorsServer] = useState("");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [pageOrder, setPageOrder] = useState(1);
    const [pagesOrder, setPagesOrder] = useState(1);
    const [showDiv, setShowDiv] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState("");
    const sortType = ["submitted", "preparing", "shipped", "delivered"];

    const clickDetails = (orderId: string) => {
        setShowDiv(!showDiv);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedSort = event.target.value;
        setSelectedSort(selectedSort);
        setShowSort(false);
    };

    useEffect(() => {

        setIsDataFetched(false)
        axios.get(`/getUsers?page=${page}`).then((response) => {
            setUsers(response.data.users)
            setPage(response.data.page)
            setPages(response.data.pages);
        }).catch((error) => {
            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                setErrorsServer(error.response.data.error);
            } else {
                console.log(error);
            }
        }).finally(() => {
            setIsDataFetched(true)
        })

    }, [user, page])

    useEffect(() => {

        setIsDataFetched(false)
        axios.get(`/getOrdersAdmin?page=${pageOrder}&sort=${selectedSort}`)
            .then(async (response) => {
                const fetchedShoes: any[] = response.data.shoes || [];

                const shoeImages = await Promise.all(
                    fetchedShoes.map(async (product) => {
                        const pathReference = ref(
                            storage,
                            `/mainPhoto/${product.image}.png`
                        );
                        const url = await getDownloadURL(pathReference);
                        return {
                            ...product,
                            imageUrl: url,
                        };
                    })
                );

                setPageOrder(response.data.page)
                setPagesOrder(response.data.pages);
                setShoes(shoeImages);
                setOrders(response.data.orders);
            }).catch((error) => {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.error
                ) {
                    setErrorsServer(error.response.data.error);
                } else {
                    console.log(error);
                }
            }).finally(() => {
                setIsDataFetched(true)
            })

    }, [user, pageOrder, selectedSort])


    const handleDelete = (userId: string) => {
        if (users) {
            const updatedUsers = users?.filter(
                (prevUser) => prevUser._id !== userId
            );
            setUsers(updatedUsers);
        }
    };

    const handleError = (error: string) => {
        setErrorsServer(error)
    }

    console.log(pageOrder)

    return (
        <>
            <div className="flex justify-center">
                {errorsServer && (
                    <InfoDivBottom color="bg-red-500" text={errorsServer} />
                )}
            </div>
            <div className='w-screen min-h-screen bg-white dark:bg-black/80 pb-16'>
                <Navbar
                    background="bg-white"
                    shadow="none"
                    extra="border-b border-black/20 dark:border-white/20"
                />
                <div className='flex justify-center mx-auto  mt-10 w-[80%] space-x-10'>
                    {!isDataFetched ? (
                        <div className="flex justify-center items-center h-[50vh]">
                            <LoadingAnimationSmall />
                        </div>
                    ) : (
                        <>
                            <div className='flex-col items-center text-center  w-[50%] '>
                                <p className='text-2xl text-black/80 dark:text-white/80 mb-10'>{t("adminPanel.text1")}</p>
                                {users?.map((user) => (
                                    <div key={user._id}>
                                        <UserTemplate
                                            id={user._id}
                                            email={user.email}
                                            name={user.name}
                                            surname={user.surname}
                                            role={user.role}
                                            handleDelete={handleDelete}
                                            handleError={handleError}
                                        />
                                    </div>
                                ))}

                                <Pagination page={page} pages={pages} changePage={setPage} />

                            </div>
                            <div className=' w-[50%] flex-col items-center text-center '>
                                <div className='relative '>
                                    <p className='text-2xl text-black/80 dark:text-white/80 mb-10'>{t("adminPanel.text2")}</p>

                                    <div className="absolute top-0 right-0 flex h-[3rem] border-[2px] border-black/10 dark:border-white dark:text-white text-black/60 rounded-md">
                                        <button
                                            onClick={() => setShowSort(!showSort)}
                                            className="flex items-center space-x-1 px-2"
                                        >
                                            <p>
                                                {!selectedSort ? t(`shop.sort`) : t(`status.${selectedSort}`)}
                                            </p>
                                            {showSort ? (
                                                <AiOutlineUp size={15} />
                                            ) : (
                                                <AiOutlineDown size={15} />
                                            )}
                                        </button>
                                        {showSort && (
                                            <div className="animate-sort-in absolute top-12 right-0 whitespace-nowrap bg-white shadow-button mt-1 rounded z-10">
                                                {sortType.map((sort) => (
                                                    <label key={sort} className="cursor-pointer ">
                                                        <input
                                                            type="radio"
                                                            className="peer sr-only"
                                                            name="sortAdmin"
                                                            value={sort}
                                                            onChange={handleSortChange}
                                                            checked={sort === selectedSort}
                                                        />
                                                        <p className="text-black/80 px-3 py-2 peer-checked:font-bold hover:bg-black/10 ">
                                                            {t(`status.${sort}`)}
                                                        </p>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>


                                </div>

                                {orders?.length === 0 ?
                                    <p className='text-2xl text-black/80 dark:text-white/80 mt-20'>Aktualnie nie ma żadnych zamówień spełniających kryteria</p>
                                    :
                                    <>
                                        {orders?.map((order) => (
                                            <>
                                                <div key={order._id}>
                                                    <OrderTemplate
                                                        orderId={order._id}
                                                        orderNumber={order.orderNumber}
                                                        orderProducts={order.products}
                                                        shoes={shoes}
                                                        price={order.price}
                                                        status={order.status}
                                                        clickDetails={clickDetails}
                                                    />
                                                </div>
                                            </>
                                        ))}

                                        <Pagination page={pageOrder} pages={pagesOrder} changePage={setPageOrder} />
                                    </>
                                }


                            </div>
                        </>)}

                </div>

            </div>
        </>
    );
}

export default AdminPanel;