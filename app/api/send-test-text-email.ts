import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name } = body;
  const FROM_EMAIL = "arisclocontact@gmail.com";
  if (!process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: "Email sending is not configured. Please set GMAIL_APP_PASSWORD in your environment." }, { status: 500 });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: FROM_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const mailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: "ARIS 001 Waitlist Confirmation (Text Test)",
    text: `ARIS 001 WAITLIST\n\nYou’re now part of ARIS 001.\nEarly access details will be sent before launch.\nThis release is limited.\n\nThis email was sent from a notification-only address. Do not reply.`
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, info });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send test text email", details: error?.toString() }, { status: 500 });
  }
}