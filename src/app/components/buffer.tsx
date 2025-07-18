'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LogoLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flip-logo w-32 h-32">
          <Image
            src="/redack nation 1.png"
            alt="Logo"
            width={128}
            height={128}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Inline CSS for Flip Animation */}
        <style jsx>{`
          .flip-logo {
            animation: flip 2s linear infinite;
          }

          @keyframes flip {
            0% {
              transform: perspective(600px) rotateY(0deg);
            }
            50% {
              transform: perspective(600px) rotateY(180deg);
            }
            100% {
              transform: perspective(600px) rotateY(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div></div>
  );
}
