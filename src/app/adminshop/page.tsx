'use client';

import Adminnavbar from '@/app/components/Adminnavbar'
import { useState, useEffect } from 'react';
import { Search, Plus, UploadCloud } from 'lucide-react';
import ProductCard from '../components/Productcard';

export default function AdminShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [colorPreviews, setColorPreviews] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [colorImageFiles, setColorImageFiles] = useState<File[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');

  // Fetch products from database
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  // Pagination logic
  const itemsPerPage = 9;
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPrevious = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const goToNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  // Save product
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('colors', colors);
    formData.append('sizes', sizes);
  
    if (imageFile) {
      formData.append('image', imageFile);
    }
    colorImageFiles.forEach((file) => {
      formData.append('colorImages', file);
    });
  
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) {
        const savedProduct = await res.json();
        setAllProducts((prev) => [...prev, savedProduct]);
        alert('✅ Product added successfully!');
        setIsModalOpen(false);
        resetForm();
      } else {
        const err = await res.json();
        console.error('❌ Upload failed:', err);
        alert('❌ Failed to save product: ' + err.error);
      }
    } catch (err) {
      console.error('❌ Error sending product:', err);
      alert('❌ Network error while saving product');
    }
  };
  

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setDescription('');
    setColors('');
    setSizes('');
    setPreviewImage(null);
    setColorPreviews([]);
    setImageFile(null);
    setColorImageFiles([]);
  };

  return (
    <main className="bg-black text-white min-h-screen flex flex-col justify-between">
      <Adminnavbar />

      {/* Search + Add Button */}
      <div className="flex justify-center mt-8 mb-4 relative">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Looking for"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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

      {/* Product Cards */}
      <section className="max-w-screen-xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                imageSrc={product.imageSrc}
                title={product.title}
                price={product.price}
                route="admindetail"
                type='product'
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No products found.</p>
          )}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 py-10">
        <button onClick={goToPrevious} disabled={currentPage === 1} className="w-6 h-6 bg-white text-black rounded-sm text-sm">
          &lt;
        </button>
        <button className="w-6 h-6 bg-red-700 text-white rounded-sm text-sm">{currentPage}</button>
        <button onClick={goToNext} disabled={currentPage === totalPages} className="w-6 h-6 bg-white text-black rounded-sm text-sm">
          &gt;
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div className="bg-black text-white w-full max-w-lg p-6 rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>

            <div className="space-y-4">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white" />
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white" />
              <input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Available Colors (e.g. Red, Black)" className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white" />
              <input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="Available Sizes (e.g. S, M, L)" className="w-full border border-gray-600 bg-zinc-900 px-4 py-2 rounded text-white" />

              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <label className="flex flex-col items-center justify-center border border-dashed border-gray-600 p-6 rounded cursor-pointer text-gray-400 hover:bg-zinc-800">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span>Click to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                        setImageFile(file);
                      }
                    }}
                  />
                </label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded"
                    onError={() => setPreviewImage(null)}
                  />
                )}
              </div>

              {/* Color Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Color Images</label>
                <label className="flex flex-col items-center justify-center border border-dashed border-gray-600 p-6 rounded cursor-pointer text-gray-400 hover:bg-zinc-800">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span>Click to upload multiple</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setColorImageFiles(files);
                      setColorPreviews(files.map((file) => URL.createObjectURL(file)));
                    }}
                  />
                </label>
                {colorPreviews.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {colorPreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`color-${i}`}
                        className="w-16 h-16 object-cover rounded border border-gray-600"
                        onError={() => console.warn(`Color image ${i} failed to load`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleSave} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold">
                Save
              </button>
            </div>

            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-4 text-gray-500 text-xl">
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}