'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/Productcard';
import { Search } from 'lucide-react';
import Footer from '../components/Footer';
interface Art {
  _id: string;
  title: string;
  price: string;
  imageSrc: string;
}

export default function ArtPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allArtworks, setAllArtworks] = useState<Art[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchArts();
  }, []);

  const fetchArts = async () => {
    try {
      const res = await fetch('/api/arts');
      if (!res.ok) throw new Error('Failed to fetch artworks');
      const data: Art[] = await res.json();
      setAllArtworks(data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  const filteredArtworks = allArtworks.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const paginatedArtworks = filteredArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPrevious = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const goToNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (

    <main className="bg-black text-white min-h-screen flex flex-col justify-between pt-20">
   
    <Navbar/>

        {/* Heading */}
        <h1 className="text-center text-3xl md:text-4xl font-semibold mb-8 tracking-wide">
          Explore Our Art Collection
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search for art..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-12 py-3 rounded-full bg-zinc-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Products */}
        <section className="max-w-screen-xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">


          {paginatedArtworks.length > 0 ? (
            paginatedArtworks.map(art => (
              <ProductCard
                key={art._id}
                id={art._id}
                imageSrc={art.imageSrc}
                title={art.title}
                price={art.price}
                route="Art"
                type="art"
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No artworks found.</p>
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
      <Footer/>
      </main>

  );
}
