'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Product = {
  id: string;
  title: string;
  price: string; // keep as string for formatted price
  description?: string;
  image?: string;
  imageSrc?: string;
  colors?: string[];
  sizes?: string[];
  selectedColor?: string;
  selectedSize?: string;
  shirtQuality?: string; // ✅ added
  quantity: number;
  cartKey?: string;
};

type CartItem = Product & {
  quantity: number;
  cartKey?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Product) => void;
  removeFromCart: (cartKey: string) => void;
  increaseQty: (cartKey: string) => void;
  decreaseQty: (cartKey: string) => void;
  isOpen: boolean;
  toggleCart: () => void;
  totalAmount: number;
  totalQuantity: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const cleanPrice = (raw: string): number => {
  if (!raw) return 0; // remove all non-numeric characters except dot and minus
  // const cleaned = raw.replace(/[^\d.]/g, '');
  const num = Number(raw);
  return isNaN(num) ? 0 : num;
};

// ✅ Include shirtQuality in cart key
const generateCartKey = (item: Product): string => {
  return `${item.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}-${item.shirtQuality || 'Standard'}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: Product) => {
    const cartKey = generateCartKey(item);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((cartItem) => generateCartKey(cartItem) === cartKey);

      if (existingIndex >= 0) {
        const updatedItems = [...prev];
        updatedItems[existingIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prev, { ...item, quantity: 1, cartKey }];
      }
    });

    setIsOpen(true);
  };

  const removeFromCart = (cartKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const increaseQty = (cartKey: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (cartKey: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleCart = () => setIsOpen((prev) => !prev);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = cleanPrice(item.price);
    return sum + price * item.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        isOpen,
        toggleCart,
        totalAmount,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
