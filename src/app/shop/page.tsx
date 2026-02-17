/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/Productcard';
import Footer from '../components/Footer';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Changed to even number for better 2-column alignment

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

  const goToPrevious = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const goToNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

  return (
    <main className="bg-[#0a0a0a] text-zinc-100 min-h-screen flex flex-col pt-28 md:pt-36">
      <Navbar />

      {/* Header & Search Section */}
      <div className="max-w-screen-xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase italic">
              Shop <span className="text-red-600">All</span>
            </h1>
            <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px] md:text-xs">
              Showing {filteredProducts.length} results
            </p>
          </div>

          <div className="relative group w-full md:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-4 py-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl text-xs md:text-sm font-bold tracking-widest text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all uppercase"
            />
          </div>
        </div>
      </div>

      {/* Products Grid - Now 2 columns on mobile */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-6 flex-1 w-full">
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16">
            {paginatedProducts.map(product => (
              <div key={product._id} className="group">
                <ProductCard
                  id={product._id}
                  imageSrc={product.imageSrc}
                  title={product.title}
                  price={product.price}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 border border-dashed border-zinc-800 rounded-[2rem] bg-zinc-900/10">
            <Search className="text-zinc-800 w-12 h-12 mb-4" />
            <p className="text-zinc-500 text-[10px] md:text-sm font-bold tracking-widest uppercase text-center px-4">
              No products found matching "{searchQuery}"
            </p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 py-16 md:py-24">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="p-3 rounded-full border border-zinc-800 bg-black text-zinc-500 hover:text-red-500 hover:border-red-500 disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-full">
            <span className="text-white font-black text-xs md:text-sm">
              {currentPage} <span className="text-zinc-600 mx-1">/</span> {totalPages}
            </span>
          </div>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="p-3 rounded-full border border-zinc-800 bg-black text-zinc-500 hover:text-red-500 hover:border-red-500 disabled:opacity-20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <Footer />
    </main>
  );
}