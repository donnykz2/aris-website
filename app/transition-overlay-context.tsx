"use client";
import React, { createContext, useContext, useState } from "react";

interface TransitionOverlayContextType {
  overlayActive: boolean;
  setOverlayActive: (active: boolean) => void;
}

const TransitionOverlayContext = createContext<TransitionOverlayContextType | undefined>(undefined);

export function TransitionOverlayProvider({ children }: { children: React.ReactNode }) {
  const [overlayActive, setOverlayActive] = useState(false);
  return (
    <TransitionOverlayContext.Provider value={{ overlayActive, setOverlayActive }}>
      {children}
    </TransitionOverlayContext.Provider>
  );
}

export function useTransitionOverlay() {
  const ctx = useContext(TransitionOverlayContext);
  if (!ctx) throw new Error("useTransitionOverlay must be used within a TransitionOverlayProvider");
  return ctx;
}
