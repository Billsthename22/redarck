'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Adminnavbar from '@/app/components/Adminnavbar'
import Image from 'next/image';
import { Pencil, Trash, UploadCloud } from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    title: 'LOREM IPSUM',
    price: 'N20,000',
    image: '/placeholder.png',
    description: 'A brief product description...',
    colors: ['/placeholder.png', '/placeholder2.png'],
    sizes: ['S', 'M', 'L'],
    availableColors: ['Black', 'White'],
  },
];

export default function AdminProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [colorPreviews, setColorPreviews] = useState<string[]>([]);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const found = mockProducts.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      setPreviewImage(found.image);
      setColorPreviews(found.colors);
    }
  }, [id]);

  const handleDelete = () => {
    alert('Deleted successfully!');
    router.push('/admin'); // admin product list is
  };

  if (!product) return <div className="text-white p-10">Product not found</div>;

  return (
    <main className="bg-black text-white min-h-screen px-4 py-8">
      <Adminnavbar />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Image */}
        <div className="md:w-1/2 space-y-4">
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-lg object-cover w-full h-[400px]"
          />
          <div className="flex gap-2 overflow-x-auto">
            {product.colors.map((src: string, i: number) => (
              <Image
                key={i}
                src={src}
                alt={`Color ${i}`}
                width={60}
                height={60}
                className="w-16 h-16 rounded object-cover border"
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl text-yellow-400">{product.price}</p>
          <p className="text-gray-300">{product.description}</p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 bg-yellow-500 text-black font-bold px-4 py-2 rounded"
            >
              <Pencil className="w-4 h-4" />
              Edit Design
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
          <div className="bg-black text-white w-full max-w-lg p-6 rounded-xl relative">
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>

            <div className="space-y-4">
              <input
                defaultValue={product.title}
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900"
              />
              <input
                defaultValue={product.price}
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900"
              />
              <textarea
                defaultValue={product.description}
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900"
              />
              <input
                defaultValue={product.availableColors.join(', ')}
                placeholder="Available Colors"
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900"
              />
              <input
                defaultValue={product.sizes.join(', ')}
                placeholder="Available Sizes"
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900"
              />

              {/* Upload Image */}
              <label className="block border border-dashed border-gray-500 p-6 rounded cursor-pointer text-center hover:bg-zinc-800">
                <UploadCloud className="mx-auto mb-2 w-6 h-6 text-gray-400" />
                <span>Change Product Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreviewImage(URL.createObjectURL(file));
                  }}
                  className="hidden"
                />
              </label>

              {previewImage && (
                <img
                  src={previewImage}
                  className="w-full h-48 object-cover rounded mt-2"
                />
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-yellow-500 text-black px-6 py-2 rounded font-bold"
              >
                Save Changes
              </button>
            </div>

            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
