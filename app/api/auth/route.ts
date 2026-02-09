import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 400 });
  }
  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
