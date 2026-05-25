import type { Metadata, Viewport } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://melonui.com";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MelonUI | Premium Gen-Z Component Lab",
    template: "%s | MelonUI",
  },
  description: "A premium, futuristic 3D component lab for fresh, internet-native interface pieces. Copy, paste, and ship beautifully animated components.",
  keywords: ["MelonUI", "UI Components", "Next.js", "React Components", "GSAP", "Three.js", "Gen-Z Design", "Premium UI", "Frontend", "Animations"],
  authors: [{ name: "MelonUI" }],
  creator: "MelonUI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "MelonUI | Premium Gen-Z Component Lab",
    description: "A premium, futuristic 3D component lab for fresh, internet-native interface pieces.",
    siteName: "MelonUI",
    images: [
      {
        url: "/api/og?title=MelonUI&category=Premium%20Component%20Lab",
        width: 1200,
        height: 630,
        alt: "MelonUI - Premium UI Component Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MelonUI | Premium Gen-Z Component Lab",
    description: "A premium, futuristic 3D component lab for fresh, internet-native interface pieces.",
    images: ["/api/og?title=MelonUI&category=Premium%20Component%20Lab"],
    creator: "@melonui",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MelonUI",
  url: siteUrl,
  description: "A premium, futuristic 3D component lab for fresh, internet-native interface pieces.",
  publisher: {
    "@type": "Organization",
    name: "MelonUI",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/favicon.ico`
    }
  }
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex h-screen w-full flex-col font-sans overflow-hidden">
        <Frame />
        {children}
      </body>
    </html>
  );
}
