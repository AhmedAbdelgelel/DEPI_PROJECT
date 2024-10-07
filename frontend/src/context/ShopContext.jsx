import axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Memoized product price mapping for faster lookup
  const productPriceMap = useMemo(() => {
    const map = {};
    products.forEach((product) => (map[product._id] = product.price));
    return map;
  }, [products]);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems);
    cartData[itemId] = {
      ...cartData[itemId],
      [size]: (cartData[itemId]?.[size] || 0) + 1,
    };

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.error('Add to Cart Error: ', error);
        const errorMessage =
          error.response?.data?.message ||
          'Failed to add to cart. Please try again.';
        toast.error(errorMessage);
      }
    }
  };

  const getCartCount = () => {
    try {
      return Object.values(cartItems).reduce((totalCount, sizes) => {
        return (
          totalCount +
          Object.values(sizes).reduce((sum, count) => sum + count, 0)
        );
      }, 0);
    } catch (error) {
      console.error('Get Cart Count Error: ', error);
      return 0;
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    try {
      let cartData = structuredClone(cartItems);
      if (quantity <= 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][size] = quantity;
      }
      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/update`,
            { itemId, size, quantity },
            { headers: { token } },
          );
        } catch (error) {
          console.error('Update Quantity Error: ', error);
          const errorMessage =
            error.response?.data?.message ||
            'Failed to update cart item quantity.';
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Update Quantity Local Error: ', error);
    }
  };

  const getCartAmount = () => {
    try {
      return Object.keys(cartItems).reduce((totalAmount, itemId) => {
        const itemPrice = productPriceMap[itemId] || 0;
        const itemTotal = Object.keys(cartItems[itemId]).reduce((sum, size) => {
          return sum + itemPrice * cartItems[itemId][size];
        }, 0);
        return totalAmount + itemTotal;
      }, 0);
    } catch (error) {
      console.error('Get Cart Amount Error: ', error);
      return 0;
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        const errorMessage =
          response.data.message || 'Failed to fetch products.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Get Products Data Error: ', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to fetch products. Please check your network connection.';
      toast.error(errorMessage);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        const errorMessage =
          response.data.message || 'Failed to load cart data.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Get User Cart Error: ', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to load cart data. Please check your network connection.';
      toast.error(errorMessage);
    }
  };

  // Fetch products on initial render
  useEffect(() => {
    getProductsData();
  }, []);

  // Handle token retrieval and fetching user cart
  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
