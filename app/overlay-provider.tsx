"use client";
import { createContext, useContext, useState } from "react";

const OverlayContext = createContext({
  show: false,
  trigger: (cb?: () => void) => {},
});

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [onFinish, setOnFinish] = useState<null | (() => void)>(null);

  const trigger = (cb?: () => void) => {
    setShow(true);
    setOnFinish(() => cb || null);
    setTimeout(() => {
      setShow(false);
      if (cb) setTimeout(cb, 200); // buffer for fade out
    }, 1350); // match animation duration
  };

  return (
    <OverlayContext.Provider value={{ show, trigger }}>
      {children}
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none bg-black/95 transition-colors duration-300">
          <img
            src="/logo1new.png"
            alt="ARIS Logo 1"
            width={256}
            height={256}
            className="animate-logo1-premium"
            style={{ willChange: 'opacity, transform, filter', imageRendering: 'auto' }}
          />
        </div>
      )}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}
