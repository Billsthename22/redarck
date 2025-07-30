'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/app/components/Productcard';

interface ProductType {
  _id: string;
  title: string;
  price: string;
  description: string;
  imageSrc: string;
  sizes: string[];
  colors: string[];
}

export default function ProductPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [shirtQuality, setShirtQuality] = useState<'Standard' | 'Premium'>('Standard');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
        setSelectedColor(data.colors?.[0] || '');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        const filtered = data.filter((p: ProductType) => p._id !== productId);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch related products', error);
      }
    };

    fetchRelated();
  }, [productId]);

  const parsePrice = (price: string) => {
    const cleaned = price.replace(/,/g, '');
    const number = parseFloat(cleaned);
    return isNaN(number) ? 0 : number;
  };

  const basePrice = product ? parsePrice(product.price) : 0;
  const finalPrice = shirtQuality === 'Premium' ? basePrice + 7000 : basePrice;

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    addToCart({
      id: product._id,
      title: product.title,
      price: finalPrice.toString(),
      description: product.description,
      image: product.imageSrc,
      imageSrc: product.imageSrc,
      selectedColor,
      selectedSize,
      shirtQuality,
      quantity: 1,
    });
  };

  if (loading) return <div className="text-white p-10">Loading product...</div>;
  if (!product) return <div className="text-red-500 p-10">Product not found.</div>;

  const maxChars = 150;
  const shouldTruncate = product.description.length > maxChars;
  const displayedDescription = isExpanded
    ? product.description
    : product.description.slice(0, maxChars) + (shouldTruncate ? '...' : '');

  return (
    <>
      <Navbar />

      <main className="bg-black text-white min-h-screen px-4 pt-32 pb-20">
        <div className="max-w-7xl mx-auto mb-4">
          <Link href="/shop" className="text-zinc-400 hover:text-white underline">
            ← Back to Products
          </Link>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-12">
          {/* Product Image */}
          <div className="md:w-1/2 w-full flex justify-center items-center">
            <div className="w-[900px] h-[600px] rounded-xl overflow-hidden p-1 flex justify-center items-center shadow-lg">
              <Image
                src={product.imageSrc}
                alt={product.title}
                width={900}
                height={600}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 w-full space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl font-semibold text-red-400">
              ₦{finalPrice.toLocaleString()}
            </p>

            <div className="space-y-4">
              {/* Shirt Quality */}
              <div>
                <label className="block text-sm mb-2 font-semibold">Shirt Quality</label>
                <select
                  value={shirtQuality}
                  onChange={(e) => setShirtQuality(e.target.value as 'Standard' | 'Premium')}
                  className="w-full bg-zinc-800 border border-gray-600 text-white px-4 py-3 rounded-md"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium (+₦7,000)</option>
                </select>
              </div>

              {/* Description */}
              <div className="text-md leading-relaxed text-zinc-400">
                <p>{displayedDescription}</p>
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white-400 underline mt-2"
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>

              {/* Size */}
              {product.sizes?.length > 0 && (
                <div>
                  <label className="block text-sm mb-2 font-semibold">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-zinc-800 border border-gray-600 text-white px-4 py-3 rounded-md"
                  >
                    {product.sizes.map((size, i) => (
                      <option key={i} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color */}
              {product.colors?.length > 0 && (
                <div>
                  <label className="block text-sm mb-2 font-semibold">Color</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full bg-zinc-800 border border-gray-600 text-white px-4 py-3 rounded-md"
                  >
                    {product.colors.map((color, i) => (
                      <option key={i} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full mt-6 py-4 font-bold text-black bg-red-500 hover:bg-red-700 rounded-md"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
  <section className="w-full flex justify-center mt-20">
  <div className="max-w-7xl w-full px-4">
    <h2 className="text-[30px] font-[koulen] mb-4 border-b border-zinc-700 pb-2">
      You May Also Like
    </h2>

    <div className="w-full flex justify-center">
  <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-red-500">
    {relatedProducts.map((item) => (
      <ProductCard
        key={item._id}
        id={item._id}
        imageSrc={item.imageSrc}
        title={item.title}
        price={item.price}
      />
    ))}
  </div>
</div>

  </div>
</section>

        )}
      </main>
    </>
  );
}
