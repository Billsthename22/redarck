'use client';
import { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
  src: string;
  poster: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export default function LazyVideo({
  src,
  poster,
  className = '',
  autoplay = true,
  loop = true,
  muted = true,
  playsInline = true
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
          style={{ animation: 'skeleton-shimmer 1.5s ease-in-out infinite' }}
          aria-hidden="true"
        />
      )}
      <video
        ref={videoRef}
        className={`h-full w-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        poster={poster}
        preload="none"
        muted={muted}
        autoPlay={autoplay}
        loop={loop}
        playsInline={playsInline}
        onLoadedData={() => setIsLoaded(true)}
      >
        {isVisible && <source src={src} type="video/mp4" />}
      </video>
      <style jsx>{`
        @keyframes skeleton-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}