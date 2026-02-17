'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Globe, User } from 'lucide-react';
import { useCart } from '@/app/Context/cartcontext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalQuantity, toggleCart } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkStyle = "text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-all duration-300 relative group";
  const dot = <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />;

  return (
    <div className="fixed top-0 left-0 z-50 w-full px-4 py-4 md:px-8">
      <nav className={`mx-auto max-w-screen-xl transition-all duration-500 rounded-[2rem] border ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-zinc-800 shadow-[0_0_20px_rgba(220,38,38,0.1)] py-2' 
          : 'bg-zinc-900/20 backdrop-blur-sm border-transparent py-4'
      }`}>
        
        {/* Desktop Navigation */}
        <div className="hidden md:grid grid-cols-3 items-center px-10">
          
          {/* Left Nav */}
          <div className="flex justify-start items-center gap-10">
            <Link href="/" className={linkStyle}>Home{dot}</Link>
            <Link href="/shop" className={linkStyle}>Shop{dot}</Link>
            <Link href="/#about" className={linkStyle}>About{dot}</Link>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center">
            <Link href="/" className="relative transition-transform duration-500 hover:scale-110">
              <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full scale-150 opacity-0 hover:opacity-100 transition-opacity" />
              <Image
                src="/redack nation 1.png"
                alt="Redack Nation Logo"
                width={50}
                height={50}
                className="object-contain relative z-10"
                priority
              />
            </Link>
          </div>

          {/* Right Nav */}
          <div className="flex justify-end items-center gap-10">
            <Link href="/Art" className={linkStyle}>Art{dot}</Link>
            <Link href="/contact" className={linkStyle}>Contact{dot}</Link>
            
            <button 
              onClick={toggleCart} 
              className="relative p-2 text-white hover:bg-zinc-800/50 rounded-full transition-all group"
            >
              <ShoppingCart className="w-5 h-5 transition-transform group-hover:-rotate-12" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-in zoom-in">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center px-6">
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
          
          <div className="flex items-center gap-4">
            <button onClick={toggleCart} className="relative p-2 text-white">
               <ShoppingCart className="w-6 h-6" />
               {totalQuantity > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 w-2 h-2 rounded-full shadow-[0_0_5px_rgba(220,38,38,1)]" />
               )}
            </button>
            <button
              className="p-2 bg-zinc-800/50 rounded-lg text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`transition-all duration-500 ease-in-out md:hidden overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-8 pt-4 pb-10 flex flex-col space-y-6 text-left border-t border-zinc-800/50 mt-4">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: 'About', href: '/#about' },
              { label: 'Art', href: '/Art' },
              { label: 'Contact', href: '/contact' }
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-3xl font-black uppercase tracking-tighter text-zinc-500 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}