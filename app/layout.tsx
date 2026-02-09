import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { OverlayProvider } from "./overlay-provider";
import { TransitionOverlayProvider } from "./transition-overlay-context";
import GlobalTransitionOverlay from "./global-transition-overlay-failsafe";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARIS® | Luxury Streetwear & Above Standard Clothing",
  description:
    "ARIS is a luxury streetwear brand. Above Standard. Premium materials. Elevated essentials. Join the waitlist for exclusive access.",
  openGraph: {
    title: "ARIS® | Luxury Streetwear & Above Standard Clothing",
    description:
      "ARIS is a luxury streetwear brand. Above Standard. Premium materials. Elevated essentials. Join the waitlist for exclusive access.",
    url: "https://www.arisclo.co/",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "ARIS® | Luxury Streetwear & Above Standard Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARIS® | Luxury Streetwear & Above Standard Clothing",
    description:
      "ARIS is a luxury streetwear brand. Above Standard. Premium materials. Elevated essentials. Join the waitlist for exclusive access.",
    images: ["/og.jpg"],
    site: "@arisclo",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.arisclo.co/",
  },
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon & Apple Touch Icon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Canonical */}
        <link rel="canonical" href="https://www.arisclo.co/" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'ARIS',
                alternateName: ['ARIS Clothing', 'ARIS Clo'],
                slogan: 'Above Standard',
                url: 'https://www.arisclo.co/',
                logo: '/og.jpg',
                sameAs: [], // Add IG/TikTok if available
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'ARIS',
                url: 'https://www.arisclo.co/',
                description: 'ARIS is a luxury streetwear brand. Above Standard. Premium materials. Elevated essentials.',
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-zinc-50 antialiased`}
      >
        <TransitionOverlayProvider>
          <OverlayProvider>
            <GlobalTransitionOverlay />
            {children}
          </OverlayProvider>
        </TransitionOverlayProvider>
      </body>
    </html>
  );
}
