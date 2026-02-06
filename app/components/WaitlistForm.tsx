"use client";

import { useState, type FormEvent } from "react";

type FormState = "idle" | "submitting" | "success";
type Mode = "waitlist" | "login";

type WaitlistFormProps = {
  onAccessGranted?: () => void;
};

function generateAccessCode(seed: string) {
  if (seed === "ngaluafeansley@gmail.com") {
    return "ARIS-01";
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash).toString(36).toUpperCase().padStart(6, "0");
  return `ARIS-${code.slice(0, 6)}`;
}

export default function WaitlistForm({ onAccessGranted }: WaitlistFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [mode, setMode] = useState<Mode>("waitlist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !email ||
      (mode === "waitlist" && !password) ||
      (mode === "login" && !accessCode)
    ) {
      return;
    }

    setState("submitting");

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (mode === "waitlist") {
      const generatedCode = generateAccessCode(email.trim().toLowerCase());
      console.info("ARIS waitlist signup", { name, email, password, generatedCode });
      setMessage(`Your access code: ${generatedCode}`);
      setState("success");
      onAccessGranted?.();
      return;
    }

    const expectedCode = generateAccessCode(email.trim().toLowerCase());
    console.info("ARIS login attempt", { email, accessCode });

    if (accessCode.trim().toUpperCase() !== expectedCode) {
      setMessage("Invalid access code.");
      setState("idle");
      return;
    }

    setMessage("");
    setState("success");
    onAccessGranted?.();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 px-8 py-10">
      <div className="flex items-center justify-center gap-4">
        <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
          {mode === "waitlist" ? "Waitlist" : "Access"}
        </p>
      </div>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        {mode === "waitlist" && (
          <>
            <label className="sr-only" htmlFor="name">
              Name (optional)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Name (optional)"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-full border border-white/10 bg-black/60 px-5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-300 focus:outline-none"
            />
          </>
        )}

        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-full border border-white/10 bg-black/60 px-5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-300 focus:outline-none"
        />

        {mode === "waitlist" && (
          <>
            <label className="sr-only" htmlFor="create-password">
              Create password
            </label>
            <div className="relative">
              <input
                id="create-password"
                name="create-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Create password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-full border border-white/10 bg-black/60 px-5 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-200"
              >
                {showPassword ? (
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
          </>
        )}

        {mode === "login" && (
          <>
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
                className="h-12 w-full rounded-full border border-white/10 bg-black/60 px-5 pr-12 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-300 focus:outline-none"
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
          </>
        )}

        <button
          type="submit"
          disabled={state === "submitting" || state === "success"}
          className="h-12 rounded-full border border-white/15 bg-zinc-50 text-sm font-medium uppercase tracking-[0.25em] text-zinc-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "submitting"
            ? "Submitting"
            : mode === "waitlist"
              ? "Request access"
              : "Log in"}
        </button>

        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          <div aria-live="polite">
            {state === "success" && mode === "waitlist" ? message : message}
          </div>
          <button
            type="button"
            onClick={() => {
              setState("idle");
              setMode(mode === "waitlist" ? "login" : "waitlist");
              setMessage("");
            }}
            className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-200"
          >
            {mode === "waitlist" ? "Log in" : "Waitlist"}
          </button>
        </div>
      </form>
    </div>
  );
}
