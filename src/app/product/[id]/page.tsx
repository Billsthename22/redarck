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

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

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
          <p className="text-2xl">{product.price}</p>
          <p className="text-sm text-gray-300">{product.description}</p>

          <div className="space-y-4">
            <label className="block text-sm uppercase">Size</label>
            <select className="w-full bg-black border border-white text-white px-4 py-2">
              {product.sizes?.map((size: string, i: number) => (
                <option key={i}>{size}</option>
              ))}
            </select>

            <label className="block text-sm uppercase">Colour</label>
            <select className="w-full bg-black border border-white text-white px-4 py-2">
              {product.colors?.map((color: string, i: number) => (
                <option key={i}>{color}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-4 py-3 px-8 font-bold text-white"
            style={{ backgroundColor: '#E0AD1A' }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </main>
  );
}
