'use client';

import { useState, useEffect } from 'react';
import Adminnavbar from '@/app/components/Adminnavbar';
import Image from 'next/image';
import { Pencil, Trash2, UploadCloud } from 'lucide-react';

export default function AdminArtPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [art, setArt] = useState({
    title: 'Untitled Art',
    price: '₦50,000',
    image: '/placeholder.png',
    description: 'This is a sample art description for display purposes.',
    colors: ['/placeholder.png', '/placeholder2.png'],
  });

  const [formData, setFormData] = useState({
    title: art.title,
    price: art.price,
    description: art.description,
    image: art.image,
    colors: art.colors,
  });

  useEffect(() => {
    document.title = art.title;
  }, [art]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleColorImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, colors: previews }));
  };

  const handleSave = () => {
    setArt({ ...formData });
    setIsModalOpen(false);
    alert('✅ Art updated (local state only)');
  };

  const handleDelete = () => {
    setArt(null);
    alert('✅ Art deleted (local state only)');
  };

  if (!art) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Art has been deleted.</h1>
      </main>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen px-4 py-8 space-y-16">
      <Adminnavbar />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2 space-y-4">
          <div className="w-full h-[500px] bg-zinc-700 rounded-md overflow-hidden">
            <Image
              src={art.image}
              alt={art.title}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {art.colors.map((src, i) => (
              <div key={i} className="w-[60px] h-[60px] rounded-md overflow-hidden">
                <Image src={src} alt={`Color ${i}`} width={60} height={60} className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{art.title}</h1>
          <p className="text-2xl">{art.price}</p>
          <p className="text-sm text-gray-300">{art.description}</p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-yellow-500 text-black font-semibold px-6 py-2 rounded"
            >
              <Pencil className="w-4 h-4" /> Edit Art
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-700 text-white font-semibold px-6 py-2 rounded"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 px-4">
          <div className="bg-black text-white w-full max-w-lg p-6 rounded-xl shadow-2xl space-y-4 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Edit Art</h2>

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border px-4 py-2 rounded bg-zinc-900 text-white"
            />
            <input
              type="text"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border px-4 py-2 rounded bg-zinc-900 text-white"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border px-4 py-2 rounded bg-zinc-900 text-white"
            />
            <label className="block">
              <span className="text-sm font-medium">Art Image</span>
              <label className="flex flex-col items-center justify-center border border-dashed border-gray-500 p-6 mt-1 rounded cursor-pointer hover:bg-zinc-800 transition">
                <UploadCloud className="w-6 h-6 mb-2" />
                <span className="text-xs">Click to upload</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </label>
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded" />
            )}
            <label className="block">
              <span className="text-sm font-medium">Color Images</span>
              <label className="flex flex-col items-center justify-center border border-dashed border-gray-500 p-6 mt-1 rounded cursor-pointer hover:bg-zinc-800 transition">
                <UploadCloud className="w-6 h-6 mb-2" />
                <span className="text-xs">Upload multiple</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleColorImagesChange}
                  className="hidden"
                />
              </label>
            </label>
            <div className="flex gap-2 overflow-x-auto mt-2">
              {formData.colors.map((src, i) => (
                <img key={i} src={src} alt={`Color ${i}`} className="w-16 h-16 object-cover rounded border" />
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleSave}
                className="bg-red-600 px-5 py-2 rounded text-white font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg absolute top-3 right-4"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
