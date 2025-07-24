'use client';

import { MdEmail } from 'react-icons/md';
import { FaInstagram } from 'react-icons/fa';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#d8d8d8] border border-black py-8 px-4 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

        {/* Left - Logo & Description */}
        <div className="flex gap-4 items-start md:items-center">
          <Image
            src="/redack nation black 1.png"
            alt="Redack Nation Logo"
            width={80}
            height={80}
          />
          <p className="text-black text-sm max-w-md leading-relaxed font-semibold">
            REDACK NATION IS A CHRISTIAN FASHION BRAND FOCUSED ON SELF EXPRESSION THROUGH CHRISTIAN MORALS. 
            THE DESIGNS ARE UNIQUE AND HAVE HIGH QUALITY FABRICS AND TEXTURES.
          </p>
        </div>

        {/* Right - Contact Info */}
        <div className="text-left">
          <h3 className="text-black font-bold uppercase text-sm mb-4">Contact Info</h3>

          {/* Email */}
          <div className="flex items-center gap-4 mb-4">
            <MdEmail className="text-black" size={28} />
            <a
              href="mailto:redacknation@gmail.com"
              className="text-black text-base font-semibold hover:underline"
            >
              redacknation@gmail.com
            </a>
          </div>

          {/* Instagram */}
          <div className="flex items-center gap-4">
            <FaInstagram className="text-black" size={28} />
            <a
              href="https://instagram.com/redacknation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-base font-semibold hover:underline"
            >
              @redacknation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
