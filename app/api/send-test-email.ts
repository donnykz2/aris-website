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
  const signupMailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: "ARIS 001 Waitlist Confirmation (Test)",
    html: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#101010; color:#e0e0e0; font-family:'Montserrat',Arial,sans-serif; padding:64px 0 56px 0; border-radius:18px; max-width:420px; margin:auto;">
        <tr><td style="text-align:center; padding-bottom:52px;">
          <img src="https://www.arisclo.co/logo1new.png" alt="ARIS Logo" style="height:40px; margin-bottom:28px; opacity:0.85;" />
          <div style="font-size:0.82rem; font-weight:300; letter-spacing:0.22em; color:#d0d0d0; margin-bottom:22px;">A R I S</div>
          <div style="font-size:0.72rem; font-weight:400; letter-spacing:0.28em; color:#bdbdbd; margin-bottom:8px;">ARIS 001</div>
          <div style="font-size:0.72rem; font-weight:300; letter-spacing:0.28em; color:#bdbdbd; margin-bottom:0px;">WAITLIST</div>
        </td></tr>
        <tr><td style="padding-bottom:48px;">
          <div style="font-size:0.88rem; font-weight:300; color:#c8c8c8; margin-bottom:0px; line-height:2.1; letter-spacing:0.06em; max-width:260px; margin-left:auto; margin-right:auto; text-align:left;">
            You’re now part of ARIS 001.<br><br>
            Early access details will be sent before launch.<br><br>
            This release is limited.
          </div>
        </td></tr>
        <tr><td style="text-align:center; padding-bottom:40px;">
          <a href="https://www.arisclo.co" style="display:inline-block; background:#181818; color:#e0e0e0; font-weight:400; letter-spacing:0.22em; padding:10px 24px; border-radius:8px; text-decoration:none; font-size:0.82rem; border:1px solid #222;">ACCESS ARIS</a>
        </td></tr>
        <tr><td style="font-size:0.78rem; color:#888; text-align:center; padding-top:24px;">
          <div style="line-height:1.8;">This email was sent from a notification-only address.<br>Do not reply.</div>
        </td></tr>
      </table>
    `,
  };
  try {
    const info = await transporter.sendMail(signupMailOptions);
    return NextResponse.json({ success: true, info });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send test email", details: error?.toString() }, { status: 500 });
  }
}