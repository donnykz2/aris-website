"use client";
import { useTransitionOverlay } from "./transition-overlay-context";

export default function GlobalTransitionOverlay() {
  const { overlayActive } = useTransitionOverlay();
  if (!overlayActive) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
      <img
        src="/logo1new.png"
        alt="Aris Logo"
        className="w-64 h-32 object-contain select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.12)]"
        style={{ filter: 'blur(1.5px)' }}
      />
    </div>
  );
}
