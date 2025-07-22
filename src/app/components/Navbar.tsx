'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useCart } from '@/app/Context/cartcontext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { totalQuantity, toggleCart } = useCart()

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin')
    setIsAdmin(adminStatus === 'true')
  }, [])

  return (
    <nav className="w-full bg-black text-white border-b border-gray-800 px-6 py-4">
      {/* Top Nav Bar */}
      <div className="flex justify-between items-center">
        {/* Left Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-semibold uppercase tracking-wide hover:text-red-500 transition">Home</Link>
          <Link href="/shop" className="font-semibold uppercase tracking-wide hover:text-red-500 transition">Shop</Link>
          <Link href="/#about" className="font-semibold uppercase tracking-wide hover:text-red-500 transition">About</Link>


          <Link href="/Art" className="font-semibold uppercase tracking-wide hover:text-red-500 transition">Art</Link>
          <Link href="/contact" className="font-semibold uppercase tracking-wide hover:text-red-500 transition">Contact</Link>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center">
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

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-6">
          {isAdmin && (
            <Link href="/signup" className="hover:text-red-500 transition">
              <User className="w-6 h-6" />
            </Link>
          )}
          <button onClick={toggleCart} className="relative hover:text-red-500 transition">
            <ShoppingCart className="w-6 h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center space-y-4 text-center">
          <Link href="/" className="hover:text-red-500 transition">Home</Link>
          <Link href="/shop" className="hover:text-red-500 transition">Shop</Link>
          <Link href="/about" className="hover:text-red-500 transition">About</Link>
          <Link href="/Art" className="hover:text-red-500 transition">Art</Link>
          <Link href="/contact" className="hover:text-red-500 transition">Contact</Link>

          {isAdmin && (
            <Link href="/signup" className="hover:text-red-500 transition flex items-center gap-2">
              <User className="w-5 h-5" /> Account
            </Link>
          )}
          <button
            onClick={() => {
              toggleCart()
              setIsOpen(false)
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
  )
}
