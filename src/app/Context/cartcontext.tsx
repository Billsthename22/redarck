'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Product = {
 id: string;
  title: string;
  price: string;
  description?: string;
  image?: string;
  imageSrc?: string;
  colors?: string[];
  sizes?: string[];
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  cartKey?: string;
};

type CartItem = Product & { 
  quantity: number;
  // Unique cart key for variants
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

// ✅ Safely convert ₦20,000 → 20000
const cleanPrice = (raw: string): number => {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d.]/g, '');
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};

// Generate unique key for cart items (includes variants)
const generateCartKey = (item: Product): string => {
  return `${item.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: Product) => {
    const cartKey = generateCartKey(item);
    
    setCartItems((prev) => {
      // Check if exact same item (including variants) exists
      const existingIndex = prev.findIndex((cartItem) => {
        const existingKey = generateCartKey(cartItem);
        return existingKey === cartKey;
      });

      if (existingIndex >= 0) {
        // Item exists, increase quantity
        const updatedItems = [...prev];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // New item, add to cart
        return [...prev, { ...item, quantity: 1, cartKey }];
      }
    });
    
    setIsOpen(true);
  };

  const removeFromCart = (cartKey: string) => {
    setCartItems((prev) => 
      prev.filter((item) => generateCartKey(item) !== cartKey)
    );
  };

  // ✅ Increase item quantity
 const increaseQty = (cartKey: string) => {
  console.log('Cart context increaseQty called with:', cartKey); // Debug
  setCartItems((prev) =>
    prev.map((item) => {
      const itemKey = generateCartKey(item);
      return itemKey === cartKey 
        ? { ...item, quantity: item.quantity + 1 } 
        : item;
    })
  );
};

  // ✅ Decrease item quantity, remove if quantity becomes 0
 const decreaseQty = (cartKey: string) => {
  console.log('Cart context decreaseQty called with:', cartKey); // Debug
  setCartItems((prev) => {
    const updatedItems = prev.map((item) => {
      const itemKey = generateCartKey(item);
      if (itemKey === cartKey) {
        return { ...item, quantity: Math.max(0, item.quantity - 1) };
      }
      return item;
    });
    
    // Remove items with quantity 0
    return updatedItems.filter((item) => item.quantity > 0);
  });
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