'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setCartItems([]);
      setTotalItems(0);
      setTotalAmount(0);
      return;
    }
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
      setCartItems(cartData?.items || []);
      setTotalItems(cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      setTotalAmount(cartData?.totalAmount || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.warn('Please login to add items to cart');
      return false;
    }
    try {
      const cartData = await cartService.addItem(productId, quantity);
      setCart(cartData);
      setCartItems(cartData?.items || []);
      setTotalItems(cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      setTotalAmount(cartData?.totalAmount || 0);
      toast.success('Đã thêm vào giỏ hàng');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const cartData = await cartService.updateItem(itemId, quantity);
      setCart(cartData);
      setCartItems(cartData?.items || []);
      setTotalItems(cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      setTotalAmount(cartData?.totalAmount || 0);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      toast.error(message);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const cartData = await cartService.removeItem(itemId);
      setCart(cartData);
      setCartItems(cartData?.items || []);
      setTotalItems(cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      setTotalAmount(cartData?.totalAmount || 0);
      toast.success('Đã xóa khỏi giỏ hàng');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      setCartItems([]);
      setTotalItems(0);
      setTotalAmount(0);
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartItems,
      totalAmount,
      loading, 
      addToCart, 
      updateQuantity, 
      removeItem, 
      clearCart,
      cartCount: totalItems,
      totalItems,
      setCart,
      fetchCart,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
