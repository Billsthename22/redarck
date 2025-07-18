'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import BannerVerse from './components/BannerVerse';
import Outpost from './components/Outpost';
import Footer from './components/Footer';
import Buffer from './components/buffer'
import { TypeAnimation } from 'react-type-animation';
export default function Home() {
  
  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Buffer/>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full bg-black px-6 py-12">
  <div className="relative w-full max-w-[1296px] mx-auto aspect-[1296/702] overflow-hidden shadow-lg rounded-[36px]">
    <video
      src="/bg.mp4"
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    />

    {/* Desktop/Large Screens: Full Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 pt-16 hidden sm:flex">
      <h1 className="text-5xl font-bold mb-4 leading-tight">
        LET MY LIGHT SO <span className="font-[Leckerli_One]">shine</span>
      </h1>
      <h3 className="text-xl mb-6">Not your regular fashion brand</h3>
      <Link href="/shop">
  <button className="bg-yellow-600 font-[koulen] hover:bg-yellow-700 text-black px-8 py-4 rounded-full text-xl transition duration-300">
    Shop Now
  </button>
</Link>



    </div>

    {/* Mobile/Small Screens: Only Button on Top */}
    <div className="absolute top-6 left-0 right-0 flex justify-center sm:hidden">
    <Link
  href="/shop"
  className="bg-yellow-600 text-black font-[koulen] px-8 py-4 rounded-full text-xl animate-bounce inline-block text-center"
>
  Shop Now
</Link>


    </div>
  </div>
</section>




      <BannerVerse />

      {/* Feature Boxes */}
      <section className="px-6 py-8 flex justify-center">
  {/* Desktop View */}
  <div className="hidden lg:flex flex-row gap-4 max-w-[1320px] w-full">
    {/* Left Big Box */}
    <Link href="/shop" className="relative w-[640px] h-[639px] rounded-[37px] overflow-hidden block group">
      <img 
        src="/newrelease.png" 
        alt="New Release" 
        className="w-full h-full object-cover group-hover:scale-110 transition"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-start items-end p-6 group-hover:bg-black/60 transition">
        <h3 className="font-[koulen] text-[100px] leading-[100%] text-white uppercase">NEW<br />RELEASES</h3>
      </div>
    </Link>

    {/* Right Column */}
    <div className="flex flex-col justify-between gap-4">
      <Link href="/customorder" className="relative w-[640px] h-[310px] rounded-[37px] overflow-hidden block group">
        <img 
          src="/customorder .png" 
          alt="Custom Order" 
          className="w-full h-full object-cover group-hover:scale-110 transition"
        />
        <div className="absolute inset-0 bg-black/40 flex justify-start items-start p-6 group-hover:bg-black/60 transition">
          <h3 className="font-[koulen] text-[96px] text-white uppercase leading-tight">CUSTOM<br />ORDER</h3>
        </div>
      </Link>

      <div className="relative w-[640px] h-[310px] rounded-[37px] overflow-hidden group">
        <video
          src="/comingsoon.MP4"
          className="w-full h-full object-cover"
          autoPlay muted loop playsInline
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>
      </div>
    </div>
  </div>

  {/* Tablet View */}
  <div className="hidden sm:flex lg:hidden flex-col gap-4 w-full max-w-[768px]">
    <Link href="/shop" className="relative w-full h-[400px] rounded-[30px] overflow-hidden block group">
      <img 
        src="/newrelease.png" 
        alt="New Release"
        className="w-full h-full object-cover group-hover:scale-105 transition"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-start items-end p-4 group-hover:bg-black/60 transition">
        <h3 className="font-[koulen] text-[64px] text-white uppercase">NEW<br />RELEASES</h3>
      </div>
    </Link>

    <Link href="/customorder" className="relative w-full h-[300px] rounded-[30px] overflow-hidden block group">
      <img 
        src="/customorder .png" 
        alt="Custom Order"
        className="w-full h-full object-cover group-hover:scale-105 transition"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-start items-start p-4 group-hover:bg-black/60 transition">
        <h3 className="font-[koulen] text-[52px] text-white uppercase">CUSTOM ORDER</h3>
      </div>
    </Link>

    <div className="relative w-full h-[300px] rounded-[30px] overflow-hidden group">
      <video
        src="/comingsoon.MP4"
        className="w-full h-full object-cover"
        autoPlay muted loop playsInline
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>
    </div>
  </div>

  {/* Mobile View */}
  <div className="flex flex-col gap-4 sm:hidden w-full">
    <Link href="/shop" className="relative w-full h-[300px] rounded-[20px] overflow-hidden block group">
      <img
        src="/newrelease.png"
        alt="New Release"
        className="w-full h-full object-cover group-hover:scale-105 transition"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-start items-end p-4 group-hover:bg-black/60 transition">
        <h3 className="font-[koulen] text-[40px] text-white uppercase leading-tight">NEW<br/>RELEASES</h3>
      </div>
    </Link>

    <Link href="/customorder" className="relative w-full h-[250px] rounded-[20px] overflow-hidden block group">
      <img
        src="/customorder .png"
        alt="Custom Order"
        className="w-full h-full object-cover group-hover:scale-105 transition"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-start items-start p-4 group-hover:bg-black/60 transition">
        <h3 className="font-[koulen] text-[36px] text-white uppercase leading-tight">CUSTOM ORDER</h3>
      </div>
    </Link>

    <div className="relative w-full h-[250px] rounded-[20px] overflow-hidden group">
      <video
        src="/comingsoon.MP4"
        className="w-full h-full object-cover"
        autoPlay muted loop playsInline
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>
    </div>
  </div>
</section>

      <Outpost />

      <BannerVerse />

      {/* Our Why Section */}
      <section id='about' className="mt-8 bg-[#9C1A1A] text-white flex flex-col md:flex-row items-center justify-center max-w-[1300px] h-[639px] mx-auto rounded-[30px] overflow-hidden px-8 py-8 gap-6">


{/* Left Side */}
<div className="flex-1 flex flex-col justify-center h-full relative text-left">

  {/* Slanted Label */}
  <div className="absolute top-4 left-0 rotate-[-10deg] bg-[#2B64F6] px-6 py-2 rounded-[10px] text-[40px] font-[koulen] text-white leading-none shadow-lg">
  OUR <span className="text-[#FAF8F7]">why</span>
</div>


  {/* First Paragraph */}
  <p className="mt-16 text-[16px] md:text-[18px] font-bold leading-[160%] uppercase">
    REDACK NATION IS A CHRISTIAN FASHION BRAND FOUNDED BY OVIE AKPOBORIE, A DEDICATED
    CHRISTIAN AND CREATIVE DIRECTOR WITH A PASSION FOR BOTH FAITH AND FASHION. WE
    BELIEVE THAT WHAT YOU WEAR CAN BE A POWERFUL FORM OF SELF-EXPRESSION, ESPECIALLY
    WHEN IT COMES TO SHOWCASING YOUR CHRISTIAN MORALS AND BELIEFS. OUR BRAND STANDS
    OUT THROUGH ITS UNIQUE DESIGNS AND COMMITMENT TO USING HIGH-QUALITY FABRICS AND
    TEXTURES, ENSURING THAT EVERY PIECE NOT ONLY LOOKS GREAT BUT FEELS GREAT TOO.
  </p>

  {/* Second Paragraph */}
  <p className="mt-8 text-[16px] md:text-[18px] font-bold leading-[160%] uppercase">
    OVIE'S VISION FOR REDACT NATION GOES BEYOND JUST CLOTHING; IT'S ABOUT BUILDING A
    GOD-LOVING COMMUNITY. WE AIM TO CREATE A SPACE WHERE CHRISTIANS FEEL EMPOWERED
    AND FREE TO EXPRESS THEIR UNWAVERING PASSION FOR CHRIST THROUGH THEIR PERSONAL
    STYLE. EACH GARMENT IS DESIGNED TO INSPIRE AND UPLIFT, ALLOWING YOU TO WEAR YOUR
    FAITH PROUDLY AND STYLISHLY. JOIN US IN CELEBRATING A VIBRANT AND AUTHENTIC
    EXPRESSION OF CHRISTIANITY THROUGH FASHION.
  </p>
</div>

{/* Right Side Image */}
<div
  className="flex justify-center items-center"
  style={{
    width: '491.2px',
    height: '580px',
    borderRadius: '27px',
    backgroundColor: '#9C1A1A',
    overflow: 'hidden',
  }}
>
  <div className="relative w-full h-full rounded-[27px] overflow-hidden">
    <Image
      src="/isaac.png"
      alt="Ovie"
      fill
      className="object-cover"
    />
    {/* Signature Text */}
    <div className="absolute bottom-4 right-4 text-white text-[48px] font-[Leckerli_One]">
      Ovie
    </div>
  </div>
</div>
</section>


      {/* Let's Chat Section */}
      <section className="text-center py-8 px-4 sm:px-6">
  <h2 className="font-[koulen] font-normal text-[32px] sm:text-[48px] leading-[100%] mb-4">
    LET&apos;S CHAT
  </h2>

  <p className="max-w-xl mx-auto font-[koulen] font-normal text-[14px] sm:text-[16px] leading-[130%] tracking-[0%] text-gray-400 mb-6">
    Have a question about our designs, an inquiry about an order, or just want to share your passion for Christian fashion? We'd love to hear from you! <br /><br />
    To stay updated on our latest collections and join our community! <br /><br />
    We're committed to creating a God-loving community and are always here to help. We'll get back to you as soon as possible!
  </p>

  <div className="flex justify-center space-x-2 sm:space-x-4 flex-wrap">
  <a
  href="https://www.instagram.com/redacknation?igsh=M2ZveW1reHlkdmI3" 
  target="_blank" 
  rel="noopener noreferrer"
  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded transition font-[koulen] text-[12px] sm:text-[16px]"
>
  Instagram
</a>

    <a
  href="https://wa.me/2348012345678" 
  target="_blank"
  rel="noopener noreferrer"
  className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded transition font-[koulen] text-[12px] sm:text-[16px]"
>
  WhatsApp
</a>

<a
  href="mailto:redacknation@gmail.com"
  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded transition font-[koulen] text-[12px] sm:text-[16px]"
>
  Gmail
</a>

  </div>
</section>

<Footer/>
    </main>
  );
}
