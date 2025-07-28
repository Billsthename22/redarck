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
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      preload="none"
      muted={muted}
      autoPlay={autoplay}
      loop={loop}
      playsInline={playsInline}
    >
      {isVisible && <source src={src} type="video/mp4" />}
    </video>
  );
}
