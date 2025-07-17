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
      className="
        text-white 
        w-[180px] h-[280px] 
        sm:w-[220px] sm:h-[330px]
        md:w-[280px] md:h-[400px] 
        lg:w-[340px] lg:h-[480px] 
        xl:w-[362px] xl:h-[509px]
        opacity-100 transform rotate-0 transition-transform hover:scale-105"
    >
      <Link href={`/product/${id}`}>
        <div className="w-full h-[70%] bg-zinc-300 mb-2 rounded-md overflow-hidden cursor-pointer">
          <Image
            src={imageSrc}
            alt={title}
            width={400}
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
