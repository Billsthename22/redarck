'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Adminnavbar from '@/app/components/Adminnavbar'
import Image from 'next/image';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';

type Product = {
  _id: string;
  title: string;
  price: string;
  description: string;
  imageSrc: string;
  colorImages?: string[];
  colors?: string[];
  sizes?: string[];
};

type Art = {
  _id: string;
  title: string;
  price: string;
  description: string;
  imageSrc: string;
  colorImages?: string[];
  colors?: string[];
};

type Item = Product | Art;

export default function AdminDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = params?.id;
  const type = searchParams.get('type') || 'product'; // Default to product

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    colors: '',
    sizes: '', // Only for products
  });

  // Determine if it's an art piece
  const isArt = type === 'art';
  const apiEndpoint = isArt ? `/api/arts/${itemId}` : `/api/products/${itemId}`;
  const backRoute = isArt ? '/adminart' : '/adminshop';
  const itemType = isArt ? 'Artwork' : 'Product';

  // Fetch item from database
  useEffect(() => {
    if (!itemId) return;

    fetch(apiEndpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${itemType.toLowerCase()}`);
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setFormData({
          title: data.title || '',
          price: data.price || '',
          description: data.description || '',
          colors: Array.isArray(data.colors) ? data.colors.join(', ') : '',
          sizes: Array.isArray(data.sizes) ? data.sizes.join(', ') : '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [itemId, apiEndpoint, itemType]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.price.trim()) {
      alert('Please fill in all required fields (Title and Price)');
      return;
    }

    try {
      const bodyData = {
        title: formData.title,
        price: formData.price,
        description: formData.description,
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      };

      // Only add sizes for products, not art
      if (!isArt) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (bodyData as any).sizes = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
      }

      const res = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setItem(updatedItem);
        alert(`✅ ${itemType} updated successfully!`);
        setIsModalOpen(false);
      } else {
        alert(`❌ Failed to update ${itemType.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error updating ${itemType.toLowerCase()}:`, error);
      alert(`❌ Error updating ${itemType.toLowerCase()}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${itemType.toLowerCase()}? This action cannot be undone.`)) return;

    try {
      const res = await fetch(apiEndpoint, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert(`✅ ${itemType} deleted successfully!`);
        router.push(backRoute);
      } else {
        alert(`❌ Failed to delete ${itemType.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType.toLowerCase()}:`, error);
      alert(`❌ Error deleting ${itemType.toLowerCase()}`);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-xl">Loading {itemType.toLowerCase()}...</p>
        </div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">{itemType} not found</h1>
          <button 
            onClick={() => router.push(backRoute)}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded text-white"
          >
            Back to Admin {isArt ? 'Art' : 'Shop'}
          </button>
        </div>
      </main>
    );
  }

  const isValidImage = (src: string) =>
    src && typeof src === 'string' && !src.startsWith('blob:') && src.trim() !== '';

  return (
    <main className="bg-black text-white min-h-screen px-4 py-8">
      <Adminnavbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <button 
          onClick={() => router.push(backRoute)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to {isArt ? 'Artworks' : 'Products'}
        </button>
      </div>

      {/* Item Details */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left: Image */}
        <div className="md:w-1/2 space-y-4">
          <div className="w-full h-[500px] bg-zinc-700 rounded-md overflow-hidden">
            <Image
              src={isValidImage(item?.imageSrc) ? item.imageSrc : '/placeholder.png'}
              alt={item?.title || `${itemType} Image`}
              width={500}
              height={500}
              className="w-full h-full object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.png';
              }}
            />
          </div>

          {/* Color Images */}
          {item.colorImages && item.colorImages.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {item.colorImages.map((src: string, i: number) => (
                <div
                  key={i}
                  className="w-[60px] h-[60px] overflow-hidden rounded-md bg-zinc-500 flex-shrink-0"
                >
                  <Image
                    src={isValidImage(src) ? src : '/placeholder.png'}
                    alt={`Color ${i}`}
                    width={60}
                    height={60}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Item Info */}
        <div className="md:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
              {isArt ? 'ART' : 'PRODUCT'}
            </span>
          </div>
          <p className="text-2xl font-semibold text-red-400">{item.price}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>

          {/* Colors Display */}
          {item.colors && item.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 uppercase">Available Colors</h3>
              <div className="flex gap-2 flex-wrap">
                {item.colors.map((color: string, i: number) => (
                  <span key={i} className="bg-zinc-800 px-3 py-1 rounded-md text-sm">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sizes Display - Only for products */}
          {!isArt && (item as Product).sizes && (item as Product).sizes!.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 uppercase">Available Sizes</h3>
              <div className="flex gap-2 flex-wrap">
                {(item as Product).sizes!.map((size: string, i: number) => (
                  <span key={i} className="bg-zinc-800 px-3 py-1 rounded-md text-sm">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              <Pencil className="w-4 h-4" />
              Edit {itemType}
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          {/* Item ID for admin reference */}
          <div className="bg-zinc-800 p-4 rounded-md">
            <h3 className="text-sm font-semibold mb-2">Admin Info</h3>
            <p className="text-xs text-gray-400">{itemType} ID: {item._id}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div className="bg-black text-white w-full max-w-lg p-6 rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh] border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Edit {itemType}</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                type="text"
                placeholder="Price *"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <input
                type="text"
                placeholder="Available Colors (e.g., Red, Black, Blue)"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              
              {/* Only show sizes field for products */}
              {!isArt && (
                <input
                  type="text"
                  placeholder="Available Sizes (e.g., S, M, L, XL)"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full border border-gray-600 px-4 py-2 rounded bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded text-gray-300 border border-gray-600 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded text-white font-semibold transition"
              >
                Save Changes
              </button>
            </div>

            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white text-lg absolute top-3 right-4"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </main>
  );
}