import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "../../lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Missing credentials" });
  }
  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
