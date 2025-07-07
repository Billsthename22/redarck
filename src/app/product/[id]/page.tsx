'use client';

import { useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';

export default function ProductPage() {
  const { addToCart } = useCart();

  const product = {
    id: 1,
    title: 'LOREM IPSUM',
    price: 'N20,000',
    image: '/placeholder.png',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    colors: ['/placeholder.png', '/placeholder2.png', '/placeholder3.png'],
    suggestions: [1, 2, 3],
  };

  useEffect(() => {
    document.title = product.title;
  }, []);

  return (
    <main className="bg-black text-white min-h-screen px-4 py-8 space-y-16">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left - Main Image + Scroll Gallery */}
        <div className="md:w-1/2 space-y-4">
          <div className="w-full h-[500px] bg-zinc-700 rounded-md overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Scrollable Color Previews */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button className="bg-white text-black w-8 h-8 rounded">&lt;</button>
            {product.colors.map((src, i) => (
              <div
                key={i}
                className="w-[60px] h-[60px] bg-zinc-400 rounded-md overflow-hidden cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Color ${i}`}
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <button className="bg-white text-black w-8 h-8 rounded">&gt;</button>
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl">{product.price}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

          <div className="space-y-4">
            <label className="block text-sm uppercase text-white">Size</label>
            <select className="w-[395px] h-[43px] bg-black border border-white text-white px-4 py-2">
              <option>Select a size</option>
            </select>

            <label className="block text-sm uppercase text-white">Colour</label>
            <select className="w-[395px] h-[43px] bg-black border border-white text-white px-4 py-2">
              <option>Select a colour</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-white text-black w-6 h-6 text-xs rounded-sm">&lt;</button>
            <button className="bg-red-700 text-white w-6 h-6 text-xs rounded-sm">2</button>
            <button className="bg-white text-black w-6 h-6 text-xs rounded-sm">&gt;</button>
          </div>

          <button
            onClick={() => addToCart(product)}
            style={{ backgroundColor: '#E0AD1A', width: '309px' }}
            className="hover:brightness-110 py-3 font-bold mt-4 text-white"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* You May Also Like */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 uppercase">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {product.suggestions.map((num) => (
            <div key={num} className="space-y-2">
              <div className="w-full h-[300px] bg-zinc-700 rounded-lg" />
              <p className="text-sm uppercase">LOREM IPSUM</p>
              <p className="text-sm">N20,000</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-black p-6 text-sm mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div className="max-w-md">
            <strong>REDARCK NATION</strong> is a Christian fashion brand focused on self
            expression through Christian morals. The designs are unique and has high
            quality fabrics and texture.
          </div>
          <div>
            <h4 className="font-bold uppercase mb-1">Contact Info</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Dolorem veniam aliquam, et culpa ea fugiat veniam, quos.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
