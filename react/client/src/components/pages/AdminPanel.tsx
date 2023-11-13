import React, { useEffect, useState, useContext } from "react";
import Navbar from "../sections/Navbar";
import axios from "axios";
import { UserContext } from "../elements/UserProvider";
import UserTemplate from "../elements/UserTemplate";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useTranslation } from "react-i18next";
import Pagination from "../elements/Pagination";
import OrderTemplate from "../elements/OrderTemplate";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../resources/firebase";
import { AiOutlineDown, AiOutlineUp, AiOutlineClose } from "react-icons/ai";
import { ThemeContext } from "../elements/ThemeContext";
import CheckoutProductTemplate from "../elements/CheckoutProductTemplate";
import { formatPrice } from "src/resources/currencyUtils";
import { OrderInterface } from "src/types";
import { ShoeInterface } from "src/types";

interface Shoe extends ShoeInterface {
  brand: string;
  size?: string;
  quantity?: number;
  _idProduct?: string;
}

interface User {
  _id: string;
  email: string;
  name: string;
  surname: string;
  role: string;
}

function AdminPanel() {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, isUserLoggedIn, isUserDataLoaded, fetchUserData } =
    useContext(UserContext);

  const [users, setUsers] = useState<User[] | null>(null);
  const [orders, setOrders] = useState<OrderInterface[] | null>(null);
  const [singleOrder, setSingleOrder] = useState<OrderInterface | null>(null);
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [matchingShoes, setMatchingShoes] = useState<Shoe[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [errorsServer, setErrorsServer] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageOrder, setPageOrder] = useState(1);
  const [pagesOrder, setPagesOrder] = useState(1);
  const [showDiv, setShowDiv] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [selectedSort, setSelectedSort] = useState("all");
  const [selectedType, setSelectedType] = useState("users");
  const [selectedStatus, setSelectedStatus] = useState("");
  const sortType = ["all", "submitted", "preparing", "shipped", "delivered"];
  const [message, setMessage] = useState("");

  const actionType = ["users", "orders", "customOrders"]


  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "text-blue-500";
      case "preparing":
        return "text-yellow-500";
      case "shipped":
        return "text-[#8c03fc]";
      case "delivered":
        return "text-green-500";
      default:
        return "text-black/80";
    }
  };

  useEffect(() => {
    if (showDiv) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showDiv]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const clickDetails = (orderId: string) => {
    setShowDiv(!showDiv);

    if (orders) {
      const singleOrder = orders.filter((order) => order._id === orderId);
      setSingleOrder(singleOrder.length > 0 ? singleOrder[0] : null);
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSort = event.target.value;
    setSelectedSort(selectedSort);
    setShowSort(false);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBrand = event.target.value;
    setSelectedType(selectedBrand);
  };

  const handleStatusChange = (status: string) => {
    const selectedStatus = status;

    const data = {
      status: selectedStatus,
      orderId: singleOrder?._id,
    };

    axios
      .post("/updateStatus", data)
      .then((response) => {
        const updatedSingleOrder = {
          ...singleOrder,
          status: selectedStatus,
        };

        setSingleOrder(updatedSingleOrder as OrderInterface);

        const updatedOrders = orders?.map((order) => {
          if (order._id === singleOrder?._id) {
            return {
              ...order,
              status: selectedStatus,
            };
          }
          return order;
        });

        // Aktualizujemy stan 'orders' za pomocą nowej tablicy 'updatedOrders'
        setOrders(updatedOrders as OrderInterface[]);

        const message = t("adminPanel.text5");
        setMessage(message);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorsServer(error.response.data.error);
        } else {
          console.log(error);
        }
      });

    setShowStatus(false);
  };
  useEffect(() => {
    setIsDataFetched(false);
    axios
      .get(`/getUsers?page=${page}`)
      .then((response) => {
        setUsers(response.data.users);
        setPage(response.data.page);
        setPages(response.data.pages);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorsServer(error.response.data.error);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setIsDataFetched(true);
      });
  }, [user, page]);

  useEffect(() => {
    setIsDataFetched(false);
    axios
      .get(`/getOrdersAdmin?page=${pageOrder}&sort=${selectedSort}`)
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

        setPageOrder(response.data.page);
        setPagesOrder(response.data.pages);
        setShoes(shoeImages);
        setOrders(response.data.orders);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorsServer(error.response.data.error);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setIsDataFetched(true);
      });
  }, [user, pageOrder, selectedSort]);

  const handleDelete = (userId: string) => {
    if (users) {
      const updatedUsers = users?.filter((prevUser) => prevUser._id !== userId);
      setUsers(updatedUsers);
    }
  };

  const handleError = (error: string) => {
    setErrorsServer(error);
  };

  useEffect(() => {
    // Czyszczenie poprzednich pasujących butów
    setMatchingShoes([]);

    const matchingShoesWithQuantityAndSize: any = [];

    singleOrder?.products.forEach((product) => {
      const matchingShoe = shoes.find((shoe) => shoe._id === product.shoeId);
      if (matchingShoe) {
        const shoeWithDetails = {
          ...matchingShoe,
          size: product.size,
          quantity: product.quantity,
          _idProduct: product._id,
        };
        matchingShoesWithQuantityAndSize.push(shoeWithDetails);
      }
    });

    setMatchingShoes(matchingShoesWithQuantityAndSize);
  }, [singleOrder]);

  return (
    <>
      <div className="flex justify-center z-[3]">
        {message && <InfoDivBottom color="bg-green-500" text={message} />}
      </div>

      <div className="flex justify-center">
        {errorsServer && (
          <InfoDivBottom color="bg-red-500" text={errorsServer} />
        )}
      </div>

      {showDiv && (
        <div className="fixed w-screen h-screen flex justify-center items-center m-auto  bg-black/40 backdrop-blur-sm  z-[2]">
          <div className="flex-col  bg-white dark:bg-black  pt-10 px-10 xl:px-20 max-h-[80vh] w-[90vw]  xl:w-[70rem] overflow-y-auto">


            <div className="flex justify-end  relative  mb-4">
              <div className="flex items-center space-x-10">
                <button
                  onClick={() => setShowStatus(!showStatus)}
                  className="flex items-center space-x-1 px-2 py-2 border-[2px] border-black/10 dark:border-white dark:text-white text-black/60 rounded-md"
                >
                  <p
                    className={`${getStatusColor(
                      singleOrder?.status ? singleOrder?.status : ""
                    )}`}
                  >
                    {t(`status.${singleOrder?.status}`)}
                  </p>
                  {showSort ? (
                    <AiOutlineUp size={15} />
                  ) : (
                    <AiOutlineDown size={15} />
                  )}
                </button>

                <div onClick={() => setShowDiv(!showDiv)}>
                  <AiOutlineClose
                    size={30}
                    color={theme === "dark" ? "white" : "black"}
                    className="cursor-pointer hover:scale-125"
                  />
                </div>
              </div>

              {showStatus && (
                <div className="animate-sort-in absolute top-12 right-16 whitespace-nowrap bg-white shadow-button mt-1 rounded z-10">
                  {sortType.map((status) => (
                    <label
                      key={status}
                      className={`${singleOrder?.status === status
                        ? "cursor-default"
                        : "cursor-pointer"
                        }`}
                    >
                      <button
                        className="peer sr-only"
                        name="status"
                        disabled={singleOrder?.status === status}
                        onClick={() => handleStatusChange(status)}
                      />
                      <p
                        className={`text-black/80 px-3 py-2  peer-checked:font-bold hover:bg-black/10 ${getStatusColor(
                          status
                        )}`}
                      >
                        {t(`status.${status}`)}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <p className=" text-2xl text-black dark:text-white font-semibold">
              {t("order.text7")} {singleOrder?.orderNumber}
            </p>

            <div className="flex flex-col lg:flex-row">
              <div className="h-full w-full lg:w-[50%] mt-10 ">
                <p className="text-xl text-black/80  dark:text-white/80">
                  {t("order.text8")}
                </p>
                <div className="text-lg text-black/50  dark:text-white/50">
                  <p className="mt-6">
                    {t("order.text1")}{" "}
                    <span className="text-black/80  dark:text-white/80">
                      {singleOrder?.orderNumber}
                    </span>
                  </p>
                  <p className="mt-2">
                    {t("order.text9")}{" "}
                    <span className="text-black/80 dark:text-white/80">
                      {singleOrder
                        ? new Date(singleOrder.orderDate).toLocaleString()
                        : ""}
                    </span>
                  </p>
                  <p className="mt-2">
                    {t("order.text10")}{" "}
                    <span className="text-black/80 dark:text-white/80">
                      {singleOrder?.deliveryMethod}
                    </span>
                  </p>
                  <p className="mt-2">
                    {t("order.text11")}{" "}
                    <span className="text-black/80 dark:text-white/80">
                      {t(`payment.${singleOrder?.paymentMethod}`)}
                    </span>
                  </p>
                </div>

                <p className="text-xl text-black/80  dark:text-white/80 mt-10 ">
                  {t("order.text12")}
                </p>

                <div className="text-lg text-black/50 dark:text-white/50  pb-10">
                  <p className="mt-6">
                    Email:{" "}
                    <span className="text-black/80 dark:text-white/80">
                      {singleOrder?.address.email}
                    </span>
                  </p>
                  <p className="mt-2">
                    {t("checkout.text23")}{" "}
                    <span className="text-black/80 dark:text-white/80">
                      {singleOrder?.address.name} {singleOrder?.address.surname}
                    </span>
                  </p>

                  <p className="mt-2">
                    {t("checkout.text24")}{" "}
                    <span className="text-black/80 dark:text-white/80">
                      {singleOrder?.address.telephone}
                    </span>
                  </p>
                  <p className="mt-2">
                    {t("checkout.text25")}{" "}
                    <span className="text-black/80 dark:text-white/80">
                      {singleOrder?.address.street},
                    </span>
                  </p>
                  <p className="mt-2 text-black/80 dark:text-white/80">
                    {singleOrder?.address.postalCode} {singleOrder?.address.city},
                  </p>
                  <p className="mt-2 text-black/80 dark:text-white/80">
                    {t(`country.${singleOrder?.address.country}`)}
                  </p>
                </div>
              </div>

              <div className="h-full w-full lg:w-[50%]  lg:mt-10 ">
                <p className="text-xl text-black/80  dark:text-white/80 mb-10">
                  {t("order.text13")}
                </p>
                {matchingShoes.map((product) => (
                  <div key={product._idProduct}>
                    <CheckoutProductTemplate
                      key={product._idProduct}
                      imageUrl={product.imageUrl || ""}
                      brand={product.brand}
                      name={product.name}
                      cartSize={product.size || ""}
                      cartQuantity={product.quantity || 0}
                      price={product.price}
                    />
                  </div>
                ))}
                <div className="h-[1px] w-full bg-black/50 dark:bg-white/50 mt-6"></div>
                <div className="flex flex-col space-y-2 text-lg text-black/80 dark:text-white/80 text-end mt-6 pb-10">
                  <p>
                    {t("order.text3")}{" "}
                    {singleOrder && (
                      <span className="font-bold">
                        {formatPrice(singleOrder.price, t)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="w-screen min-h-screen bg-white dark:bg-black/80 pb-16">
        <Navbar
          background="bg-white"
          shadow="none"
          extra="border-b border-black/20 dark:border-white/20"
        />

        <div className="flex items-center justify-center bg-white w-full h-[8rem] shadow-lg">

          <div className="flex space-x-4 md:space-x-10">
            {actionType.map((type) => (
              <label key={type} className="cursor-pointer ">
                <input
                  type="radio"
                  className="peer sr-only"
                  name="actionType"
                  value={type}
                  onChange={handleTypeChange}
                  checked={type === selectedType}
                />
                <div className="flex justify-center items-center w-[8rem] h-[3rem]  border-[2px] border-black/10 dark:border-white text-black/60 dark:text-white  rounded-md peer-checked:bg-[#97DEFF] peer-checked:text-black/60  peer-checked:border-none hover:scale-105 transform ease-in-out duration-500">
                  <p> {t(`adminPanel.${type}`)}</p>
                </div>
              </label>
            ))}
          </div>

        </div>
        <div className="flex items-center justify-center mx-auto  mt-10  w-full    lg:space-x-10">
          {!isDataFetched ? (
            <div className="flex justify-center items-center h-[50vh]">
              <LoadingAnimationSmall />
            </div>
          ) : (
            <>
              {selectedType === "users" && (
                <div className="flex-col items-center text-center w-[80%] xl:w-[70%] ">

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
              )}

              {selectedType === "orders" && (
                <>
                  <div className="flex flex-col w-[85%] xl:w-[70%] ">
                    <div className="relative flex justify-end  mb-10 w-full">
                      <button
                        onClick={() => setShowSort(!showSort)}
                        className="flex justify-end items-center space-x-1 px-4 py-3 bg-white border-[2px] border-black/10 rounded-full  "
                      >
                        <p>{t(`status.${selectedSort}`)}</p>
                        {showSort ? (
                          <AiOutlineUp size={15} />
                        ) : (
                          <AiOutlineDown size={15} />
                        )}
                      </button>
                      {showSort && (
                        <div className="animate-sort-in absolute top-12 right-0 whitespace-nowrap bg-white shadow-button mt-1 rounded z-[1]">
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
                    <div className=" w-full flex-col items-center text-center ">

                      {orders?.length === 0 ? (
                        <p className="text-2xl text-black/80 dark:text-white/80 mt-20">
                          {t(`adminPanel.text6`)}
                        </p>
                      ) : (
                        <>
                          {orders?.map((order) => (
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
                          ))}

                          <Pagination
                            page={pageOrder}
                            pages={pagesOrder}
                            changePage={setPageOrder}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}


            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
