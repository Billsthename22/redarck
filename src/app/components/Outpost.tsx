// components/OutpostCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/shoot1.png',
  '/shoot2.png',
  '/shoot3.png',
];

const OutpostCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 pb-10 flex justify-center">
      <div className="w-full max-w-[1320px]">
        <h2 className="text-center font-[koulen] text-[79px] font-bold py-4">
          OUTPOST
        </h2>

        <div className="relative w-full h-[600px] rounded-[37px] overflow-hidden group">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={src}
                alt={`Outpost Image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-95"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutpostCarousel;
