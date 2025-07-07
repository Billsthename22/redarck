// src/app/fonts.ts
import { Koulen, Konkhmer_Sleokchher, Kristi } from "next/font/google";

export const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-koulen",
});

export const konkhmer = Konkhmer_Sleokchher({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-konkhmer",
});

export const kristi = Kristi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kristi",
});
