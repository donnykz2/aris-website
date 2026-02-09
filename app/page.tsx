
import Image from "next/image";
import logo2 from "../public/logo2.png";
import Countdown from "./components/Countdown";
import WaitlistForm from "./components/WaitlistForm";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70"
        aria-hidden="true"
      />
      <main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-12 sm:py-16">
        <section id="launch-hero" className="w-full max-w-3xl text-center">
          <div className="mx-auto flex flex-col items-center rounded-3xl border border-white/10 bg-black/55 px-4 pt-8 pb-4 sm:px-16 sm:pt-16 sm:pb-6 backdrop-blur-md">
            {/* Section 1: Identity */}
            <div className="flex flex-col items-center gap-4 sm:gap-8 mb-14 sm:mb-20">
              <h1 className="text-3xl sm:text-4xl font-light tracking-[0.03em] text-zinc-200 leading-[1.25]">
                ARIS
              </h1>
              <p className="text-sm font-medium uppercase tracking-[0.45em] text-zinc-300">
                Above Standard.
              </p>
            </div>

            {/* Section 2: Countdown */}
            <div className="w-full mb-14 sm:mb-20">
              <Countdown />
            </div>

            {/* Section 3: (Removed brand sentence) */}
            {/* No brand sentence in hero section per brand guidelines */}

            {/* Section 4: Waitlist Form + Brand Description + Brand Footnote */}
            <div className="w-full mb-10 sm:mb-16">
              <div className="w-full">
                <WaitlistForm />
              </div>
              <div className="mt-4 w-full">
                <p className="mt-2 text-[0.85rem] text-zinc-500 text-center font-light tracking-[0.03em] max-w-[22ch] sm:max-w-[28ch] mx-auto">
                  ARIS Clothing / ARIS Clo
                </p>
                <p className="mt-1 text-[0.85rem] text-zinc-500 text-center font-light tracking-[0.03em] max-w-[36ch] mx-auto">
                  luxury streetwear, elevated essentials, premium fabrics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
