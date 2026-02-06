"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useTransitionOverlay } from "../transition-overlay-context";


const FALLBACK_LAUNCH_DATE = "2026-06-01T17:00:00Z";

function getLaunchDate(): Date {
  const envDate = process.env.NEXT_PUBLIC_LAUNCH_DATE;
  const value = envDate && envDate.trim().length > 0 ? envDate : FALLBACK_LAUNCH_DATE;
  return new Date(value);
}

export default function ShopPage() {
  const { overlayActive } = useTransitionOverlay();
  const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);

  useEffect(() => {
    const launchDate = getLaunchDate();
    const update = () => setIsBeforeLaunch(Date.now() < launchDate.getTime());

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fade-in for homepage logo
  const [logoVisible, setLogoVisible] = useState(false);
  useEffect(() => {
    if (!overlayActive) {
      const timeout = setTimeout(() => setLogoVisible(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setLogoVisible(false);
    }
  }, [overlayActive]);

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <header className="flex items-center justify-center px-6 py-6 sm:px-10">
        {!overlayActive && (
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo1new.png"
              alt="ARIS"
              width={256}
              height={256}
              className={`h-12 w-auto sm:h-14 transition-opacity duration-400 ${logoVisible ? 'opacity-100' : 'opacity-0'}`}
              priority
            />
          </Link>
        )}
      </header>

      <main className="px-6 pb-16 sm:px-10">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            const target = document.getElementById("001");
            if (!target) return;
            // Animate scroll with motion blur
            const startY = window.scrollY;
            const endY = target.getBoundingClientRect().top + window.scrollY - 24;
            const duration = 1200;
            let startTime: number | null = null;
            document.body.style.transition = 'filter 0.3s';
            document.body.style.filter = 'blur(8px)';
            function animateScroll(timestamp: number) {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
              window.scrollTo(0, startY + (endY - startY) * ease);
              if (progress < 1) {
                requestAnimationFrame(animateScroll);
              } else {
                setTimeout(() => {
                  document.body.style.filter = '';
                }, 180);
              }
            }
            requestAnimationFrame(animateScroll);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              const target = document.getElementById("001");
              if (!target) return;
              // Animate scroll with motion blur
              const startY = window.scrollY;
              const endY = target.getBoundingClientRect().top + window.scrollY - 24;
              const duration = 1200;
              let startTime: number | null = null;
              document.body.style.transition = 'filter 0.3s';
              document.body.style.filter = 'blur(8px)';
              function animateScroll(timestamp: number) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
                window.scrollTo(0, startY + (endY - startY) * ease);
                if (progress < 1) {
                  requestAnimationFrame(animateScroll);
                } else {
                  setTimeout(() => {
                    document.body.style.filter = '';
                  }, 180);
                }
              }
              requestAnimationFrame(animateScroll);
            }
          }}
          className="group relative block cursor-pointer rounded-3xl border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Scroll down"
        >
          <Image
            src="/model3.png"
            alt="ARIS editorial"
            width={1200}
            height={520}
            className="h-[420px] w-full object-cover sm:h-[520px] transition-transform duration-700 group-hover:scale-[1.025] group-hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.28)]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-10 max-w-xl">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              ARIS 001- The Beginning
            </h1>
            <div className="mx-auto my-8 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
            <p className="intro-polish mt-3 text-sm leading-7 text-zinc-200/90 sm:text-base" style={{maxWidth: '32em', lineHeight: '1.8'}}>
              The inaugural chapter of ARIS sets the standard: engineered silhouettes,
              refined textiles, and deliberate construction for a top-tier wardrobe. ARIS 001
              is a focused statement of precision and restraint, built for those who move
              with purpose.
            </p>
          </div>
        </div>
        <section
          id="001"
          className="mt-12 rounded-3xl border border-white/10 bg-black/40 px-8 py-10 sm:px-12"
        >
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">
              001
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              ARIS 001- The Beginning
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-zinc-200/90 sm:text-base">
              A focused capsule of elevated essentials: precision-cut outerwear, structured
              knit layers, and tailored denim. Each piece is engineered for longevity, quiet
              confidence, and the standard ARIS is known for.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/50 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Material</p>
              <p className="mt-2 text-sm text-zinc-100">
                Italian twill, compact knits, and tailored denim for a refined hand feel.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Form</p>
              <p className="mt-2 text-sm text-zinc-200/90">
                Structured silhouettes with soft mobility, designed to layer cleanly.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Finish</p>
              <p className="mt-2 text-sm text-zinc-200/90">
                Subtle branding, matte hardware, and tonal stitching throughout.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
              001 Clothing
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <Link
                href="/shop/as-01-cargo-shorts"
                className="group overflow-hidden rounded-2xl border border-white/10 bg-black/50 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-black/60 hover:shadow-[0_20px_60px_-30px_rgba(255,255,255,0.25)]"
              >
                <div className="relative">
                  <img
                    src="https://clouddisk.alibaba.com/file/redirectFileUrl.htm?appkey=OneChat&id=4141110265&parentId=4017062499&secOperateAliId=MC1IDX1WzpnzZLjd150h7Ub8TnldKwJ2pdVfsSl1jHpYt4fRrKIVQBDOGJhfF77RicIH0YA&fileAction=imagePreview&scene=1&format=resize,w_270,h_360/quality,q_80"
                    alt="ARIS AS-01 Cargo Shorts"
                    className="h-[360px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 opacity-0 transition-opacity duration-200 ease-out group-hover:bg-black/5 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                    <span className="text-xs uppercase tracking-[0.4em] text-zinc-100">
                      View
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 transition-colors duration-500">
                  <p className="text-sm font-semibold text-zinc-50 transition-colors duration-500 group-hover:text-white">
                    ARIS- "AS-01" Cargo Shorts
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-zinc-500 transition-colors duration-500 group-hover:text-zinc-300">
                    001 Release
                  </p>
                  <div className="mt-3 flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-zinc-400">
                    <span
                      className={
                        isBeforeLaunch
                          ? "text-zinc-400"
                          : "line-through text-zinc-500"
                      }
                    >
                      Waitlist Price: $139 AUD
                    </span>
                    <span
                      className={
                        isBeforeLaunch
                          ? "line-through text-zinc-500"
                          : "text-zinc-400"
                      }
                    >
                      Retail: $179 AUD
                    </span>
                  </div>
                </div>
              </Link>

              <Link
                href="/shop/as-01-hoodie"
                className="group overflow-hidden rounded-2xl border border-white/10 bg-black/50 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-black/60 hover:shadow-[0_20px_60px_-30px_rgba(255,255,255,0.25)]"
              >
                <div className="relative">
                  <img
                    src="https://clouddisk.alibaba.com/file/redirectFileUrl.htm?appkey=OneChat&id=4193001407&parentId=4017062499&secOperateAliId=MC1IDX1U2u4AEQdEvHWS-eaHLpgcre_qVbMp016wdSaadaNuc_r2hEjUowhhwgpeC9UOtdI&fileAction=imagePreview&scene=1&format=resize,w_270,h_360/quality,q_80"
                    alt="ARIS AS-01 Hoodie"
                    className="h-[360px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 opacity-0 transition-opacity duration-200 ease-out group-hover:bg-black/5 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                    <span className="text-xs uppercase tracking-[0.4em] text-zinc-100">
                      View
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 transition-colors duration-500">
                  <p className="text-sm font-semibold text-zinc-50 transition-colors duration-500 group-hover:text-white">
                    ARIS “AS-01” Hoodie
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-zinc-500 transition-colors duration-500 group-hover:text-zinc-300">
                    001 Release
                  </p>
                  <div className="mt-3 flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-zinc-400">
                    <span
                      className={
                        isBeforeLaunch
                          ? "text-zinc-400"
                          : "line-through text-zinc-500"
                      }
                    >
                      Waitlist Price: $179 AUD
                    </span>
                    <span
                      className={
                        isBeforeLaunch
                          ? "line-through text-zinc-500"
                          : "text-zinc-400"
                      }
                    >
                      Retail: $219 AUD
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
