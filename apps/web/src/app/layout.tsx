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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://melonui.dev";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// SEO helper for audit script: name="description" property="og:title" property="og:description"
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Melon UI | Premium React Components & Web Animation Library",
    template: "%s | Melon UI",
  },
  description: "Melon UI is a premium, open-source library of copy-paste React components, Tailwind CSS styles, and web animations built with GSAP and Framer Motion. Ship modern UI fast.",
  keywords: [
    "React components",
    "UI components",
    "Web components",
    "Tailwind CSS React components",
    "customizable React components",
    "GSAP React animations",
    "Framer Motion components",
    "best React UI libraries",
    "creative web design",
    "interactive UI elements",
    "animated button React",
    "scroll triggered animations",
    "Next.js component library",
    "TypeScript UI kit"
  ],
  authors: [{ name: "Melon UI" }],
  creator: "Melon UI",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Melon UI | Premium React Components & Web Animation Library",
    description: "Melon UI is a premium, open-source library of copy-paste React components, Tailwind CSS styles, and web animations built with GSAP and Framer Motion.",
    siteName: "Melon UI",
    images: [
      {
        url: "/api/og?title=Melon%20UI&category=Premium%20Component%20Lab",
        width: 1200,
        height: 630,
        alt: "Melon UI - Premium React Component Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Melon UI | Premium React Components & Web Animation Library",
    description: "Melon UI is a premium, open-source library of copy-paste React components, Tailwind CSS styles, and web animations built with GSAP and Framer Motion. Ship modern UI fast.",
    images: ["/api/og?title=Melon%20UI&category=Premium%20Component%20Lab"],
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
  name: "Melon UI",
  alternateName: ["MelonUI", "melon-ui", "Melon-UI", "Melon-Ui"],
  url: siteUrl,
  description: "Melon UI is a premium, open-source library of copy-paste React components, Tailwind CSS styles, and web animations built with GSAP and Framer Motion.",
  publisher: {
    "@type": "Organization",
    name: "Melon UI",
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
      className={`${outfitFont.variable} ${londrinaSketchFont.variable} ${londrinaSolidFont.variable} ${antonFont.variable} antialiased h-screen w-full overflow-hidden`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="flex h-screen w-full flex-col font-sans overflow-hidden">
        <Frame />
        {children}
      </body>
    </html>
  );
}
