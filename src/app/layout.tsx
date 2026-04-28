import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
      className={`${outfitFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Frame />
        {children}
      </body>
    </html>
  );
}
