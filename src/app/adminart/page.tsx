'use client';

import Adminnavbar from '@/app/components/Adminnavbar';
import ProductCard from '@/app/components/Productcard';
import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export default function AdminArtPage() {
  // Search & pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal & preview states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [colorPreviews, setColorPreviews] = useState<string[]>([]);

  // File inputs
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [colorImageFiles, setColorImageFiles] = useState<File[]>([]);

  // Artwork type
  interface Art {
    _id: string;
    title: string;
    price: string;
    imageSrc: string;
    description?: string;
    colors?: string[];
    colorImages?: string[];
  }

  // All artworks
  const [allArtworks, setAllArtworks] = useState<Art[]>([]);

  // ——— Data Fetching ———
  const fetchArts = useCallback(async () => {
    try {
      const res = await fetch('/api/arts');
      if (!res.ok) throw new Error('Failed to fetch artworks');
      const data = (await res.json()) as Art[];

      console.log('=== FETCHED ARTWORKS ===', data);
      setAllArtworks(data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  }, []);

  useEffect(() => {
    fetchArts();
  }, [fetchArts]);

  // ——— Pagination logic ———
  const itemsPerPage = 9;
  const filteredArtworks = allArtworks.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const paginatedArtworks = filteredArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPrevious = () => currentPage > 1 && setCurrentPage(p => p - 1);
  const goToNext     = () => currentPage < totalPages && setCurrentPage(p => p + 1);

  // ——— Form state & handlers ———
  const [title, setTitle]         = useState('');
  const [price, setPrice]         = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors]       = useState('');

  const resetForm = () => {
    setPreviewImage(null);
    setColorPreviews([]);
    setMainImageFile(null);
    setColorImageFiles([]);
    setTitle('');
    setPrice('');
    setDescription('');
    setColors('');
  };

  const handleSave = async () => {
    console.log('=== SAVING ARTWORK ===', { title, price, mainImageFile, colorImageFiles });
    if (!title || !price || !mainImageFile) {
      alert('❌ Please fill in all required fields and select an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('colors', colors);
    formData.append('image', mainImageFile);
    colorImageFiles.forEach(file => formData.append('colorImages', file));

    try {
      const res = await fetch('/api/arts', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Save failed');
      }
      const savedArt = (await res.json()) as Art;
      console.log('=== SAVED ARTWORK ===', savedArt);
      setAllArtworks(prev => [...prev, savedArt]);
      alert('✅ Art saved successfully');
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving artwork:', error);
      alert('❌ Failed to save artwork');
    }
  };

  return (
    <main className="bg-black text-white min-h-screen flex flex-col justify-between">
      <Adminnavbar />

      {/* Search & Add */}
      <div className="flex justify-center mt-8 mb-4 relative">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Art..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full px-10 py-3 rounded-full bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-4 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white"
        >
          <Plus />
        </button>
      </div>

      {/* Art Cards */}
      <section className="max-w-screen-xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {paginatedArtworks.length > 0 ? (
            paginatedArtworks.map(art => (
              <ProductCard
                key={art._id}
                id={art._id}
                imageSrc={art.imageSrc}
                title={art.title}
                price={art.price}
                route="admindetail"
                type="art"
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No artworks found.</p>
          )}
        </div>
      </section>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 py-10">
        <button onClick={goToPrevious} disabled={currentPage === 1} className="w-6 h-6 bg-white text-black rounded-sm text-sm">
          &lt;
        </button>
        <span className="w-6 h-6 bg-red-700 text-white rounded-sm text-sm flex items-center justify-center">
          {currentPage}
        </span>
        <button onClick={goToNext} disabled={currentPage === totalPages} className="w-6 h-6 bg-white text-black rounded-sm text-sm">
          &gt;
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-zinc-900 text-white w-full max-w-lg p-6 rounded-xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold">Add New Artwork</h2>

            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title *"
              className="w-full p-2 rounded bg-zinc-800"
              required
            />
            <input
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price *"
              className="w-full p-2 rounded bg-zinc-800"
              required
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-2 rounded bg-zinc-800"
            />
            <input
              value={colors}
              onChange={e => setColors(e.target.value)}
              placeholder="Colors (comma separated)"
              className="w-full p-2 rounded bg-zinc-800"
            />

            {/* Main Image Upload */}
            <label className="block p-4 rounded bg-zinc-800 text-center cursor-pointer">
              <UploadCloud className="mx-auto mb-2" />
              Upload Main Image *
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMainImageFile(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
            {previewImage && (
              <Image
                src={previewImage}
                alt="Preview"
                className="w-full rounded object-cover max-h-48"
                width={400}
                height={200}
              />
            )}

            {/* Color Images Upload */}
            <label className="block p-4 rounded bg-zinc-800 text-center cursor-pointer">
              <UploadCloud className="mx-auto mb-2" />
              Upload Color Images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  setColorImageFiles(files);
                  setColorPreviews(files.map(f => URL.createObjectURL(f)));
                }}
              />
            </label>
            {colorPreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {colorPreviews.map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    alt={`Color preview ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-700">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-red-600">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
