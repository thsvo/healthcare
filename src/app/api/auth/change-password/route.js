import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get current user from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    
    if (!token?.value) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token.value, process.env.JWT_SECRET || "default_secret");
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Both passwords required" }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }
    
    // Find user and verify current password
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
