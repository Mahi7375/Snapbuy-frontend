import axios from "../axios";
//import { useState, useEffect, createContext } from "react";
import { useState, useEffect, useCallback, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  isProductsLoading: false,
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData:() =>{},
  updateStockQuantity: (productId, newQuantity) =>{}  
});
let productsCache = null;
let productsCacheTime = 0;
let productsRequest = null;

const CACHE_DURATION = 5 * 60 * 1000;

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    console.log("productID",productId)
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("CART",cart)
  };

  // const refreshData = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/api/products`);
  //     setData(response.data);
  //   } catch (error) {
  //     setIsError(error.message);
  //   }
  // };
  const refreshData = useCallback(async (forceRefresh = false) => {
  const now = Date.now();

  if (
    !forceRefresh &&
    productsCache &&
    now - productsCacheTime < CACHE_DURATION
  ) {
    setData(productsCache);
    setIsError("");
    setIsProductsLoading(false);
    return;
  }

  setIsProductsLoading(true);
  try {
    if (!productsRequest) {
      productsRequest = axios
        .get(`${baseUrl}/api/products`)
        .then((response) => {
          productsCache = response.data;
          productsCacheTime = Date.now();
          return response.data;
        })
        .finally(() => {
          productsRequest = null;
        });
    }

    const products = await productsRequest;
    setData(products);
    setIsError("");
  } catch (error) {
    setIsError(error.message);
  } finally {
    setIsProductsLoading(false);
  }
}, [baseUrl]);

  const clearCart =() =>{
    setCart([]);
  }
  
  // useEffect(() => {
  //   refreshData();
  // }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return (
    <AppContext.Provider value={{ data, isError, isProductsLoading, cart, addToCart, removeFromCart,refreshData, clearCart  }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
