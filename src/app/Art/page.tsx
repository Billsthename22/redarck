'use client';

import Navbar from '../components/Navbar';
//import Footer from '../components/Footer';
// import { useState, useEffect } from 'react';
// import ProductCard from '../components/Productcard';
// import { Search } from 'lucide-react';

// interface Art {
//   _id: string;
//   title: string;
//   price: string;
//   imageSrc: string;
// }

export default function ArtPage() {
  // const [searchQuery, setSearchQuery] = useState('');
  // const [allArtworks, setAllArtworks] = useState<Art[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 9;

  // useEffect(() => {
  //   fetchArts();
  // }, []);

  // const fetchArts = async () => {
  //   try {
  //     const res = await fetch('/api/arts');
  //     if (!res.ok) throw new Error('Failed to fetch artworks');
  //     const data: Art[] = await res.json();
  //     setAllArtworks(data);
  //   } catch (error) {
  //     console.error('Error fetching artworks:', error);
  //   }
  // };

  // const filteredArtworks = allArtworks.filter(art =>
  //   art.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  // const paginatedArtworks = filteredArtworks.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // const goToPrevious = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  // const goToNext = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(e.target.value);
  //   setCurrentPage(1);
  // };

  return (
    <main className="bg-black text-white min-h-screen flex flex-col justify-center items-center text-center pt-20 px-4">
      <Navbar />

      <div>
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">This Page is Under Construction</h1>
        <p className="text-lg text-gray-400">We're working hard to bring this page to life. Please check back soon.</p>
      </div>


    </main>
  );
}
