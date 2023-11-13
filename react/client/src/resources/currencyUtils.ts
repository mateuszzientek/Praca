
export const convertPriceToPLN = (priceUSD: number) => {
    const exchangeRateUSDToPLN = 4.08;
    const pricePLN = priceUSD * exchangeRateUSDToPLN;
    const roundedPricePLN = Math.round(pricePLN / 5) * 5; 
    return roundedPricePLN;
  };

  export const formatPrice = (price: number, t: any) => {
    const currentCode = localStorage.getItem('i18nextLng')

    if (currentCode === "pl") {
      const pricePLN = convertPriceToPLN(price);
      return `${pricePLN} ${t("currencySymbol")}`;
    } else {
      return `${t("currencySymbol")}${price},00`;
    }
  };

