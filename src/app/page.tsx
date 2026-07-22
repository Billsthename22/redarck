'use client';
 
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';
import BannerVerse from './components/BannerVerse';
import Outpost from './components/Outpost';
import Footer from './components/Footer';
import Buffer from './components/buffer';
 
// Reusable shimmer overlay — shown until the media it sits on top of has loaded
function Skeleton({ show, rounded = '' }: { show: boolean; rounded?: string }) {
  if (!show) return null;
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 bg-[length:200%_100%] ${rounded}`}
      style={{ animation: 'skeleton-shimmer 1.5s ease-in-out infinite' }}
      aria-hidden="true"
    />
  );
}
 
export default function Home() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [desktopInView, setDesktopInView] = useState(false);
  const [mobileInView, setMobileInView] = useState(false);
 
  // Tracks whether the hero videos have actually loaded a frame yet,
  // so we can keep the placeholder visible (crossfade) instead of a blank flash
  const [desktopVideoLoaded, setDesktopVideoLoaded] = useState(false);
  const [mobileVideoLoaded, setMobileVideoLoaded] = useState(false);
 
  // Generic loaded-state tracker for all the one-off Images/videos below
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const markLoaded = useCallback((id: string) => {
    setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);
  const isLoaded = (id: string) => !!loaded[id];
 
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.3,
    };
 
    const desktopObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setDesktopInView(true);
          desktopObserver.disconnect();
        }
      });
    }, observerOptions);
 
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setMobileInView(true);
          mobileObserver.disconnect();
        }
      });
    }, observerOptions);
 
    if (desktopRef.current) desktopObserver.observe(desktopRef.current);
    if (mobileRef.current) mobileObserver.observe(mobileRef.current);
 
    return () => {
      desktopObserver.disconnect();
      mobileObserver.disconnect();
    };
  }, []);
 
  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Buffer />
      <Navbar />
 
      {/* ✅ Responsive Hero Section with Lazy Loaded Videos */}
      <section className="relative w-full bg-black px-6 pt-[100px] pb-12">
 
        {/* Desktop Video Section */}
        <div
          ref={desktopRef}
          className="relative w-full max-w-[1296px] mx-auto aspect-[1296/702] overflow-hidden shadow-lg rounded-[36px] sm:block hidden"
        >
          {/* Placeholder image stays mounted and fades out once the video is actually ready,
              so there's never a blank/skeleton gap once we're in view */}
          <Image
            src="/lazyimageweb.jpg"
            alt="Hero Preview Desktop"
            fill
            className={`object-cover transition-opacity duration-700 ${
              desktopInView && desktopVideoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            onLoad={() => markLoaded('hero-desktop-img')}
          />
          <Skeleton show={!isLoaded('hero-desktop-img')} />
 
          {desktopInView && (
            <video
              src="/bg_3.mp4"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                desktopVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setDesktopVideoLoaded(true)}
            />
          )}
 
          {/* Desktop Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 pt-[100px]">
            <h1 className="text-5xl font-bold mb-4 leading-tight text-white">
              LET MY LIGHT SO <span className="font-[Leckerli_One]">shine</span>
            </h1>
            <h3 className="text-xl mb-6 text-white">Not your regular fashion brand</h3>
            <Link href="/shop">
              <button className="bg-yellow-600 font-[koulen] hover:bg-yellow-700 text-black px-8 py-4 rounded-full text-xl transition duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
 
        {/* Mobile Video Section */}
        <div
          ref={mobileRef}
          className="relative w-full block sm:hidden rounded-[24px] overflow-hidden aspect-[3/4]"
        >
          <Image
            src="/lazyimagemobile.jpg"
            alt="Hero Preview Mobile"
            fill
            className={`object-cover transition-opacity duration-700 ${
              mobileInView && mobileVideoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            onLoad={() => markLoaded('hero-mobile-img')}
          />
          <Skeleton show={!isLoaded('hero-mobile-img')} />
 
          {mobileInView && (
            <video
              src="/mobile redacknation bg_1.mp4"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                mobileVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setMobileVideoLoaded(true)}
            />
          )}
 
          {/* Mobile Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-4 pt-[140px]">
            <h1 className="text-[32px] font-bold mb-2 leading-tight text-white">
              LET MY LIGHT SO <span className="font-[Leckerli_One]">shine</span>
            </h1>
            <h3 className="text-[16px] mb-4 text-white">Not your regular fashion brand</h3>
            <Link href="/shop">
              <button className="bg-yellow-600 font-[koulen] hover:bg-yellow-700 text-black px-8 py-4 rounded-full text-xl transition duration-300">
                Shop Now
              </button>
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
          <Link
            href="/shop"
            className="relative w-[640px] h-[639px] rounded-[37px] overflow-hidden block group"
          >
            <Skeleton show={!isLoaded('new-release-desktop')} />
            <Image
              src="/newrelease3.jpeg"
              alt="New Release"
              fill
              className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                isLoaded('new-release-desktop') ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}
              onLoad={() => markLoaded('new-release-desktop')}
            />
            <div className="absolute inset-0 bg-black/40 flex justify-start items-end p-6 group-hover:bg-black/60 transition">
              <h3 className="font-[koulen] text-[100px] leading-[100%] text-white uppercase">
                NEW
                <br />
                RELEASES
              </h3>
            </div>
          </Link>
 
          {/* Right Column */}
          <div className="flex flex-col justify-between gap-4">
            <Link
              href="/customorder"
              className="relative w-[640px] h-[310px] rounded-[37px] overflow-hidden block group"
            >
              <Skeleton show={!isLoaded('custom-order-desktop')} />
              <Image
                src="/customorder .png"
                alt="Custom Order"
                fill
                className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                  isLoaded('custom-order-desktop') ? 'opacity-100' : 'opacity-0'
                } transition-opacity`}
                onLoad={() => markLoaded('custom-order-desktop')}
              />
              <div className="absolute inset-0 bg-black/40 flex justify-start items-start p-6 group-hover:bg-black/60 transition">
                <h3 className="font-[koulen] text-[96px] text-white uppercase leading-tight">
                  CUSTOM
                  <br />
                  ORDER
                </h3>
              </div>
            </Link>
 
            <div className="relative w-[640px] h-[310px] rounded-[37px] overflow-hidden group">
              <Skeleton show={!isLoaded('coming-soon-desktop')} />
              <video
                src="/comingsoon.MP4"
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isLoaded('coming-soon-desktop') ? 'opacity-100' : 'opacity-0'
                }`}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => markLoaded('coming-soon-desktop')}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
            </div>
          </div>
        </div>
 
        {/* Tablet View */}
        <div className="hidden sm:flex lg:hidden flex-col gap-4 w-full max-w-[768px]">
          <Link
            href="/shop"
            className="relative w-full h-[400px] rounded-[30px] overflow-hidden block group"
          >
            <Skeleton show={!isLoaded('new-release-tablet')} />
            <Image
              src="/newrelease2.jpeg"
              alt="New Release"
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-700 ${
                isLoaded('new-release-tablet') ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}
              onLoad={() => markLoaded('new-release-tablet')}
            />
            <div className="absolute inset-0 bg-black/40 flex justify-start items-end p-4 group-hover:bg-black/60 transition">
              <h3 className="font-[koulen] text-[64px] text-white uppercase">
                NEW
                <br />
                RELEASES
              </h3>
            </div>
          </Link>
 
          <Link
            href="/customorder"
            className="relative w-full h-[300px] rounded-[30px] overflow-hidden block group"
          >
            <Skeleton show={!isLoaded('custom-order-tablet')} />
            <Image
              src="/customorder .png"
              alt="Custom Order"
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-700 ${
                isLoaded('custom-order-tablet') ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}
              onLoad={() => markLoaded('custom-order-tablet')}
            />
            <div className="absolute inset-0 bg-black/40 flex justify-start items-start p-4 group-hover:bg-black/60 transition">
              <h3 className="font-[koulen] text-[52px] text-white uppercase">
                CUSTOM ORDER
              </h3>
            </div>
          </Link>
 
          <div className="relative w-full h-[300px] rounded-[30px] overflow-hidden group">
            <Skeleton show={!isLoaded('coming-soon-tablet')} />
            <video
              src="/comingsoon.MP4"
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isLoaded('coming-soon-tablet') ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => markLoaded('coming-soon-tablet')}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
          </div>
        </div>
 
        {/* Mobile View */}
        <div className="flex flex-col gap-4 sm:hidden w-full">
          <Link
            href="/shop"
            className="relative w-full h-[300px] rounded-[20px] overflow-hidden block group"
          >
            <Skeleton show={!isLoaded('new-release-mobile')} />
            <Image
              src="/newrelease2.jpeg"
              alt="New Release"
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-700 ${
                isLoaded('new-release-mobile') ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}
              onLoad={() => markLoaded('new-release-mobile')}
            />
            <div className="absolute inset-0 bg-black/40 flex justify-start items-end p-4 group-hover:bg-black/60 transition">
              <h3 className="font-[koulen] text-[40px] text-white uppercase leading-tight">
                NEW
                <br />
                RELEASES
              </h3>
            </div>
          </Link>
 
          <Link
            href="/customorder"
            className="relative w-full h-[250px] rounded-[20px] overflow-hidden block group"
          >
            <Skeleton show={!isLoaded('custom-order-mobile')} />
            <Image
              src="/customorder .png"
              alt="Custom Order"
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-700 ${
                isLoaded('custom-order-mobile') ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}
              onLoad={() => markLoaded('custom-order-mobile')}
            />
            <div className="absolute inset-0 bg-black/40 flex justify-start items-start p-4 group-hover:bg-black/60 transition">
              <h3 className="font-[koulen] text-[36px] text-white uppercase leading-tight">
                CUSTOM ORDER
              </h3>
            </div>
          </Link>
 
          <div className="relative w-full h-[250px] rounded-[20px] overflow-hidden group">
            <Skeleton show={!isLoaded('coming-soon-mobile')} />
            <video
              src="/comingsoon.MP4"
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isLoaded('coming-soon-mobile') ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => markLoaded('coming-soon-mobile')}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
          </div>
        </div>
      </section>
 
      <Outpost />
      <BannerVerse />
 
      {/* Our Why Section */}
      <section
        id="about"
        className="mt-8 max-w-[1300px] mx-auto rounded-[30px] overflow-hidden px-4 py-8 md:px-8 md:py-8"
      >
        {/* Mobile View: Responsive Video (Clickable to Unmute & Expand) */}
        <div className="md:hidden w-full flex justify-center items-center relative">
          <div className="relative w-[491.2px] h-[580px] rounded-[27px] overflow-hidden bg-black">
            <Skeleton show={!isLoaded('about-mobile')} rounded="rounded-[27px]" />
            <video
              src="/ovieabout.mp4"
              loop
              playsInline
              controls
              muted
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isLoaded('about-mobile') ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadedData={() => markLoaded('about-mobile')}
            />
          </div>
        </div>
 
        {/* Desktop View: Red Background + Content */}
        <div className="hidden md:flex flex-row items-center justify-center gap-6 h-full bg-[#9C1A1A] text-white rounded-[30px] p-8">
          {/* Left Side Text */}
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
              OVIE&apos;S VISION FOR REDACK NATION GOES BEYOND JUST CLOTHING; IT&apos;S ABOUT BUILDING A
              GOD-LOVING COMMUNITY. WE AIM TO CREATE A SPACE WHERE CHRISTIANS FEEL EMPOWERED
              AND FREE TO EXPRESS THEIR UNWAVERING PASSION FOR CHRIST THROUGH THEIR PERSONAL
              STYLE. EACH GARMENT IS DESIGNED TO INSPIRE AND UPLIFT, ALLOWING YOU TO WEAR YOUR
              FAITH PROUDLY AND STYLISHLY. JOIN US IN CELEBRATING A VIBRANT AND AUTHENTIC
              EXPRESSION OF CHRISTIANITY THROUGH FASHION.
            </p>
          </div>
 
          {/* Right Side: Desktop Video Styled Like Image */}
          <div
            className="flex justify-center items-center relative"
            style={{
              width: '491.2px',
              height: '580px',
              borderRadius: '27px',
              backgroundColor: '#000',
              overflow: 'hidden',
            }}
          >
            <Skeleton show={!isLoaded('about-desktop')} rounded="rounded-[27px]" />
            <video
              src="/ovieabout.mp4"
              loop
              muted
              playsInline
              controls
              className={`w-full h-full object-cover rounded-[27px] transition-opacity duration-500 ${
                isLoaded('about-desktop') ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadedData={() => markLoaded('about-desktop')}
            />
            <div className="absolute bottom-4 right-4 text-white text-[48px] font-[Leckerli_One] pointer-events-none">
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
        <p className="max-w-xl mx-auto font-[koulen] font-normal text-[14px] sm:text-[16px] leading-[130%] tracking-[0%] text-white-400 mb-6">
          Have a question about our designs, an inquiry about an order, or just want to share
          your passion for Christian fashion? We&apos;d love to hear from you! <br />
          <br />
          To stay updated on our latest collections and join our community! <br />
          <br />
          We&apos;re committed to creating a God-loving community and are always here to help.
          We&apos;ll get back to you as soon as possible!
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
            href="https://wa.me/2348110749341"
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
 
      <Footer />
    </main>
  );
}
 