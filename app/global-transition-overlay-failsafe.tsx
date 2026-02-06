"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTransitionOverlay } from "./transition-overlay-context";

export default function GlobalTransitionOverlay() {
  const { overlayActive, setOverlayActive } = useTransitionOverlay();
  const pathname = usePathname();

  // Failsafe: always turn off overlay on route change
  useEffect(() => {
    setOverlayActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Failsafe: auto-hide overlay after 1s
  useEffect(() => {
    if (!overlayActive) return;
    const timeout = setTimeout(() => setOverlayActive(false), 1000);
    return () => clearTimeout(timeout);
  }, [overlayActive, setOverlayActive]);

  // Fade out animation state
  const [fadingOut, setFadingOut] = useState(false);

  // Listen for overlayActive going false to trigger fade out
  useEffect(() => {
    if (!overlayActive && fadingOut) {
      // After fade out, reset fadingOut
      const timeout = setTimeout(() => setFadingOut(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [overlayActive, fadingOut]);

  // Only render overlay if on the product page route or fading out
  if ((!overlayActive && !fadingOut) || pathname !== "/shop/as-01-cargo-shorts") return null;
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black z-[9999] transition-opacity duration-400 ${!overlayActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      onTransitionEnd={() => {
        if (!overlayActive) setFadingOut(false);
      }}
    >
      <img
        src="/logo1new.png"
        alt="Aris Logo"
        className="w-64 h-32 object-contain select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.12)] transition-opacity duration-400"
        style={{ filter: 'blur(1.5px)', opacity: overlayActive ? 1 : 0 }}
      />
    </div>
  );
}
