"use client";

import { useEffect, useMemo, useState } from "react";

const FALLBACK_LAUNCH_DATE = "2026-06-01T17:00:00Z";

function getLaunchDate(): Date {
  const envDate = process.env.NEXT_PUBLIC_LAUNCH_DATE;
  const value = envDate && envDate.trim().length > 0 ? envDate : FALLBACK_LAUNCH_DATE;
  return new Date(value);
}

function getTimeRemaining(target: Date) {
  const now = Date.now();
  const total = Math.max(target.getTime() - now, 0);

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

export default function Countdown() {
  const launchDate = useMemo(() => getLaunchDate(), []);
  const [remaining, setRemaining] = useState(() => getTimeRemaining(launchDate));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      setRemaining(getTimeRemaining(launchDate));
      const delay = 1000 - (Date.now() % 1000);
      timer = setTimeout(tick, delay);
    };

    tick();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [launchDate]);

  if (isHydrated && remaining.total <= 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 px-8 py-10">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          Launch
        </p>
        <p className="mt-4 text-2xl font-medium text-zinc-50">Launching.</p>
      </div>
    );
  }

  const segments = isHydrated
    ? [
        { label: "Days", value: remaining.days },
        { label: "Hours", value: remaining.hours },
        { label: "Minutes", value: remaining.minutes },
        { label: "Seconds", value: remaining.seconds },
      ]
    : [
        { label: "Days", value: 0 },
        { label: "Hours", value: 0 },
        { label: "Minutes", value: 0 },
        { label: "Seconds", value: 0 },
      ];

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 px-6 py-8">
      <div className="grid grid-cols-2 gap-8 text-left sm:grid-cols-4 sm:gap-6">
        {segments.map((segment) => (
          <div key={segment.label} className="flex flex-col items-center">
            <span className="text-2xl font-semibold tabular-nums text-zinc-50 sm:text-4xl">
              {segment.value.toString().padStart(2, "0")}
            </span>
            <span className="mt-2 text-xs uppercase tracking-[0.35em] text-zinc-500">
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
