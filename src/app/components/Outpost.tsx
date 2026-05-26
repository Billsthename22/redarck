'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  { src: '/shoot1.png', label: 'JOIN' },
  { src: '/Outpost4.jpeg', label: 'REDACK' },
  { src: '/shoot33.jpeg', label: 'ARMY' },
];

export default function OutpostSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 py-16 bg-black text-white flex justify-center overflow-hidden">
      <div className="w-full max-w-[1320px]">
        {/* Header with Character Spacing */}
        <h2 className="text-center font-[koulen] text-[64px] md:text-[100px] leading-none tracking-tighter mb-12 italic">
          OUTPOST
        </h2>

        {/* Desktop Layout: Editorial Staggered Grid */}
        <div className="hidden md:grid grid-cols-12 gap-6 h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-2xl transition-all duration-700 ease-in-out cursor-pointer
                ${index === 0 ? 'col-span-4 mt-12 h-[500px]' : ''}
                ${index === 1 ? 'col-span-4 h-[600px]' : ''}
                ${index === 2 ? 'col-span-4 mt-20 h-[450px]' : ''}
              `}
            >
              <Image
                src={slide.src}
                alt={slide.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Animated Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <span className="font-[koulen] text-5xl tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {slide.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout: Full-Screen Narrative Slider */}
        <div className="md:hidden relative h-[70vh] w-full rounded-[40px] overflow-hidden shadow-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.label}
                fill
                className="object-cover"
              />
              {/* Mobile Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-xs tracking-[0.3em] uppercase opacity-60 mb-2">Discovery 0{index + 1}</p>
                <h3 className="font-[koulen] text-6xl tracking-tighter">{slide.label}</h3>
              </div>
            </div>
          ))}
          
          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 transition-all duration-500 rounded-full ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}