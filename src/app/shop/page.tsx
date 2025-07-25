/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/Productcard';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setAllProducts(data);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(Math.ceil(filteredProducts.length / itemsPerPage), 1);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <main className="bg-black text-white min-h-screen flex flex-col justify-between pt-20">

      <Navbar />

      {/* Search */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Looking for"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-10 py-3 rounded-full bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Products */}
      <section className="max-w-screen-xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map(product => (
              <ProductCard
                key={product._id}
                id={product._id}
                imageSrc={product.imageSrc}
                title={product.title}
                price={product.price}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No products found.</p>
          )}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 py-10">
        <button
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className={`w-8 h-8 rounded-sm text-sm font-semibold ${
            currentPage === 1
              ? 'bg-gray-600 text-white cursor-not-allowed'
              : 'bg-white text-black hover:bg-red-500 hover:text-white'
          }`}
        >
          &lt;
        </button>

        <span className="w-8 h-8 flex items-center justify-center rounded-sm text-sm font-bold bg-red-700 text-white">
          {currentPage}
        </span>

        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 rounded-sm text-sm font-semibold ${
            currentPage === totalPages
              ? 'bg-gray-600 text-white cursor-not-allowed'
              : 'bg-white text-black hover:bg-red-500 hover:text-white'
          }`}
        >
          &gt;
        </button>
      </div>
    </main>
  );
}
