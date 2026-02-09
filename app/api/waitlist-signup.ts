import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");
const LAUNCH_DATE = new Date(process.env.NEXT_PUBLIC_LAUNCH_DATE || "2026-06-01T17:00:00Z");

function generateAccessCode(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash).toString(36).toUpperCase().padStart(6, "0");
  return `ARIS-${code.slice(0, 6)}`;
}

function storeWaitlistUser(user: any) {
  let users = [];
  if (fs.existsSync(WAITLIST_FILE)) {
    users = JSON.parse(fs.readFileSync(WAITLIST_FILE, "utf-8"));
  }
  users.push(user);
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(users, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.error("Invalid method: ", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, from, name } = req.body;
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    console.error("Invalid or missing 'to' (email) field", req.body);
    return res.status(400).json({ error: "Invalid or missing email address (to)" });
  }
  if (!from || typeof from !== 'string' || !from.includes('@')) {
    console.error("Invalid or missing 'from' (sender) field", req.body);
    return res.status(400).json({ error: "Invalid or missing sender email address (from)" });
  }
  const accessCode = generateAccessCode(to.trim().toLowerCase());

  console.log("Received waitlist signup:", { to, from, name, accessCode });

  // Store user in waitlist
  try {
    storeWaitlistUser({ email: to, name, accessCode, signupDate: new Date().toISOString() });
    console.log("User stored in waitlist.json");
  } catch (storeErr) {
    console.error("Failed to store user in waitlist.json", storeErr);
  }

  // Send signup confirmation email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const signupMailOptions = {
    from,
    to,
    subject: "ARIS Waitlist Confirmation",
    html: `<div>
      <h2>Welcome to ARIS 001 Waitlist</h2>
      <p>Hi${name ? ", " + name : ""}!</p>
      <p>You’ve successfully joined the ARIS 001 waitlist.</p>
      <p>This email was sent from a notification-only address.<br><b>Do not reply</b> to this email.</p>
    </div>`,
  };

  try {
    const info = await transporter.sendMail(signupMailOptions);
    console.log("Signup email sent:", info);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to send signup email", error);
    res.status(500).json({ error: "Failed to send signup email", details: error });
  }
}

// To automate access code emails 30 days before launch, set up a scheduled job to:
// 1. Read waitlist.json
// 2. For each user, send the access code email if today is 30 days before launch
// 3. Mark users as notified
