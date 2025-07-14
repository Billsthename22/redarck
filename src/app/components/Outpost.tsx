'use client';

import React from 'react';
import Image from 'next/image';

export default function Outpost() {
  return (
    <section className="px-6 pb-10 flex justify-center">
      <div className="w-full max-w-[1320px]">
        <h2 className="text-center text-xl font-bold py-4">OUTPOST</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['outpost1.png', 'outpost2.jpg', 'outpost3.jpg'].map((img, index) => (
            <div
              key={index}
              className="relative w-[416px] h-[639px] rounded-[37px] overflow-hidden opacity-100 bg-gray-200 mx-auto"
            >
              <Image
                src={`/${img}`}
                alt={`Outpost Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
