"use client";

import { useState, type FormEvent } from "react";

type LoginState = "idle" | "submitting" | "success";

export default function LoginPrompt() {
  const [state, setState] = useState<LoginState>("idle");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [showAccessCode, setShowAccessCode] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !accessCode) {
      return;
    }

    setState("submitting");
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.info("ARIS login attempt", { email, accessCode });
    setState("success");
  };

  return (
    <div className="mt-6 w-full rounded-2xl border border-white/10 bg-black/45 px-6 py-6 text-left">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
        Access
      </p>
      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          name="login-email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-full border border-white/10 bg-black/60 px-5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-200 focus:outline-none"
        />

        <label className="sr-only" htmlFor="access-code">
          Access code
        </label>
        <div className="relative">
          <input
            id="access-code"
            name="access-code"
            type={showAccessCode ? "text" : "password"}
            autoComplete="one-time-code"
            required
            placeholder="Access code"
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            className="h-11 w-full rounded-full border border-white/10 bg-black/60 px-5 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-200 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowAccessCode((prev) => !prev)}
            aria-label={showAccessCode ? "Hide access code" : "Show access code"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-200"
          >
            {showAccessCode ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.5 5.2A9.7 9.7 0 0 1 12 5c7 0 10 7 10 7a18.6 18.6 0 0 1-3.5 4.3" />
                <path d="M6.4 6.4C3.7 8 2 12 2 12a17.2 17.2 0 0 0 5.2 6.1A9.6 9.6 0 0 0 12 19c1.2 0 2.3-.2 3.4-.6" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={state === "submitting" || state === "success"}
          className="h-11 rounded-full border border-white/15 bg-transparent text-xs font-medium uppercase tracking-[0.3em] text-zinc-200 transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "success" ? "Access granted" : "Log in"}
        </button>

        <div className="min-h-[18px] text-[10px] uppercase tracking-[0.3em] text-zinc-500" aria-live="polite">
          {state === "success" ? "Welcome back." : ""}
        </div>
      </form>
    </div>
  );
}
