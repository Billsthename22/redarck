/* eslint-disable @next/next/no-page-custom-font */
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/app/Context/cartcontext";
import CartSidebar from "@/app/components/CartSidebar"; // Import sidebar

export const metadata: Metadata = {
  title: "Redarck",
  description: "Your app description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
          <CartSidebar /> {/* ✅ Always rendered, hidden until toggled */}
        </CartProvider>
      </body>
    </html>
  );
}
