'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';

type Product = {
  _id: string;
  title: string;
  price: number | string;
  description: string;
  imageSrc: string;
  colorImages?: string[];
  colors?: string[];
};

export default function ProductPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (!productId) return;

    fetch(`/api/arts/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
        // Set default selections if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
        id: product._id,
        title: product.title,
        price: String(product.price),
        description: product.description,
        image: product.imageSrc,
        imageSrc: product.imageSrc,
        colors: product.colors,
        selectedColor: selectedColor,
        quantity: 0
    });
  };

  if (loading) return <div className="text-white p-10">Loading product...</div>;
  if (!product) return <div className="text-red-500 p-10">Product not found.</div>;

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
              src={isValidImage(product?.imageSrc) ? product.imageSrc : '/placeholder.png'}
              alt={product?.title || 'Product Image'}
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
          {product.colorImages && product.colorImages.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {product.colorImages.map((src: string, i: number) => (
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

        {/* Right: Product Details */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold text-red-400">{product.price}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

          
            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm uppercase mb-2 font-semibold">Colour</label>
                <select 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-zinc-800 border border-gray-600 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  {product.colors.map((color: string, i: number) => (
                    <option key={i} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Selected Options Display */}
            {(selectedSize || selectedColor) && (
              <div className="bg-zinc-800 p-4 rounded-md">
                <h3 className="text-sm font-semibold mb-2">Selected Options:</h3>
                <div className="flex gap-4 text-sm">
                  {selectedSize && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded">
                      Size: {selectedSize}
                    </span>
                  )}
                  {selectedColor && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded">
                      Color: {selectedColor}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full mt-6 py-4 px-8 font-bold text-white bg-red-500 hover:bg-red-600 transition-colors rounded-md"
            >
              ADD TO CART
            </button>
          </div>
        </div>
    </main>
  );
}