'use client';

import { MdEmail } from 'react-icons/md';
import { FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 pt-16 pb-8 px-6 md:px-16 overflow-hidden">
      {/* Background Decorative Element - Subtle Red Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Identity - 5 Columns */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src="/redack nation black 1.png"
                alt="Redack Nation Logo"
                width={60}
                height={60}
                className="brightness-0 invert hover:scale-110 transition-transform cursor-pointer"
              />
              <span className="font-koulen text-2xl tracking-widest text-white uppercase italic">
                Redack <span className="text-red-600">Nation</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm uppercase font-medium tracking-tight">
              A Christian fashion brand focused on self-expression through Christian morals. 
              Unique designs engineered with premium quality fabrics and tactical textures.
            </p>
          </div>

          {/* Quick Links - 3 Columns */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-white font-koulen text-lg tracking-wider uppercase">Navigation</h3>
            <ul className="space-y-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
              <li><Link href="/" className="hover:text-red-600 transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-red-600 transition-colors">Catalog</Link></li>
              <li><Link href="/custom" className="hover:text-red-600 transition-colors">Custom Order</Link></li>
              <li><Link href="/about" className="hover:text-red-600 transition-colors">The Mission</Link></li>
            </ul>
          </div>

          {/* Contact & Social - 4 Columns */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="text-white font-koulen text-lg tracking-wider uppercase underline decoration-red-600 underline-offset-8">
              Contact Us
            </h3>
            
            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:redacknation@gmail.com"
                className="group flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-3 rounded-xl hover:border-red-600/50 transition-all"
              >
                <div className="bg-zinc-800 p-2 rounded-lg group-hover:text-red-600 transition-colors">
                  <MdEmail size={20} />
                </div>
                <span className="text-zinc-300 text-sm font-semibold truncate">
                  redacknation@gmail.com
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/redacknation"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-3 rounded-xl hover:border-red-600/50 transition-all"
              >
                <div className="bg-zinc-800 p-2 rounded-lg group-hover:text-red-600 transition-colors">
                  <FaInstagram size={20} />
                </div>
                <span className="text-zinc-300 text-sm font-semibold">
                  @redacknation
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
            © {currentYear} REDACK NATION / ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6">
            <span className="text-zinc-600 text-[10px] uppercase font-bold hover:text-white cursor-crosshair">Privacy_Policy</span>
            <span className="text-zinc-600 text-[10px] uppercase font-bold hover:text-white cursor-crosshair">Terms_of_Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}