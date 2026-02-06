"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useOverlay } from "../../overlay-provider";

const PRODUCT_IMAGE =
  "https://clouddisk.alibaba.com/file/redirectFileUrl.htm?appkey=OneChat&id=4193001407&parentId=4017062499&secOperateAliId=MC1IDX1U2u4AEQdEvHWS-eaHLpgcre_qVbMp016wdSaadaNuc_r2hEjUowhhwgpeC9UOtdI&fileAction=imagePreview&scene=1&format=resize,w_270,h_360/quality,q_80";
const FALLBACK_LAUNCH_DATE = "2026-06-01T17:00:00Z";

function getLaunchDate(): Date {
  const envDate = process.env.NEXT_PUBLIC_LAUNCH_DATE;
  const value = envDate && envDate.trim().length > 0 ? envDate : FALLBACK_LAUNCH_DATE;
  return new Date(value);
}

export default function HoodiePage() {
  const [fadeOut, setFadeOut] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const { trigger: triggerOverlay } = useOverlay();
  const router = useRouter();
  const animating = useRef(false);
  const sizeChartData = [
    { size: 'S', chest: '60 cm / 23.6 in', length: '70 cm / 27.6 in', shoulder: '52 cm / 20.5 in', sleeve: '67 cm / 26.4 in' },
    { size: 'M', chest: '62 cm / 24.4 in', length: '72 cm / 28.3 in', shoulder: '54 cm / 21.3 in', sleeve: '69 cm / 27.2 in' },
    { size: 'L', chest: '64 cm / 25.2 in', length: '73 cm / 28.7 in', shoulder: '55 cm / 21.7 in', sleeve: '70 cm / 27.6 in' },
    { size: 'XL', chest: '66 cm / 26.0 in', length: '74 cm / 29.1 in', shoulder: '56 cm / 22.0 in', sleeve: '71 cm / 28.0 in' },
  ];

  useEffect(() => {
    const launchDate = getLaunchDate();
    const update = () => setIsBeforeLaunch(Date.now() < launchDate.getTime());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`min-h-screen bg-black text-zinc-50 transition-opacity duration-400 ${fadeOut || hideContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}> 
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
              alt='ARIS "AS-01" Hoodie'
              className="w-full h-full object-cover rounded-2xl border border-zinc-800 shadow-md"
            />
          </div>
          <div className="flex flex-col justify-start min-h-[420px] sm:min-h-[540px]">
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-2">
              001 Release
            </p>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              ARIS “AS-01” Hoodie
            </h1>
            <p className="mt-6 text-sm leading-7 text-zinc-200/90 sm:text-base">
              A substantial, luxury hoodie crafted for comfort and presence. The 450 GSM cotton twill delivers a refined drape and quiet confidence, while the integrated adjustable belt and reinforced seams ensure lasting structure and subtle distinction.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 px-6 py-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-zinc-400">
                <span>Purchase Price</span>
                <span className={isBeforeLaunch ? "text-zinc-400" : "line-through text-zinc-500"}>
                  $189 AUD
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.32em] text-zinc-400">
                <span>Retail</span>
                <span className={isBeforeLaunch ? "line-through text-zinc-500" : "text-zinc-400"}>
                  $239 AUD
                </span>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-100 font-semibold mb-1">Fabric</p>
                <p className="mt-2 text-sm text-zinc-200/90">
                  Heavyweight 500 GSM French Terry with thin fleece, structured for shape retention while remaining soft and comfortable on the body.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-100 font-semibold mb-1">Details</p>
                <p className="mt-2 text-sm text-zinc-200/90">
                  Clean-front construction with invisible side-seam pockets, mixed premium print techniques, reinforced seams, and a structured hood with center seam finish.
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
                      <th className="text-left">Chest</th>
                      <th className="text-left">Length</th>
                      <th className="text-left">Shoulder</th>
                      <th className="text-left">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChartData.filter(row => row.size === selectedSize).map(row => (
                      <tr key={row.size} className="bg-zinc-900/60">
                        <td>{row.size}</td>
                        <td>{row.chest}</td>
                        <td>{row.length}</td>
                        <td>{row.shoulder}</td>
                        <td>{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-zinc-200/90 font-medium">
                Cuff opening: 8.5 cm / 3.3 in across all sizes
              </p>
              <p className="mt-4 text-xs text-zinc-200/90 font-medium">
                Designed for a relaxed, structured fit.<br />
                Take your usual size for intended fit, or size up for a looser silhouette
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
