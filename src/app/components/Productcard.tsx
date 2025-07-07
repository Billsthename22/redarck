'use client';

import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  id: string;
  imageSrc: string;
  title: string;
  price: string;
};

export default function ProductCard({ id, imageSrc, title, price }: ProductCardProps) {
  return (
    <div
      className="text-white"
      style={{
        width: '362px',
        height: '509px',
        opacity: 1,
        transform: 'rotate(0deg)',
      }}
    >
      <Link href={`/product/${id}`}>
        <div className="w-full h-[400px] bg-zinc-300 mb-2 rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105">
          <Image
            src={imageSrc}
            alt={title}
            width={362}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </Link>

      <h3 className="text-xs uppercase mt-1">{title}</h3>
      <p className="text-xs">{price}</p>
    </div>
  );
}
