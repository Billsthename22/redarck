'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = ['/shoot1.png', '/shoot22.jpeg', '/shoot33.jpeg'];
const hoverTexts = ['JOIN', 'REDACK', 'ARMY'];

export default function OutpostSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  return (
    <section className="px-6 pb-10 flex justify-center">
      <div className="w-full max-w-[1320px]">
        <h2 className="text-center font-[koulen] text-[60px] md:text-[79px] font-bold py-4">OUTPOST</h2>
     {/* Desktop View */}
{!isMobile && (
  <div className="grid grid-cols-3 gap-0 md:gap-2"> {/* Smaller gap on desktop */}
    {images.map((src, index) => (
      <div key={index} className="relative group w-full h-[400px] rounded-[20px] overflow-hidden">
        <Image
          src={src}
          alt={`Outpost Image ${index + 1}`}
          width={500}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
          <span className="text-white text-[32px] font-[koulen]">{hoverTexts[index]}</span>
        </div>
      </div>
    ))}
  </div>
)}


        {/* Mobile View */}
        {isMobile && (
          <div className="relative w-full h-[500px] rounded-[30px] overflow-hidden">
            {images.map((src, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
                  index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image
                  src={src}
                  alt={`Outpost Mobile ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
