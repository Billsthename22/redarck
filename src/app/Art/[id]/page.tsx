'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';

export default function ArtPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const artId = params?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (!artId) return;

    fetch(`/api/arts/${artId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch artwork');
        return res.json();
      })
      .then((data) => {
        setArtwork(data);
        setLoading(false);
        // Set default color selection
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [artId]);

  const handleAddToCart = () => {
    addToCart({
      id: artwork._id,
      title: artwork.title,
      price: artwork.price,
      description: artwork.description,
      image: artwork.imageSrc,
      imageSrc: artwork.imageSrc,
      colors: artwork.colors,
      selectedColor: selectedColor,
      quantity: 1,
 
    });
  };

  if (loading) return <div className="text-white p-10">Loading artwork...</div>;
  if (!artwork) return <div className="text-red-500 p-10">Artwork not found.</div>;

  const isValidImage = (src: string) =>
    src && typeof src === 'string' && !src.startsWith('blob:') && src.trim() !== '';

  return (
    <main className="bg-black text-white min-h-screen px-4 py-8 space-y-16">
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left: Main Image & Colors */}
        <div className="md:w-1/2 space-y-4">
          <div className="w-full h-[500px] bg-zinc-700 rounded-md overflow-hidden">
            <Image
              src={isValidImage(artwork?.imageSrc) ? artwork.imageSrc : '/placeholder.png'}
              alt={artwork?.title || 'Artwork Image'}
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
          {artwork.colorImages && artwork.colorImages.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {artwork.colorImages.map((src: string, i: number) => (
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

        {/* Right: Artwork Details */}
        <div className="md:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
              ARTWORK
            </span>
          </div>
          <p className="text-2xl font-semibold text-red-400">{artwork.price}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{artwork.description}</p>

          <div className="space-y-4">
            {/* Color Selector - Only for artworks */}
            {artwork.colors && artwork.colors.length > 0 && (
              <div>
                <label className="block text-sm uppercase mb-2 font-semibold">Available Colors</label>
                <select 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-zinc-800 border border-gray-600 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {artwork.colors.map((color: string, i: number) => (
                    <option key={i} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Selected Options Display */}
          {selectedColor && (
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-sm font-semibold mb-2">Selected Options:</h3>
              <div className="flex gap-4 text-sm">
                <span className="bg-red-500 text-black px-2 py-1 rounded">
                  Color: {selectedColor}
                </span>
              </div>
            </div>
          )}

          {/* Artwork Info */}
          <div className="bg-zinc-800 p-4 rounded-md">
            <h3 className="text-sm font-semibold mb-2 uppercase">Artwork Details</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><span className="text-white">Type:</span> Original Artwork</p>
              <p><span className="text-white">Unique:</span> One of a kind piece</p>
              {artwork.colors && artwork.colors.length > 0 && (
                <p><span className="text-white">Available in:</span> {artwork.colors.join(', ')}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-6 py-4 px-8 font-bold text-black bg-red-500 hover:bg-red-700 transition-colors rounded-md"
          >
            ADD TO CART
          </button>

          {/* Note for artwork purchases */}
          <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-md">
            <p className="text-yellow-400 text-xs">
              ⚠️ <strong>Note:</strong> This is an original artwork. Each piece is unique and may have slight variations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}