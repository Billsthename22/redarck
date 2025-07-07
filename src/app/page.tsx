'use client'
import Link from "next/link";
import Navbar from "./components/Navbar"
import BannerVerse from "./components/BannerVerse"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}

      <section className="relative w-full bg-black px-6 py-6">
  <div className="relative w-full max-w-[1296px] mx-auto aspect-[1296/702] overflow-hidden shadow-lg rounded-[36px]">
    <video
      src="/bg.mp4"
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    />
    <div className="absolute inset-0 flex flex-col items-center justify-start text-white text-center px-4 pt-16">
      <h1 className="text-5xl font-bold mb-4">
        LET MY LIGHT SO <span className="font-[Leckerli_One]">shine</span>
      </h1>
      <h3 className="">Not your regular fashion brand</h3>
      <button className="bg-black px-6 py-3 rounded-full text-lg hover:bg-red-600 transition duration-300">
        Shop Now
      </button>
    </div>
  </div>
</section>



      {/* BannerVerse (Reusable Component) */}
      <BannerVerse />

      {/* Feature Boxes */}
      <section className="px-6 py-8 flex justify-center">
  <div className="flex flex-col sm:flex-row gap-4">

    {/* Left Big Box with Link to /new-releases */}
    <Link href="/shop" className="relative w-[640px] h-[639px] rounded-[37px] overflow-hidden block group">
      <img
        src="/newrelease.png"
        alt="New Release"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex justify-start items-end p-6 transition duration-300 group-hover:bg-black/60">
        <h3 className="font-[koulen] text-[100px] leading-[100%] text-white uppercase">
          NEW<br />RELEASES
        </h3>
      </div>
    </Link>

    {/* Right Column with Two Boxes */}
    <div className="flex flex-col justify-between gap-4">

      {/* Top Small Box with Link to /custom-order */}
      <Link href="/customorder" className="relative w-[640px] h-[310px] rounded-[37px] overflow-hidden block group">
        <img
          src="/customorder .png"
          alt="Custom Order"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex justify-start items-start p-6 transition duration-300 group-hover:bg-black/60">
          <h3 className="font-[koulen] text-[96px] leading-[90%] text-white uppercase">
            CUSTOM<br />ORDER
          </h3>
        </div>
      </Link>

      {/* Bottom Small Box with Link to /coming-soon */}
      <div className="relative w-[640px] h-[310px] rounded-[37px] overflow-hidden group">
  <video
    src="/comingsoon.MP4"
    className="w-full h-full object-cover"
    autoPlay
    muted
    loop
    playsInline
  />
  <div className="absolute inset-0 bg-black/30 flex justify-center items-center transition duration-300 group-hover:bg-black/50">
    <h3 className="font-koulen text-[96px] leading-[100%] text-white uppercase text-center">
      {/* Optional Text */}
    </h3>
  </div>
</div>

    </div>
  </div>
</section>

      {/* Outpost Gallery */}
      <section>
        <h2 className="text-center text-xl font-bold py-4">OUTPOST</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-10">
          <div className="bg-gray-200 h-48" />
          <div className="bg-gray-200 h-48" />
          <div className="bg-gray-200 h-48" />
        </div>
      </section>

      {/* Second BannerVerse */}
      <BannerVerse />

      {/* Chat Section */}
      <section className="text-center py-10 px-6">
        <h2 className="text-2xl font-bold mb-4">LETS CHAT</h2>
        <p className="max-w-xl mx-auto text-gray-400 mb-6">
          JOIN THE MISSION. COMMIT TO SHINING. BE REMINDED YOU&apos;RE CALLED TO LIGHT UP
          EVERY SPACE YOU STEP INTO. LET THIS BE A SYMBOL THAT YOU AREN&apos;T WALKING ALONE
          BUT WITH THE ONE WHO GOES AHEAD OF YOU.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-black px-4 py-2 rounded">Instagram</button>
          <button className="bg-white text-black px-4 py-2 rounded">WhatsApp</button>
          <button className="bg-white text-black px-4 py-2 rounded">Email</button>
        </div>
      </section>
    </main>
  )
}
