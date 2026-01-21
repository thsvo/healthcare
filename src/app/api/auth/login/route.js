import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    
    console.log("[LOGIN DEBUG] Attempting login for email:", email);

    // Find user
    const user = await User.findOne({ email });
    console.log("[LOGIN DEBUG] User found:", user ? "YES" : "NO");
    
    if (!user) {
      console.log("[LOGIN DEBUG] No user found with email:", email);
      // List all users for debugging
      const allUsers = await User.find({}, { email: 1, role: 1 });
      console.log("[LOGIN DEBUG] All users in DB:", allUsers);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    console.log("[LOGIN DEBUG] Checking password...");
    const isMatch = await user.comparePassword(password);
    console.log("[LOGIN DEBUG] Password match:", isMatch);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // Set token cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      data: { email: user.email, role: user.role },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
