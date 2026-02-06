"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo2 from "../public/logo2.png";
import Countdown from "./components/Countdown";
import WaitlistForm from "./components/WaitlistForm";

export default function Home() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, []);

  const handleEnterShop = () => {
    if (isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    window.setTimeout(() => {
      router.push("/shop");
    }, 700);
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70"
        aria-hidden="true"
      />
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <Image
            src={logo2}
            alt="ARIS"
            priority
            className="h-20 w-auto animate-logo-reveal sm:h-24"
          />
        </div>
      )}

      {isTransitioning && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
          <Image
            src={logo2}
            alt="ARIS"
            priority
            className="h-20 w-auto animate-logo-zoom sm:h-24"
          />
        </div>
      )}

      <main
        className="relative flex min-h-screen items-center justify-center px-6 py-12 transition-opacity duration-1000 ease-in-out"
        style={{ opacity: accessGranted || isLoading ? 0 : 1 }}
      >
        <section id="launch-hero" className="w-full max-w-3xl text-center">
          <div className="mx-auto flex flex-col items-center gap-10 rounded-3xl border border-white/10 bg-black/55 px-8 py-12 backdrop-blur-md sm:px-12">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-5xl font-semibold tracking-[0.2em] text-zinc-50 sm:text-6xl">
                ARIS
              </h1>
              <p className="text-sm font-medium uppercase tracking-[0.45em] text-zinc-300">
                Above Standard.
              </p>
            </div>

            <div className="w-full">
              <Countdown />
            </div>

            <div className="w-full">
              <WaitlistForm onAccessGranted={() => setAccessGranted(true)} />
            </div>
          </div>
        </section>
      </main>

      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-black px-6 transition-opacity duration-1000 ease-in-out"
        style={{
          opacity: accessGranted ? 1 : 0,
          pointerEvents: accessGranted ? "auto" : "none",
        }}
      >
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 text-center">
          <Image
            src={logo2}
            alt="ARIS"
            className="h-12 w-auto"
            priority
          />
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-300">
            Access granted
          </p>
          <a
            href="/shop"
            onClick={(event) => {
              event.preventDefault();
              handleEnterShop();
            }}
            className="flex h-12 w-full max-w-[240px] items-center justify-center rounded-full border border-white/15 bg-zinc-50 px-8 text-sm font-medium uppercase tracking-[0.25em] text-zinc-950 transition-opacity duration-500 ease-in-out hover:opacity-90 animate-soft-glow"
          >
            Enter shop
          </a>
        </div>
      </div>
    </div>
  );
}
