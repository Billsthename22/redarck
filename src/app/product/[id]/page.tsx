'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

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
        setRelatedProducts(shuffled.slice(0, 4));
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

  if (loading) return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">Processing Collection</p>
    </div>
  );
  
  if (!product) return (
    <div className="bg-black min-h-screen flex items-center justify-center text-zinc-500 uppercase tracking-widest text-xs">
      Item not found. <Link href="/shop" className="text-white ml-2 underline">Back to Shop</Link>
    </div>
  );

  const maxChars = 150;
  const shouldTruncate = product.description.length > maxChars;
  const displayedDescription = isExpanded
    ? product.description
    : product.description.slice(0, maxChars) + (shouldTruncate ? '...' : '');

  return (
    <div className="bg-black text-zinc-200 min-h-screen selection:bg-red-500/50">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-32 pb-24">
        {/* Navigation */}
        <div className="mb-10">
          <Link href="/shop" className="inline-flex items-center text-[10px] uppercase tracking-[0.4em] text-zinc-500 hover:text-red-500 transition-colors">
            <span className="text-lg mr-2 leading-none">←</span> Return to Catalog
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: Visuals */}
          <div className="w-full lg:w-3/5 space-y-6">
            <div className="relative aspect-[4/5] w-full bg-zinc-900/30 rounded-3xl overflow-hidden group">
                <Image
                    src={product.imageSrc}
                    alt={product.title}
                    fill
                    className="object-contain p-6 md:p-16 transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* RIGHT: Configuration */}
          <div className="w-full lg:w-2/5 space-y-12 py-4">
            <section className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-[0.9] text-white italic">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <p className="text-3xl font-light text-red-500">
                  ₦{finalPrice.toLocaleString()}
                </p>
                <div className="h-4 w-[1px] bg-zinc-800" />
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">In Stock / Free Delivery</p>
              </div>
            </section>

            {/* Quality Select */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Selection Grade</p>
              <div className="grid grid-cols-2 gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                {['Standard', 'Premium'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setShirtQuality(q as 'Standard' | 'Premium')}
                    className={`py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      shirtQuality === q 
                      ? 'bg-zinc-800 text-white shadow-xl' 
                      : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Color Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.sizes?.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border text-[11px] font-bold transition-all ${
                          selectedSize === size
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Colorway</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 px-4 flex items-center justify-center rounded-lg border text-[10px] uppercase font-bold tracking-tighter transition-all ${
                          selectedColor === color
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-500'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <p className="text-zinc-500 text-sm leading-relaxed italic font-light">
                {displayedDescription}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  {isExpanded ? '[-] Less' : '[+] Details'}
                </button>
              )}
            </div>

            {/* Final Action */}
            <button
              onClick={handleAddToCart}
              className="w-full relative group overflow-hidden bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.5em] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Add to Cart</span>
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 z-20 transition-opacity duration-300">
                Confirm Order
              </span>
            </button>
          </div>
        </div>

        {/* Related Section */}
{relatedProducts.length > 0 && (
  <section className="mt-40 border-t border-zinc-900 pt-20">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
      <div className="space-y-1">
        <p className="text-red-600 text-[10px] uppercase tracking-[0.5em] font-bold">Recommendations</p>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
          YOU MAY ALSO <span className="text-zinc-600">LIKE</span>
        </h2>
      </div>
      <div className="hidden md:block flex-1 h-[1px] bg-zinc-800/30 mx-10 mb-2" />
      <Link href="/shop" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
        VIEW COLLECTION
      </Link>
    </div>

    {/* The Fixed Grid - This prevents the "jumbled" look */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      {relatedProducts.map((item) => (
        <Link href={`/product/${item._id}`} key={item._id} className="group">
          {/* Image Container: Enforces 4:5 aspect ratio so all items are perfectly aligned */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 mb-4">
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Text alignment: Matches your image style */}
          <div className="space-y-1">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-white group-hover:text-red-500 transition-colors">
              {item.title}
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">
              ₦{parsePrice(item.price).toLocaleString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </section>
)}

      </main>

      <Footer />
    </div>
  );
}