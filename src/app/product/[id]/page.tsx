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
  colorImages?: string[]; // Added to capture secondary view images
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
  
  // Track active main image view state
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.imageSrc || ''); // Initialize active view
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

  // Aggregate main image with secondary views 
  const allImages = [
    product.imageSrc,
    ...(product.colorImages || [])
  ].filter((src) => src && src.trim() !== '');

  return (
    <div className="bg-black text-zinc-200 min-h-screen selection:bg-red-500/50">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-32 pb-24">
        {/* Navigation */}
        <div className="mb-10">
          <Link href="/shop" className="inline-flex items-center text-[10px] uppercase tracking-[0.4em] text-zinc-500 hover:text-red-500 transition-colors">
            <span className="text-lg mr-2 leading-none">←</span> Return to Catalog
          </Link>
        </div>

        {/* Clean 50/50 Layout Grid split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Visuals & Gallery Carousel (Controlled size container) */}
          <div className="w-full lg:w-1/2 space-y-4 mx-auto max-w-[500px] lg:max-w-none">
            {/* Main Window Frame */}
            <div className="relative aspect-[4/5] w-full bg-zinc-900/20 rounded-2xl overflow-hidden group max-h-[480px] lg:max-h-[550px]">
                <Image
                    src={activeImage || product.imageSrc}
                    alt={product.title}
                    fill
                    className="object-contain p-8 md:p-12 transition-all duration-500"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Swiper/Click Gallery */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x touch-pan-x justify-center lg:justify-start">
                {allImages.map((src, idx) => {
                  const isActive = activeImage === src;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(src)}
                      className={`relative w-14 h-16 rounded-lg overflow-hidden bg-zinc-900/50 flex-shrink-0 snap-start transition-all border ${
                        isActive 
                          ? 'border-white opacity-100' 
                          : 'border-transparent opacity-40 hover:opacity-80'
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${product.title} perspective view ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Configuration */}
          <div className="w-full lg:w-1/2 space-y-10 py-2">
            <section className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-[0.95] text-white italic">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-light text-red-500">
                  ₦{finalPrice.toLocaleString()}
                </p>
                <div className="h-4 w-[1px] bg-zinc-800" />
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">In Stock / Free Delivery</p>
              </div>
            </section>

            {/* Quality Select */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Selection Grade</p>
              <div className="grid grid-cols-2 gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                {['Standard', 'Premium'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setShirtQuality(q as 'Standard' | 'Premium')}
                    className={`py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {product.sizes?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border text-[11px] font-bold transition-all ${
                          selectedSize === size
                            ? 'bg-white text-black border-white'
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
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Colorway</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-9 px-3 flex items-center justify-center rounded-lg border text-[10px] uppercase font-bold tracking-tighter transition-all ${
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
            <div className="space-y-3 pt-6 border-t border-zinc-900">
              <p className="text-white text-sm leading-relaxed italic font-light">
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
              className="w-full relative group overflow-hidden bg-white text-black py-5 rounded-xl font-black text-xs uppercase tracking-[0.5em] transition-all hover:scale-[1.01] active:scale-[0.99]"
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
          <section className="mt-32 border-t border-zinc-900 pt-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div className="space-y-1">
                <p className="text-red-600 text-[10px] uppercase tracking-[0.5em] font-bold">Recommendations</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">
                  YOU MAY ALSO <span className="text-zinc-600">LIKE</span>
                </h2>
              </div>
              <div className="hidden md:block flex-1 h-[1px] bg-zinc-800/30 mx-10 mb-2" />
              <Link href="/shop" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                VIEW COLLECTION
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item) => (
                <Link href={`/product/${item._id}`} key={item._id} className="group">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 mb-3 rounded-xl max-h-[320px]">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>
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