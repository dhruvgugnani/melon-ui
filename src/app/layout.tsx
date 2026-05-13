import type { Metadata } from "next";
import { Outfit, Londrina_Sketch, Londrina_Solid, Anton } from "next/font/google";
import "./globals.css";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const londrinaSketchFont = Londrina_Sketch({
  variable: "--font-londrina-sketch",
  subsets: ["latin"],
  weight: "400",
});

const londrinaSolidFont = Londrina_Solid({
  variable: "--font-londrina-solid",
  subsets: ["latin"],
  weight: "400",
});

const antonFont = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "UI | MelonUI Store",
  description: "A premium 3D component storefront.",
};

import { Frame } from "@/components/overlay/Frame";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfitFont.variable} ${londrinaSketchFont.variable} ${londrinaSolidFont.variable} ${antonFont.variable} antialiased h-screen w-full overflow-hidden bg-black`}
    >
      <body className="flex h-screen w-full flex-col font-sans overflow-hidden">
        <Frame />
        {children}
      </body>
    </html>
  );
}
