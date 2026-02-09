import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, from, name, accessCode } = req.body;

  // Configure your Gmail SMTP credentials here
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: process.env.GMAIL_APP_PASSWORD, // Use an app password, not your Gmail password
    },
  });

  const mailOptions = {
    from,
    to,
    subject: "ARIS Waitlist Confirmation",
    html: `<div>
      <h2>Welcome to ARIS 001 Waitlist</h2>
      <p>Hi${name ? ", " + name : ""}!</p>
      <p>You’ve successfully joined the ARIS 001 waitlist.</p>
      <p>Your access code: <b>${accessCode}</b></p>
      <p>This email was sent from a notification-only address.<br><b>Do not reply</b> to this email.</p>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error });
  }
}
