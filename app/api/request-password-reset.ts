
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import prisma from "../../lib/prisma";
import crypto from "crypto";

// Simple in-memory rate limiter (per email, per IP)
const rateLimitMap = new Map<string, { count: number; last: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max 5 requests per window

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Rate limiting (by email + IP)
  const ip = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "unknown";
  const key = `${email}:${ip}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (entry && now - entry.last < RATE_LIMIT_WINDOW) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: "Too many reset requests. Please try again later." });
    }
    entry.count++;
    entry.last = now;
    rateLimitMap.set(key, entry);
  } else {
    rateLimitMap.set(key, { count: 1, last: now });
  }

  // Generate a secure token and expiry (1 hour)
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

  // Store token and expiry in user record
  const user = await prisma.user.updateMany({
    where: { email },
    data: {
      passwordResetToken: token,
      passwordResetTokenExpiry: expiry,
    },
  });
  if (user.count === 0) {
    return res.status(404).json({ error: "No user found with that email" });
  }

  const resetLink = `https://aris.yourdomain.com/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "arisclocontact@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "arisclocontact@gmail.com",
    to: email,
    subject: "ARIS Password Reset",
    html: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send reset email", details: error });
  }
}
