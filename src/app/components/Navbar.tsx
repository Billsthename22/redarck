'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/app/Context/cartcontext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalQuantity, toggleCart } = useCart();

  return (
   <nav className="fixed top-0 left-0 z-50 w-full bg-black text-white border-b border-gray-800 px-6 py-4">

      <div className="hidden md:grid grid-cols-3 items-center">
        {/* Left Nav Items */}
        <div className="flex justify-evenly items-center">
          <Link href="/" className="font-semibold uppercase hover:text-red-500">Home</Link>
          <Link href="/shop" className="font-semibold uppercase hover:text-red-500">Shop</Link>
          <Link href="/#about" className="font-semibold uppercase hover:text-red-500">About</Link>
        </div>

        {/* Center Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/redack nation 1.png"
              alt="Redack Nation Logo"
              width={50}
              height={50}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right Nav Items */}
        <div className="flex justify-evenly items-center">
          <Link href="/Art" className="font-semibold uppercase hover:text-red-500">Art</Link>
          <Link href="/contact" className="font-semibold uppercase hover:text-red-500">Contact</Link>
          <button onClick={toggleCart} className="relative hover:text-red-500 transition">
            <ShoppingCart className="w-6 h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center">
        {/* Mobile Logo */}
        <Link href="/">
          <Image
            src="/redack nation 1.png"
            alt="Redack Nation Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* Mobile Menu Icon */}
        <button
          className="text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center space-y-4 text-center">
          <Link
            href="/"
            className="hover:text-red-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="hover:text-red-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/#about"
            className="hover:text-red-500 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/Art"
            className="hover:text-red-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Art
          </Link>
          <Link
            href="/contact"
            className="hover:text-red-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <button
            onClick={() => {
              toggleCart();
              setIsOpen(false);
            }}
            className="hover:text-red-500 transition flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {totalQuantity > 0 && (
              <span className="ml-1 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}
