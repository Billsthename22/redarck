'use client';

import Navbar from '../components/Navbar';
import { useState } from 'react';
import { Search, Plus, UploadCloud } from 'lucide-react';
import ProductCard from '../components/Productcard';

const allProducts = Array.from({ length: 27 }).map((_, index) => ({
  id: `${index + 1}`,
  imageSrc: '/placeholder.png',
  title: `LOREM IPSUM ${index + 1}`,
  price: '₦20,000',
}));

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [colorPreviews, setColorPreviews] = useState<string[]>([]);

  const itemsPerPage = 9;
  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
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
    <main className="bg-black text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      {/* Search Bar + Add Button */}
      <div className="flex justify-center mt-8 mb-4 relative">
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-4 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black"
        >
          <Plus />
        </button>
      </div>

      {/* Products */}
      <section className="max-w-screen-xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
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
          className={`w-6 h-6 rounded-sm text-sm ${
            currentPage === 1
              ? 'bg-gray-500 text-white cursor-not-allowed'
              : 'bg-white text-black'
          }`}
        >
          &lt;
        </button>
        <button className="w-6 h-6 rounded-sm text-sm bg-red-700 text-white cursor-default">
          {currentPage}
        </button>
        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className={`w-6 h-6 rounded-sm text-sm ${
            currentPage === totalPages
              ? 'bg-gray-500 text-white cursor-not-allowed'
              : 'bg-white text-black'
          }`}
        >
          &gt;
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div className="bg-black text-white w-full max-w-lg p-6 rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white"
              />
              <input
                type="text"
                placeholder="Price"
                className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white"
              />

              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <label className="w-full flex flex-col items-center justify-center border border-dashed border-gray-600 p-6 rounded cursor-pointer text-gray-400 hover:bg-zinc-800 transition">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setPreviewImage(imageUrl);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-4 w-full h-48 object-cover rounded border border-gray-600"
                  />
                )}
              </div>

              <textarea
                placeholder="Description"
                className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white"
              />

              <input
                type="text"
                placeholder="Available Colors (e.g. Red, Black)"
                className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white"
              />
              <input
                type="text"
                placeholder="Available Sizes (e.g. S, M, L, XL)"
                className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white"
              />

              {/* Color Images */}
              <div>
                <label className="block text-sm font-medium mb-1">Color Images</label>
                <label className="w-full flex flex-col items-center justify-center border border-dashed border-gray-600 p-6 rounded cursor-pointer text-gray-400 hover:bg-zinc-800 transition">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm">Click to upload multiple images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const previews = files.map(file =>
                        URL.createObjectURL(file)
                      );
                      setColorPreviews(previews);
                    }}
                    className="hidden"
                  />
                </label>
                {colorPreviews.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {colorPreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Color ${i}`}
                        className="w-16 h-16 object-cover rounded border border-gray-600"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold"
              >
                Save
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
