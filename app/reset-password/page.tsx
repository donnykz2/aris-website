"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function isStrongPassword(pw: string) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!newPassword || newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword }),
    });
    if (res.ok) {
      setMessage("Password reset successful! You can now log in.");
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-black/80 rounded-xl border border-white/10">
      <h2 className="text-lg font-bold mb-4 text-zinc-200">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-11 rounded-full border border-white/10 bg-black/60 px-5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-200 focus:outline-none" required />
        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-11 rounded-full border border-white/10 bg-black/60 px-5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-200 focus:outline-none" required />
        <button type="submit" disabled={loading} className="h-11 rounded-full border border-white/15 bg-transparent text-xs font-medium uppercase tracking-[0.3em] text-zinc-200 transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && <div className="text-xs text-zinc-400 text-center mt-2">{message}</div>}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
