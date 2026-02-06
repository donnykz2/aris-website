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
  title: "ARIS — Above Standard",
  description: "ARIS pre-launch access. Above Standard.",
  openGraph: {
    title: "ARIS — Above Standard",
    description: "ARIS pre-launch access. Above Standard.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
