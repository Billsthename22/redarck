/* eslint-disable @next/next/no-page-custom-font */
// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/app/Context/cartcontext";
import CartSidebar from "@/app/components/CartSidebar";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.redacknation.com"),

  title: {
    default: "Redack Nation",
    template: "%s | Redack Nation",
  },

  description:
    "Redack Nation is a Nigerian Christian fashion and streetwear brand.",

  openGraph: {
    title: "Redack Nation",
    description:
      "Redack Nation is a Nigerian Christian fashion and streetwear brand.",
    siteName: "Redack Nation",
    url: "https://www.redacknation.com",
    type: "website",
  },

  alternates: {
    canonical: "https://www.redacknation.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Redack Nation",
    alternateName: "Redack",
    url: "https://www.redacknation.com/",
  };

  return (
    <html lang="en">
      <head>
        {/* Google Site Name / Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Koulen&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Konkhmer+Sleokchher&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Kristi&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Leckerli+One&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="antialiased">
        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>

        <Analytics />
      </body>
    </html>
  );
}