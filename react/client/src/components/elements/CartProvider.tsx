import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserProvider";

interface CartContextData {
  isEmptyCart: boolean | null;
  discountAmount: number;
  discountName: string;
  quantityCart: number;
  isDataLoaded: boolean;
  setDiscountAmount: (discountName: number) => void;
  setDiscountName: (discountAmount: string) => void;
  setQuantityCart: (quantity: number) => void;
  setIsEmptyCart: (isEmptyCart: boolean) => void;
  setIsDataLoaded: (isDataLoaded: boolean) => void;
}

export const CartContext = createContext<CartContextData>({
  isEmptyCart: null,
  discountAmount: 0,
  discountName: "",
  quantityCart: 0,
  isDataLoaded: false,
  setQuantityCart: () => { },
  setDiscountAmount: () => { },
  setDiscountName: () => { },
  setIsEmptyCart: () => { },
  setIsDataLoaded: () => { },
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {

  const { user, isUserDataLoaded } = useContext(UserContext);

  const [quantityCart, setQuantityCart] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isEmptyCart, setIsEmptyCart] = useState<boolean | null>(null);
  const [discountName, setDiscountName] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);


  useEffect(() => {
    const userIdParam = user?._id || "";
    if (isUserDataLoaded) {
      axios
        .get(`/getQuantityCart?userId=${userIdParam}`)
        .then((response) => {
          setQuantityCart(response.data.itemCount);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsDataLoaded(true);
        });
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        quantityCart,
        setQuantityCart,
        discountName,
        discountAmount,
        setDiscountName,
        setDiscountAmount,
        isEmptyCart,
        setIsEmptyCart,
        isDataLoaded,
        setIsDataLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
