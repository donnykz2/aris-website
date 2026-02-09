import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "../../../lib/prisma";
import { authenticateUser, createUser } from "../../../lib/auth";

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


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const FROM_EMAIL = "arisclocontact@gmail.com";
  // Use file-based waitlist.json for signup
  const fs = require("fs");
  const path = require("path");
  const waitlistPath = path.join(process.cwd(), "waitlist.json");
  type WaitlistEntry = { email: string; name?: string; accessCode: string; signupDate: string };
  let waitlist: WaitlistEntry[] = [];
  if (fs.existsSync(waitlistPath)) {
    waitlist = JSON.parse(fs.readFileSync(waitlistPath, "utf8"));
  }
  const emailExists = waitlist.some(entry => entry.email === email);
  if (emailExists) {
    return NextResponse.json({ error: "Email already registered." }, { status: 409 });
  }
  const signupDate = new Date().toISOString();
  const safeEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const accessCode = generateAccessCode(safeEmail);
  waitlist.push({ email, name, accessCode, signupDate });
  fs.writeFileSync(waitlistPath, JSON.stringify(waitlist, null, 2));
  // Send signup confirmation email with access code
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error("Missing GMAIL_APP_PASSWORD environment variable.");
    return NextResponse.json({ error: "Email sending is not configured. Please set GMAIL_APP_PASSWORD in your environment." }, { status: 500 });
  }
  if (!FROM_EMAIL) {
    console.error("Missing FROM_EMAIL address.");
    return NextResponse.json({ error: "Email sending is not configured. Please set FROM_EMAIL." }, { status: 500 });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: FROM_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const signupMailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to ARIS – Waitlist Confirmation",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="color-scheme" content="dark light">
        <meta name="supported-color-schemes" content="dark light">
      </head>
      <body style="background:#0a0a0a; color:#e6e6e6; margin:0; padding:0;">
        <div style="background:#111111; color:#e6e6e6; font-family:'Montserrat',Arial,sans-serif; padding:64px 0 56px 0; border-radius:18px; max-width:560px; margin:auto;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#111111; color:#e6e6e6; border-radius:18px; max-width:560px; margin:auto;">
        <tr><td style="text-align:center; padding-bottom:52px;">
          <img src="https://www.arisclo.co/logo1new.png" alt="ARIS Logo" style="height:40px; margin-bottom:28px; opacity:0.85;" />
          <div style="font-size:0.82rem; font-weight:300; letter-spacing:0.28em; color:#dcdcdc; margin-bottom:22px;">A R I S</div>
          <div style="font-size:0.72rem; font-weight:300; letter-spacing:0.32em; color:#bdbdbd; margin-bottom:8px;">ARIS 001</div>
          <div style="font-size:0.72rem; font-weight:300; letter-spacing:0.32em; color:#bdbdbd; margin-bottom:0px;">WAITLIST</div>
        </td></tr>
        <tr><td style="padding-bottom:48px;">
          <div style="font-size:0.88rem; font-weight:300; color:#e6e6e6; margin-bottom:0px; line-height:2.1; letter-spacing:0.08em; max-width:320px; margin-left:auto; margin-right:auto; text-align:left;">
            You’re now part of ARIS 001.<br><br>
            Early access details will be sent before launch.<br><br>
            This release is limited.
          </div>
        </td></tr>
        <tr><td style="text-align:center; padding-bottom:40px;">
          <a href="https://www.arisclo.co" style="display:inline-block; background:#181818; color:#e6e6e6; font-weight:300; letter-spacing:0.22em; padding:10px 24px; border-radius:8px; text-decoration:none; font-size:0.82rem; border:1px solid #222;">ACCESS ARIS</a>
        </td></tr>
        <tr><td style="font-size:0.78rem; color:#888; text-align:center; padding-top:24px;">
          <div style="line-height:1.8; color:#bdbdbd;">This email was sent from a notification-only address.<br>Do not reply.</div>
        </td></tr>
          </table>
        </div>
      </body>
      </html>
    `,
  };
  try {
    const info = await transporter.sendMail(signupMailOptions);
    console.log("Signup email sent:", info);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send signup email", error);
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-ignore
      console.error("SMTP error response:", error.response);
    }
    return NextResponse.json({ error: "Failed to send signup email", details: error?.toString() }, { status: 500 });
  }
}
