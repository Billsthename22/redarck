'use client';

import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
import ProductCard from '../components/Productcard';

export default function ArtPage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      {/* Search Bar */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Looking for"
            className="w-full px-10 py-3 rounded-full bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Products Section */}
      <section className="max-w-screen-xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Placeholder Product Cards */}
          <ProductCard
            id="1"
            imageSrc="/placeholder.png"
            title="Art Piece One"
            price="₦25,000"
          />
          <ProductCard
            id="2"
            imageSrc="/placeholder.png"
            title="Art Piece Two"
            price="₦30,000"
          />
          <ProductCard
            id="3"
            imageSrc="/placeholder.png"
            title="Art Piece Three"
            price="₦40,000"
          />
        </div>
      </section>

      {/* Pagination - Static */}
      <div className="flex justify-center items-center gap-2 py-10">
        <button
          className="w-6 h-6 rounded-sm text-sm bg-gray-500 text-white cursor-not-allowed"
          disabled
        >
          &lt;
        </button>

        <button className="w-6 h-6 rounded-sm text-sm bg-red-700 text-white cursor-default">
          1
        </button>

        <button
          className="w-6 h-6 rounded-sm text-sm bg-gray-500 text-white cursor-not-allowed"
          disabled
        >
          &gt;
        </button>
      </div>
    </main>
  );
}
