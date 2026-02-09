"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOverlay } from "../../overlay-provider";
import { useTransitionOverlay } from "../../transition-overlay-context";

const PRODUCT_IMAGE =
  "https://clouddisk.alibaba.com/file/redirectFileUrl.htm?appkey=OneChat&id=4141110265&parentId=4017062499&secOperateAliId=MC1IDX1WzpnzZLjd150h7Ub8TnldKwJ2pdVfsSl1jHpYt4fRrKIVQBDOGJhfF77RicIH0YA&fileAction=imagePreview&scene=1&format=resize,w_540,h_720/quality,q_90";
const FALLBACK_LAUNCH_DATE = "2026-06-01T17:00:00Z";

function getLaunchDate(): Date {
  const envDate = process.env.NEXT_PUBLIC_LAUNCH_DATE;
  const value = envDate && envDate.trim().length > 0 ? envDate : FALLBACK_LAUNCH_DATE;
  return new Date(value);
}

export default function ProductPage() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const { overlayActive, setOverlayActive } = useTransitionOverlay();
  const [readyToNavigate, setReadyToNavigate] = useState(false);
  const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const { trigger: triggerOverlay } = useOverlay();
  const animating = useRef(false);
  const sizeChartData = [
    { size: 'S', waist: '72–80 cm / 28–31 in', hip: '98 cm / 38.6 in', thigh: '60 cm / 23.6 in', inseam: '76 cm / 29.9 in', outseam: '104 cm / 40.9 in' },
    { size: 'M', waist: '78–86 cm / 31–34 in', hip: '102 cm / 40.2 in', thigh: '62 cm / 24.4 in', inseam: '77 cm / 30.3 in', outseam: '106 cm / 41.7 in' },
    { size: 'L', waist: '84–94 cm / 34–37 in', hip: '106 cm / 41.7 in', thigh: '64 cm / 25.2 in', inseam: '78 cm / 30.7 in', outseam: '108 cm / 42.5 in' },
    { size: 'XL', waist: '92–102 cm / 37–40 in', hip: '110 cm / 43.3 in', thigh: '66 cm / 26.0 in', inseam: '79 cm / 31.1 in', outseam: '110 cm / 43.3 in' },
  ];

  useEffect(() => {
    const launchDate = getLaunchDate();
    const update = () => setIsBeforeLaunch(Date.now() < launchDate.getTime());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (readyToNavigate) {
      setOverlayActive(false);
      Promise.resolve().then(() => router.replace("/shop"));
    }
  }, [readyToNavigate, router, setOverlayActive]);

  useEffect(() => {
    if (fadeOut || hideContent) {
      setOverlayActive(true);
    } else {
      setOverlayActive(false);
    }
  }, [fadeOut, hideContent, setOverlayActive]);

  return (
    <div className="min-h-screen bg-black text-zinc-50 transition-opacity duration-400 opacity-100">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <button
          className="text-xs uppercase tracking-[0.35em] text-zinc-400 transition-colors hover:text-zinc-100 focus:outline-none"
          onClick={() => {
            if (animating.current) return;
            animating.current = true;
            setFadeOut(true);
            setTimeout(() => {
              setHideContent(true);
              triggerOverlay(() => {
                setHideContent(false);
                setFadeOut(false);
                router.replace("/shop");
                animating.current = false;
              });
            }, 400);
          }}
        >
          Back to shop
        </button>
      </header>
      <main className="px-6 pb-16 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="flex items-center justify-center h-[420px] sm:h-[540px] bg-black rounded-3xl border border-white/10 shadow-lg p-4">
            <img
              src={PRODUCT_IMAGE}
              alt='ARIS "AS-01" Cargo Shorts'
              className="w-full h-full object-cover rounded-2xl border border-zinc-800 shadow-md"
            />
          </div>
          <div className="flex flex-col justify-start min-h-[420px] sm:min-h-[540px]">
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-2">
              001 Release
            </p>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              ARIS- "AS-01" Cargo Shorts
            </h1>
            <p className="mt-6 text-sm leading-7 text-zinc-200/90 sm:text-base">
              The AS-01 Cargo Shorts by ARIS are modern luxury clothing. Crafted for comfort and utility, this piece is Above Standard — a refined essential for the elevated wardrobe.
            </p>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Product',
                  name: 'AS-01 Cargo Shorts',
                  description: 'The AS-01 Cargo Shorts by ARIS — modern luxury clothing, crafted for comfort and utility. Above Standard.',
                  image: [PRODUCT_IMAGE],
                  brand: {
                    '@type': 'Brand',
                    name: 'ARIS',
                  },
                  offers: {
                    '@type': 'Offer',
                    priceCurrency: 'AUD',
                    price: '139',
                    availability: 'https://schema.org/InStock',
                    url: 'https://www.arisclo.co/shop/as-01-cargo-shorts',
                  },
                }),
              }}
            />
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 px-6 py-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-zinc-400">
                <span>Purchase Price</span>
                <span className={isBeforeLaunch ? "text-zinc-400" : "line-through text-zinc-500"}>
                  $139 AUD
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.32em] text-zinc-400">
                <span>Retail</span>
                <span className={isBeforeLaunch ? "line-through text-zinc-500" : "text-zinc-400"}>
                  $179 AUD
                </span>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-100 font-semibold mb-1">Fabric</p>
                <p className="mt-2 text-sm text-zinc-200/90">
                  Premium cotton blend, lightweight yet durable, designed for all-day comfort and movement.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-100 font-semibold mb-1">Details</p>
                <p className="mt-2 text-sm text-zinc-200/90">
                  Multiple cargo pockets, reinforced stitching, adjustable waistband, and a modern relaxed fit.
                </p>
              </div>
            </div>
            <div className="mt-10 size-chart-glass px-6 py-6">
              <div className="mb-6 flex gap-3">
                {['S','M','L','XL'].map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 rounded-full border border-white/15 bg-black text-zinc-50 text-sm font-semibold uppercase tracking-widest transition-colors duration-150 ${selectedSize === size ? 'bg-zinc-50 text-zinc-900 border-zinc-50 shadow-md' : 'hover:bg-zinc-900 hover:text-zinc-100'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Quantity</span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 bg-black text-zinc-50 text-lg font-bold transition-colors hover:bg-zinc-900"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="w-8 text-center text-zinc-50 text-base font-semibold select-none">{quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white/15 bg-black text-zinc-50 text-lg font-bold transition-colors hover:bg-zinc-900"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-100 font-semibold mb-4">
                <span className="text-zinc-50 font-semibold text-base mr-2">Size Chart</span>
                <span className="text-zinc-500 text-[11px]">(cm / inch)</span>
              </p>
              <div className="overflow-x-auto">
                <table className="w-full size-chart-table border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                      <th className="text-left">Size</th>
                      <th className="text-left">Waist</th>
                      <th className="text-left">Hip</th>
                      <th className="text-left">Thigh</th>
                      <th className="text-left">Inseam</th>
                      <th className="text-left">Outseam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChartData.filter(row => row.size === selectedSize).map(row => (
                      <tr key={row.size} className="bg-zinc-900/60">
                        <td>{row.size}</td>
                        <td>{row.waist}</td>
                        <td>{row.hip}</td>
                        <td>{row.thigh}</td>
                        <td>{row.inseam}</td>
                        <td>{row.outseam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-zinc-200/90 font-medium">
                Designed for a relaxed, functional fit.<br />
                Take your usual size for intended fit, or size up for a looser silhouette.
              </p>
            </div>
            <button className="mt-8 h-12 w-full rounded-full border border-white/15 bg-zinc-50 text-sm font-medium uppercase tracking-[0.25em] text-zinc-950 transition-opacity hover:opacity-90">
              Purchase
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
