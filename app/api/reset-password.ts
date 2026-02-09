
import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

// Simple in-memory rate limiter (per email, per IP)
const rateLimitMap = new Map<string, { count: number; last: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max 5 requests per window

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Rate limiting (by email + IP)
  const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "unknown";
  const key = `${email}:${ip}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (entry && now - entry.last < RATE_LIMIT_WINDOW) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: "Too many reset attempts. Please try again later." });
    }
    entry.count++;
    entry.last = now;
    rateLimitMap.set(key, entry);
  } else {
    rateLimitMap.set(key, { count: 1, last: now });
  }

  // Find user by email and token, and check expiry
  const user = await prisma.user.findFirst({
    where: {
      email,
      passwordResetToken: token,
      passwordResetTokenExpiry: { gte: new Date() },
    },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  // Hash new password
  const hashed = await bcrypt.hash(newPassword, 10);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });

  res.status(200).json({ success: true });
}
