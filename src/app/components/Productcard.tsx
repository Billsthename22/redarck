'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  id: string;
  imageSrc: string;
  title: string;
  price: string;
  route?: string;
  type?: 'product' | 'art';
};

export default function ProductCard({ id, imageSrc, title, price, route = 'product', type }: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);

  // Function to check if image source is valid
  const isValidImageSrc = (src: string) => {
    return src && typeof src === 'string' && src.trim() !== '' && !src.startsWith('blob:');
  };

  // Fallback image URL
  const fallbackImage = '/placeholder.png';
  const imageSource = hasErrored
    ? fallbackImage
    : isValidImageSrc(imageSrc)
    ? imageSrc
    : fallbackImage;

  // Build the correct href based on route and type
  const getHref = () => {
    if (route === 'admindetail' && type) {
      return `/${route}/${id}?type=${type}`;
    }
    // Handle public art and product pages
    if (route === 'Art' || route === 'product') {
      return `/${route}/${id}`;
    }
    return `/${route}/${id}`;
  };

  return (
    <div className="text-white w-[180px] h-[280px] sm:w-[220px] sm:h-[330px] md:w-[280px] md:h-[400px] lg:w-[340px] lg:h-[480px] xl:w-[362px] xl:h-[509px] opacity-100 transform rotate-0 transition-transform hover:scale-105">
      <Link href={getHref()}>
        <div className="relative w-full h-[70%] bg-zinc-300 mb-2 rounded-md overflow-hidden cursor-pointer">
          {/* Skeleton shimmer, shown until the image has actually loaded */}
          {!isLoaded && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-300 bg-[length:200%_100%]"
              style={{ animation: 'skeleton-shimmer 1.5s ease-in-out infinite' }}
              aria-hidden="true"
            />
          )}
          <Image
            src={imageSource}
            alt={title || 'Product'}
            width={400}
            height={400}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            priority
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
              setHasErrored(true);
              setIsLoaded(true);
            }}
          />
        </div>
      </Link>

      <h3 className="text-xs uppercase mt-1">{title}</h3>
      <p className="text-xs font-semibold text-yellow-300">
        ₦{parseFloat(price).toLocaleString('en-NG')}
      </p>
    </div>
  );
}