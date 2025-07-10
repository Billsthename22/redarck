'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';

export default function ProductPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const productId = params?.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (!productId) return;

    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
        // Set default selections
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
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.imageSrc,
      imageSrc: product.imageSrc,
      colors: product.colors,
      sizes: product.sizes,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
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
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {product.colorImages?.map((src: string, i: number) => (
              <div
                key={i}
                className="w-[60px] h-[60px] overflow-hidden rounded-md bg-zinc-500"
              >
                <Image
                  src={isValidImage(src) ? src : '/placeholder.png'}
                  alt={`Color ${i}`}
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold text-red-400">{product.price}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

          <div className="space-y-4">
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm uppercase mb-2 font-semibold">Size</label>
                <select 
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-zinc-800 border border-gray-600 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {product.sizes.map((size: string, i: number) => (
                    <option key={i} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm uppercase mb-2 font-semibold">Colour</label>
                <select 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-zinc-800 border border-gray-600 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {product.colors.map((color: string, i: number) => (
                    <option key={i} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Selected Options Display */}
          <div className="bg-zinc-800 p-4 rounded-md">
            <h3 className="text-sm font-semibold mb-2">Selected Options:</h3>
            <div className="flex gap-4 text-sm">
              {selectedSize && (
                <span className=" bg-red-500 text-black px-2 py-1 rounded">
                  Size: {selectedSize}
                </span>
              )}
              {selectedColor && (
                <span className=" bg-red-500 text-black px-2 py-1 rounded">
                  Color: {selectedColor}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-6 py-4 px-8 font-bold text-black bg-red-500 hover:bg-red-700 transition-colors rounded-md"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </main>
  );
}